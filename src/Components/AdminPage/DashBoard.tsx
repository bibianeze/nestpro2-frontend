import React, { useContext, useState, useEffect } from "react";
import { PropertyContext } from "./AddProperty";
import { ManageContext } from "./ManageProperty";
import up from "/src/assets/up.png"
import down from "/src/assets/down.png"
import Pagination from "../Universal/Pagination";

// ---- BACKEND: imported getUsersCount from api service ----
import { getUsersCount } from "../../services/api";

const Dashboard: React.FC = () => {
  const { properties, deleteProperty, setEditingProperty } = useContext(PropertyContext)!;
  const { setActivePage } = useContext(ManageContext)!;

  const totalProperties = properties.length;

  // ---- BACKEND UPDATED: filter using correct sale field ----
  const activeListings = properties.filter(
    property => property.sale === "For Sale" || property.sale === "For Rent"
  ).length;

  // ---- BACKEND UPDATED: filter drafts correctly ----
  const pendingProperties = properties.filter(property => property.isDraft === true).length;

// ---- BACKEND ADDED: fetch real users count from backend ----
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const data = await getUsersCount();
        if (data.success) {
          setTotalUsers(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch users count:", error);
      }
    };
    fetchUsersCount();
  }, []);

  const StatCard = ({ title, value, image, percent }: {
    title: string;
    value: number;
    image: string;
    percent: string;
  }) => (
    <div className="bg-white p-2 rounded-xl border-[1px] border-[#1A3C34]">
      <p className="text-[#23272E] text-[18px] font-bold font-['Lato']">{title}</p>
      <div className="flex gap-1 mt-3 relative">
        <h2 className="text-[28px] font-bold text-[#023337]">{value.toLocaleString()}</h2>
        <div className="flex items-end">
          <span className="flex items-center text-[#21C45D] mb-2 text-[11px] font-medium">
            <img className="w-2 h-2" src={image} alt="" />{percent}
          </span>
        </div>
      </div>
    </div>
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, _setPostPerPage] = useState(4);

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;

  // ---- BACKEND UPDATED: properties already sorted by createdAt desc from backend ----
  const currentPropertyPagin = properties.slice(firstPostIndex, lastPostIndex);

  return (
    <div className="flex flex-col bg-[#F3F4F6] w-288 h-200">
      <div>
        {/* Nav Bar */}
        <nav className="w-full h-[76px] bg-white px-10 flex items-center sticky top-0 z-10">
          <h1 className="font-['Lato'] font-bold text-[22px] text-[#023337]">Dashboard</h1>
        </nav>

        <div className="px-10 py-8">
          {/* Section 1 */}
          <div className="flex justify-between items-center mb-10">
            <div className="w-[138px] h-[55px] gap-[12px]">
              <h1 className="font-['Lato'] font-bold text-[22px] text-[#023337]">DashBoard</h1>
              <p className="text-[14px] w-[138px] h-[17px] font-normal text-[#000000] font-['Lato']">Welcome back, Admin</p>
            </div>
            <button
              onClick={() => setActivePage("Add Property")}
              className="bg-[#1A3C34] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#023337] transition-all shadow-md">
              Add Property
            </button>
          </div>

          {/* Section 2 — Stats */}
          <div className="grid grid-cols-4 gap-6">
            <StatCard title="Total Properties" value={totalProperties} image={up} percent="+12%" />
            <StatCard title="Total Users" value={totalUsers} image={up} percent="+10%" />
            <StatCard title="Active Listings" value={activeListings} image={up} percent="+5%" />
            <StatCard title="Pending Properties" value={pendingProperties} image={down} percent="+5%" />
          </div>

          {/* Recent Properties Table */}
          <div className="mt-12 bg-white overflow-hidden">
            <div className="px-8 py-6 flex justify-between items-center">
              <h3 className="font-medium w-[300px] h-[29px] font-['Lato'] text-[24px] text-[#000000]">
                Recent Properties
              </h3>
              <button
                onClick={() => setActivePage("All Properties")}
                className="text-[#4F887B] text-[14px] font-bold hover:underline">
              </button>
            </div>

            <div className="px-5 h-90">
              <table className="w-full">
                <thead className="rounded-[6px]">
                  <tr className="bg-[#B1FFED] items-center text-[#023337] text-[15px] font-medium">
                    <th className="px-6 py-4 text-center">Property</th>
                    <th className="px-6 py-4 text-center">Type</th>
                    <th className="px-10 py-4 text-center">Location</th>
                    <th className="px-8 py-4 text-center">Price</th>
                    <th className="px-8 py-4 text-center">Listing</th>
                    <th className="px-8 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {currentPropertyPagin.map((proper) => (
                    // ---- BACKEND UPDATED: key uses _id instead of id ----
                    <tr key={proper._id} className="">
                      <td className="px-4 py-4 w-[300px]">
                        <div className="flex items-center gap-3">
                          {/* ---- BACKEND UPDATED: images array instead of image ---- */}
                          {proper.images && proper.images.length > 0 && (
                            <img
                              src={proper.images[0]}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover border border-[#E5E7EB]"
                            />
                          )}
                          <span className="font-bold text-[#0A1916] text-[15px]">
                            {proper.propertyName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-[#4F887B] text-[14px]">{proper.propertyType}</td>
                      <td className="px-4 py-5 text-[#4F887B] text-[14px] truncate max-w-[200px]">
                        {proper.location.fullAddress}
                      </td>
                      <td className="px-8 py-5 font-bold text-[#1A3C34]">₦{proper.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${proper.sale === "For Sale" ? "bg-[#10B981]" : "bg-[#F59E0B]"}`}></span>
                          <span className="text-[#023337] font-medium text-[14px]">{proper.sale}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => { setEditingProperty(proper); setActivePage("Update Property"); }}
                            className="text-[#21C45D] font-bold text-[13px]">
                            Edit
                          </button>
                          <span className="text-[#21C45D]">/</span>
                          {/* ---- BACKEND UPDATED: deleteProperty uses _id instead of id ---- */}
                          <button
                            onClick={() => deleteProperty(proper._id)}
                            className="text-red-500 font-bold text-[13px]">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {properties.length === 0 && (
              <div className="py-20 text-center text-[#75928B]">No properties found.</div>
            )}
          </div>
        </div>

        <div className='w-full'>
          <Pagination
            totalPosts={properties.length}
            postPerPage={postPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;