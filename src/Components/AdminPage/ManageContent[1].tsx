import React, { useContext, useState } from "react"
import { PropertyContext } from "./AddProperty"
import { ManageContext } from "./ManageProperty"
import search from "/src/assets/searchm.png"
import Pagination from "../Universal/Pagination"
import Modal from "../Universal/Modal"

// ---- BACKEND: imported updateProperty to publish drafts ----
import { updateProperty as updatePropertyAPI } from "../../services/api"

export const ManageContent: React.FC = () => {
  const propertiesContext = useContext(PropertyContext)
  const manageContext = useContext(ManageContext)

  if (!propertiesContext || !manageContext) {
    return <p>Content loading...</p>
  }

  const { properties, deleteProperty, setEditingProperty, updateProperty } = propertiesContext
  const { activepage, setActivePage, searchBar, setSearchBar } = manageContext

  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, _setPostPerPage] = useState(6);

  // ---- BACKEND ADDED: modal state for success and error messages ----
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPropertyPagin = properties.slice(firstPostIndex, lastPostIndex);

  const filteredProperties = currentPropertyPagin.filter((property) => {
    let pageMatch = false;
    if (activepage === "All Properties") pageMatch = true;
    else if (activepage === "Featured") pageMatch = property.isFeatured === true;
    else if (activepage === "Draft") pageMatch = property.isDraft === true;
    else pageMatch = property.sale === activepage;

    const matchSearch =
      (property.propertyName.toLowerCase() || "").includes(searchBar.toLowerCase()) ||
      property.propertyType.toLowerCase().includes(searchBar.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchBar.toLowerCase()) ||
      property.location.state.toLowerCase().includes(searchBar.toLowerCase());

    return pageMatch && matchSearch;
  });

  // ---- BACKEND ADDED: publish a draft property directly from manage table ----
  const handlePublishDraft = async (propertyId: string) => {
    try {
      // ---- find the property we want to publish ----
      const prop = properties.find((p) => p._id === propertyId);
      if (!prop) return;

      // ---- build full FormData with all existing property data ----
      const formData = new FormData();
      formData.append("propertyName", prop.propertyName);
      formData.append("price", String(prop.price));
      formData.append("propertyDescription", prop.propertyDescription);
      formData.append("propertyType", prop.propertyType);
      formData.append("sale", prop.sale);
      formData.append("city", prop.location.city);
      formData.append("state", prop.location.state);
      formData.append("fullAddress", prop.location.fullAddress);
      formData.append("bedrooms", String(prop.propertyDetails.bedrooms));
      formData.append("bathroom", String(prop.propertyDetails.bathroom));
      formData.append("size", String(prop.propertyDetails.size));
      formData.append("amenities", JSON.stringify(prop.amenities));
      formData.append("isFeatured", String(prop.isFeatured));
      formData.append("agentName", prop.agentName || "");
      formData.append("agentPhone", prop.agentPhone || "");
      formData.append("discount", prop.discount || "");
      // ---- set isDraft to false to publish ----
      formData.append("isDraft", "false");

      const result = await updatePropertyAPI(propertyId, formData);

      if (result.success) {
        updateProperty(result.property);
        setModal({
          show: true,
          type: "success",
          message: "Property published successfully!",
        });
      } else {
        setModal({
          show: true,
          type: "error",
          message: result.message || "Failed to publish property",
        });
      }
    } catch (error) {
      setModal({
        show: true,
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  // ---- BACKEND ADDED: delete with modal confirmation ----
  const handleDelete = async (propertyId: string) => {
    await deleteProperty(propertyId);
  };

  return (
    <div className="flex flex-col bg-[#F3F4F6] pb-10 h-277">
      <div>
        {/* NavBar */}
        <nav className="h-19 w-287.5 bg-white px-10 flex items-center border-b border-[#BAB9B9] z-10">
          <div className="flex h-[26px] justify-between">
            <h1 className="w-[188px] h-[26px] font-['Lato'] font-bold text-[22px] text-[#023337]">
              Manage Properties
            </h1>
          </div>
        </nav>

        <div className="px-10 py-8">
          {/* Section 1 */}
          <div className="flex justify-between items-center mb-8 h-[55px]">
            <div className="flex flex-col w-[279px] h-[55px] gap-[12px]">
              <h2 className="font-bold w-[279px] h-[26px] text-[22px] text-[#023337] font-['Lato']">
                Manage Properties
              </h2>
              <p className="text-[14px] text-[#000000] font-['Lato'] font-normal">
                Fill in the details below to list a new property
              </p>
            </div>
            <div className="flex flex-row w-[148px] h-[48px] rounded-[8px] pl-[10px] bg-[#1A3C34]">
              <button
                onClick={() => setActivePage("Add Property")}
                className="font-['Lato'] font-bold text-[15px] text-[#FFFFFF]">
                Add New Property
              </button>
            </div>
          </div>

          <div className="flex bg-[#FFFFFF] flex-col h-[880px] rounded-[8px] px-4">

            {/* Search Bar */}
            <div className="flex flex-row gap-[20px] py-4 rounded-xl mb-6 justify-between">
              <div className="flex flex-row w-[480px] h-[40px] rounded-[8px] p-[4px] bg-[#D7FFF6]">
                {(["All Properties", "For Sale", "For Rent", "Featured", "Draft"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePage(tab)}
                    className={`px-4 py-2 rounded-md text-[15px] font-medium transition-all ${activepage === tab ? "bg-white text-[#414242] shadow-sm" : "text-[#75928B]"}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-[200px] h-[40px] rounded-[8px] py-[6px] pr-[8px] pl-[12px] gap-[6px] bg-[#EFF8F6]">
                <input
                  type="text"
                  placeholder="Search properties"
                  value={searchBar}
                  onChange={(e) => setSearchBar(e.target.value)}
                  className="relative w-full h-[20px] text-[14px] font-['Lato'] pl-4 pr-10 outline-none"
                />
                <div>
                  <img className="absolute top-2 right-0" src={search} alt="" />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="flex flex-col overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#B1FFED] h-[56px]">
                    <th className="text-[15px] font-medium text-[#023337]">Property</th>
                    <th className="text-[15px] font-medium text-[#023337]">Type</th>
                    <th className="text-[15px] font-medium text-[#023337]">Location</th>
                    <th className="text-[15px] font-medium text-[#023337]">Price</th>
                    <th className="text-[15px] font-medium text-[#023337]">Status</th>
                    <th className="text-[15px] font-medium text-[#023337]">Actions</th>
                  </tr>
                </thead>

                <tbody className="h-[86px] border-b-[1px] border-b-[#F3EBE7] justify-between">
                  {filteredProperties.map((property) => (
                    <tr key={property._id} className="w-[203px] h-[40px] gap-[12px]">
                      <td className="px-4 py-4 w-[300px]">
                        <div className="flex items-center gap-3">
                          {/* ---- BACKEND UPDATED: images array instead of image ---- */}
                          {property.images && property.images.length > 0 && (
                            <img
                              src={property.images[0]}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover border border-[#E5E7EB]"
                            />
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-[#0A1916] text-[15px]">
                              {property.propertyName}
                            </span>
                            {/* ---- BACKEND ADDED: show Draft badge on draft properties ---- */}
                            {property.isDraft && (
                              <span className="text-[11px] text-orange-500 font-medium">Draft</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-[#403F3F] text-[14px]">{property.propertyType}</td>
                      <td className="px-6 py-4 text-[#403F3F] text-[14px] truncate">{property.location.fullAddress}</td>
                      <td className="px-6 py-4 font-bold text-[#023337]">₦{property.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* ---- BACKEND UPDATED: show Draft status for draft properties ---- */}
                          <span className={`w-2 h-2 rounded-full ${
                            property.isDraft ? "bg-orange-400" :
                            property.sale === "For Sale" ? "bg-[#10B981]" : "bg-[#F59E0B]"
                          }`}></span>
                          <span className="text-[#023337] font-medium text-[14px]">
                            {property.isDraft ? "Draft" : property.sale}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2 flex-wrap">
                          {/* ---- Edit button — always shown ---- */}
                          <button
                            onClick={() => { setEditingProperty(property); setActivePage("Update Property"); }}
                            className="text-[#21C45D] font-normal text-[15px]">
                            Edit
                          </button>
                          <span className="text-[#21C45D]">/</span>

                          {/* ---- BACKEND ADDED: Publish button only for draft properties ---- */}
                          {property.isDraft && (
                            <>
                              <button
                                onClick={() => handlePublishDraft(property._id)}
                                className="text-[#1A3C34] font-normal text-[15px] hover:underline">
                                Publish
                              </button>
                              <span className="text-[#21C45D]">/</span>
                            </>
                          )}

                          {/* ---- Delete button — always shown ---- */}
                          <button
                            onClick={() => handleDelete(property._id)}
                            className="text-[#FF0000] font-normal text-[15px] hover:underline">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProperties.length === 0 && (
                <div className="py-20 text-center text-[#75928B]">
                  <p>No properties found for your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Pagination
          totalPosts={properties.length}
          postPerPage={postPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>

      {/* ---- BACKEND ADDED: modal for success and error messages ---- */}
      {modal.show && (
        <Modal
          type={modal.type}
          message={modal.message}
          onClose={() => setModal({ ...modal, show: false })}
        />
      )}
    </div>
  )
}

export default ManageContent