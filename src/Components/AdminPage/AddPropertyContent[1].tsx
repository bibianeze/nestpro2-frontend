import React, { useState, useEffect, useContext } from "react";
import { useProperties } from "./AddProperty";
import { type PropertyType } from "./AddProperty";
import { ManageContext } from "./ManageProperty";
import upload from "/src/assets/upload.png"
import browse from "/src/assets/browse.png"
import save from "/src/assets/save.png"

// ---- BACKEND: imported api functions ----
import { createProperty, updateProperty as updatePropertyAPI } from "../../services/api";

// ---- BACKEND ADDED: imported Modal component ----
import Modal from "../Universal/Modal";

// ---- BACKEND ADDED: imported Nigeria states data ----
import { allStates, getCitiesByState } from "../../data/nigeriaStates";

export const AddPropertyContent: React.FC = () => {
  const { publishProperty, updateProperty, editingProperty, setEditingProperty } = useProperties();
  const manageContext = useContext(ManageContext);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const [form, setForm] = useState<PropertyType>({
    _id: "",
    propertyName: "",
    price: 0,
    propertyDescription: "",
    propertyType: "House",
    sale: "For Sale",
    location: { city: "", state: "", fullAddress: "" },
    propertyDetails: { bedrooms: 0, bathroom: 0, size: 0 },
    images: [],
    amenities: [],
    isFeatured: false,
    isDraft: false,
    agentName: "",
    agentPhone: "",
    discount: "",
  });

  useEffect(() => {
    if (editingProperty) {
      setForm(editingProperty);
      setImagePreviews(editingProperty.images || []);
      setImageFiles([]);
    } else {
      setImagePreviews([]);
      setImageFiles([]);
    }
  }, [editingProperty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "price" ? Number(value) : value }));
  };

  const nestedHandleChange = (section: 'location' | 'propertyDetails', field: string, value: any) => {
    setForm(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImageFiles(prev => [...prev, ...filesArray]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (status: 'publish' | 'draft') => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("propertyName", form.propertyName);
      formData.append("price", String(form.price));
      formData.append("propertyDescription", form.propertyDescription);
      formData.append("propertyType", form.propertyType);
      formData.append("sale", form.sale);
      formData.append("city", form.location.city);
      formData.append("state", form.location.state);
      formData.append("fullAddress", form.location.fullAddress);
      formData.append("bedrooms", String(form.propertyDetails.bedrooms));
      formData.append("bathroom", String(form.propertyDetails.bathroom));
      formData.append("size", String(form.propertyDetails.size));
      formData.append("amenities", JSON.stringify(form.amenities));
      formData.append("isFeatured", String(form.isFeatured));
      formData.append("isDraft", status === 'draft' ? "true" : "false");
      formData.append("agentName", form.agentName);
      formData.append("agentPhone", form.agentPhone);
      formData.append("discount", form.discount);
      imageFiles.forEach((file) => formData.append("images", file));

      let result;
      if (editingProperty) {
        result = await updatePropertyAPI(editingProperty._id, formData);
        if (result.success) {
          updateProperty(result.property);
          setModal({ show: true, type: "success", message: "Property updated successfully!" });
        } else {
          setModal({ show: true, type: "error", message: result.message || "Failed to update property" });
        }
      } else {
        result = await createProperty(formData);
        if (result.success) {
          publishProperty(result.property);
          setModal({
            show: true, type: "success",
            message: status === 'draft' ? "Property saved to drafts!" : "Property published successfully!",
          });
        } else {
          setModal({ show: true, type: "error", message: result.message || "Failed to save property" });
        }
      }
    } catch (error) {
      setModal({ show: true, type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

//   const handleModalClose = () => {
//     setModal({ ...modal, show: false });
//     if (modal.type === "success") {
//       setEditingProperty(null);
//       manageContext?.setActivePage("All Properties");
//     }
//   };
const handleModalClose = () => {
  setModal({ ...modal, show: false });
  if (modal.type === "success") {
    setEditingProperty(null);
    manageContext?.setActivePage("All Properties");
    // ---- BACKEND ADDED: clear form after successful publish ----
    setForm({
      _id: "",
      propertyName: "",
      price: 0,
      propertyDescription: "",
      propertyType: "House",
      sale: "For Sale",
      location: { city: "", state: "", fullAddress: "" },
      propertyDetails: { bedrooms: 0, bathroom: 0, size: 0 },
      images: [],
      amenities: [],
      isFeatured: false,
      isDraft: false,
      agentName: "",
      agentPhone: "",
      discount: "",
    });
    // ---- clear image previews too ----
    setImageFiles([]);
    setImagePreviews([]);
  }
};

  const amenityList = ["Security", "Garden", "Water", "Electricity", "Gym", "Pool"];

  return (
    <div className="flex flex-col bg-[#E5E7EB] pb-20 overflow-auto">
      <nav className="h-[76px] bg-white px-10 flex items-center border-b border-[#BAB9B9]">
        <h1 className="font-['Lato'] font-bold text-[22px] text-[#023337]">Add New Property</h1>
      </nav>

      <div className="flex justify-between px-10 py-8 items-center">
        <div className="flex flex-col gap-[12px]">
          <h1 className="font-bold font-['Lato'] w-[279px] h-[26px] text-[22px] text-[#023337]">Add New Property</h1>
          <p className="font-['Lato'] text-[14px] text-[#000000]">Fill in the details below to list a new property</p>
        </div>
        <div className="flex gap-3">
          <div className="w-[140px] h-[48px] rounded-[8px] border-[1px] py-[6px] pl-[12px] pt-[10px] border-[#75928B] bg-[#1A3C34] items-center">
            <button onClick={() => handleSubmit('publish')} disabled={isLoading} className="font-700 text-[15px] font-['Lato'] text-[#FFFFFF] font-bold disabled:opacity-50">
              {isLoading ? "Saving..." : editingProperty ? "Update Property" : "Publish Property"}
            </button>
          </div>
          <div className="flex w-[140px] h-[48px] rounded-[8px] border-[1px] py-[6px] pl-[20px] bg-[#FFFFFF] border-[#75928B] gap-2 items-center">
            <img className="w-[12.8px] h-[12.8px]" src={save} alt="" />
            <button onClick={() => handleSubmit('draft')} disabled={isLoading} className="font-700 font-['Lato'] font-bold text-[15px] text-[#031D17] disabled:opacity-50">
              Save to Draft
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-3 px-5">
        {/* INPUT FORM */}
        <div className="bg-white p-5">
          <div className="w-[563px] h-[26px] gap-[3px] mb-5">
            <h2 className="font-bold font-['Lato'] w-[563px] h-[26px] text-[22px] text-[#1A3C34]">Basic Information</h2>
          </div>

          {/* Property Title */}
          <div className="flex flex-col w-[563px] h-[79px] gap-[12px]">
            <label className="font-['Lato'] text-[16px] font-bold text-[#444545]">Property Title</label>
            <input className="w-[563px] h-[48px] rounded-[8px] border-[1px] px-[12px] border-[#E5E7EB] bg-[#F9FAFB] outline-none" name="propertyName" value={form.propertyName} onChange={handleChange} />
          </div>

          {/* Description */}
          <div className="flex flex-col pt-5 w-[563px] h-[186px] gap-[12px]">
            <label className="font-bold font-['Lato'] text-[16px] text-[#444545]">Property Description</label>
            <textarea className="border-[#E5E7EB] w-[563px] h-[155px] rounded-[8px] border-[1px] p-3 bg-[#F9FAFB] resize-none outline-none" name="propertyDescription" value={form.propertyDescription} onChange={handleChange} />
          </div>

          {/* Price */}
          <div className="flex flex-col pt-10 w-[563px] gap-[12px]">
            <label className="font-['Lato'] text-[18px] font-bold text-[#444545]">Price (₦)</label>
            <input className="border-[1px] rounded-[8px] w-[563px] h-[48px] px-[12px] bg-[#F9FAFB] border-[#E5E7EB] outline-none" name="price" type="number" value={form.price} onChange={handleChange} />
          </div>

          {/* Property Type & Listing Status */}
          <div className="flex gap-[20px] pt-10">
            <div className="flex flex-col gap-[12px] w-[271.5px]">
              <label className="font-bold font-['Lato'] text-[15px] text-[#444545]">Property Type</label>
              <select name="propertyType" value={form.propertyType} onChange={handleChange} className="border-[1px] border-[#E5E7EB] rounded-[8px] h-[48px] outline-none bg-[#F9FAFB]">
                <option value="">Select Type</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Duplex">Duplex</option>
                <option value="Apartment">Apartment</option>
                <option value="Residential">Residential</option>
              </select>
            </div>
            <div className="flex flex-col gap-[12px] w-[271.5px]">
              <label className="font-bold font-['Lato'] text-[15px] text-[#444545]">Listing Status</label>
              <select name="sale" value={form.sale} onChange={handleChange} className="border-[1px] border-[#E5E7EB] rounded-[8px] h-[48px] outline-none bg-[#F9FAFB]">
                <option value="">Select status</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
              </select>
            </div>
          </div>

          {/* Agent Info */}
          <div className="flex gap-[20px] pt-10">
            <div className="flex flex-col gap-[12px] w-[271.5px]">
              <label className="font-bold font-['Lato'] text-[15px] text-[#444545]">Agent Name</label>
              <input className="border-[1px] rounded-[8px] h-[48px] px-[12px] bg-[#F9FAFB] border-[#E5E7EB] outline-none" name="agentName" value={form.agentName} onChange={handleChange} placeholder="Agent name" />
            </div>
            <div className="flex flex-col gap-[12px] w-[271.5px]">
              <label className="font-bold font-['Lato'] text-[15px] text-[#444545]">Agent Phone</label>
              <input className="border-[1px] rounded-[8px] h-[48px] px-[12px] bg-[#F9FAFB] border-[#E5E7EB] outline-none" name="agentPhone" value={form.agentPhone} onChange={handleChange} placeholder="+234 800 000 0000" />
            </div>
          </div>

          {/* Discount */}
          <div className="flex flex-col pt-5 gap-[12px]">
            <label className="font-bold font-['Lato'] text-[15px] text-[#444545]">Discount (optional e.g 10%)</label>
            <input className="w-[563px] border-[1px] rounded-[8px] h-[48px] px-[12px] bg-[#F9FAFB] border-[#E5E7EB] outline-none" name="discount" value={form.discount} onChange={handleChange} placeholder="e.g 10%" />
          </div>

          {/* Location */}
          <div className="pt-10">
            <h3 className="font-bold text-[18px] text-[#023337]">Location</h3>
            <div className="flex gap-[20px] w-[563px] pt-2">
              {/* ---- State first, then city depends on state ---- */}
              <div className="flex flex-col w-[271.5px]">
                <label className="font-bold font-['Lato'] text-[15px] text-[#444545] mb-3">State</label>
                <select
                  value={form.location.state}
                  onChange={(e) => {
                    nestedHandleChange("location", "state", e.target.value);
                    // ---- clear city when state changes ----
                    nestedHandleChange("location", "city", "");
                  }}
                  className="w-[271.5px] h-[48px] border-[1px] rounded-[8px] py-[10px] px-[12px] border-[#E5E7EB] bg-[#F9FAFB] outline-none">
                  <option value="">Select State</option>
                  {allStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              {/* ---- City options depend on selected state ---- */}
              <div className="flex flex-col w-[271.5px]">
                <label className="font-bold font-['Lato'] text-[15px] text-[#444545] mb-3">City</label>
                <select
                  value={form.location.city}
                  onChange={(e) => nestedHandleChange("location", "city", e.target.value)}
                  className="w-[271.5px] h-[48px] border-[1px] rounded-[8px] py-[10px] px-[12px] border-[#E5E7EB] bg-[#F9FAFB] outline-none">
                  <option value="">Select City</option>
                  {getCitiesByState(form.location.state).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="gap-[12px] py-4">
              <label className="font-['Lato'] font-bold text-[16px] text-[#444545]">Full Address</label>
              <input className="w-[563px] h-[48px] border-[1px] rounded-[8px] py-[10px] px-[12px] border-[#E5E7EB] bg-[#F9FAFB] outline-none mt-2" value={form.location.fullAddress} onChange={(e) => nestedHandleChange("location", "fullAddress", e.target.value)} placeholder="e.g Admiralty way, Lekki phase 1" />
            </div>
          </div>

          {/* Property Details */}
          <div className="flex flex-col pt-8">
            <h2 className="font-bold text-[16px] font-['Lato'] text-[#023337]">Property Details</h2>
            <div className="flex gap-[16px] py-3">
              <div className="flex flex-col w-[177px] gap-[12px]">
                <label className="font-bold text-[15px] font-['Lato'] text-[#444545]">Bedroom</label>
                {/* ---- UPDATED: 1-50 options ---- */}
                <select value={form.propertyDetails.bedrooms} onChange={(e) => nestedHandleChange("propertyDetails", "bedrooms", Number(e.target.value))} className="border-[1px] w-[177px] h-[48px] rounded-[8px] px-[10px] border-[#E5E7EB] bg-[#F9FAFB] outline-none">
                  <option value="0">Select</option>
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-[177px] gap-[12px]">
                <label className="font-bold text-[15px] font-['Lato'] text-[#444545]">Bathroom</label>
                {/* ---- UPDATED: 1-50 options ---- */}
                <select value={form.propertyDetails.bathroom} onChange={(e) => nestedHandleChange("propertyDetails", "bathroom", Number(e.target.value))} className="border-[1px] w-[177px] h-[48px] rounded-[8px] px-[10px] border-[#E5E7EB] bg-[#F9FAFB] outline-none">
                  <option value="0">Select</option>
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-[177px] gap-[12px]">
                <label className="font-bold text-[15px] font-['Lato'] text-[#444545]">Size (sqm)</label>
                <input className="border-[1px] w-[177px] h-[48px] rounded-[8px] px-[10px] border-[#E5E7EB] bg-[#F9FAFB] outline-none" value={form.propertyDetails.size} onChange={(e) => nestedHandleChange("propertyDetails", "size", Number(e.target.value))} placeholder="e.g 350" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-[12px] mt-25 mb-3 h-[48px]">
            <div className="flex w-[140px] h-[48px] rounded-[8px] border-[1px] py-[6px] pl-[20px] bg-[#FFFFFF] border-[#75928B] gap-2 items-center">
              <img className="w-[12.8px] h-[12.8px]" src={save} alt="" />
              <button onClick={() => handleSubmit('draft')} disabled={isLoading} className="font-bold text-[15px] text-[#031D17] disabled:opacity-50">Save Draft</button>
            </div>
            <div className="w-[140px] h-[48px] rounded-[8px] border-[1px] py-[6px] pl-[12px] pt-[10px] border-[#75928B] bg-[#1A3C34] items-center">
              <button onClick={() => handleSubmit('publish')} disabled={isLoading} className="text-[15px] font-['Lato'] text-[#FFFFFF] font-bold disabled:opacity-50">
                {editingProperty ? "Update Property" : "Publish Property"}
              </button>
            </div>
          </div>
        </div>

        {/* IMAGES & AMENITIES */}
        <div className="flex flex-col h-[760px] bg-[#FFFFFF] p-8">
          <h2 className="font-bold text-[20px] text-[#1A3C34] mb-4">Upload Property Image</h2>
          <p className="text-[14px] text-[#4F887B] mb-2">Upload up to 10 images</p>
          <p className="text-[14px] text-[#4F887B] mb-6">PNG, JPG up to 10MB each</p>

          <div className="relative w-[437px] h-[266px] border-[1px] border-[#75928B] rounded-[8px] flex flex-col items-center justify-center gap-2 mb-6">
            <input type="file" multiple accept="image/*" className="absolute opacity-0 w-full h-full cursor-pointer" onChange={handleImageUpload} />
            <div className="flex flex-col w-[301px] h-[98px] gap-[15px] items-center justify-center">
              <div className="flex flex-row w-[44px] h-[47px] rounded-[5px] p-[10px] gap-[10px] bg-[#183730]">
                <img className="w-[24px] h-[27px]" src={upload} alt="" />
              </div>
              <p className="w-[301px] h-[36px] font-['Lato'] font-normal text-[15px] text-center text-[#000000]">
                Drag and drop images here or click PNG, JPG up to 10MB each
              </p>
            </div>
            <div className='flex gap-1 items-center justify-center w-52 h-9 rounded-lg m-4 border border-[#787879] pt-3 pr-3 pb-4 pl-3'>
              <img src={browse} alt="browse" />
              <p>Browse</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {imagePreviews.map((url, idx) => (
              <div key={idx} className="relative group">
                <img src={url} className="w-full h-32 object-cover rounded-lg border" alt="preview" />
              </div>
            ))}
          </div>

          {/* Amenities */}
          <div className="flex flex-col w-[438px] gap-[22px] mt-6">
            <h2 className="font-['Lato'] font-bold text-[15px] text-[#023337]">Amenities</h2>
            <div className="grid grid-cols-3 w-[438px] gap-[18px]">
              {amenityList.map((item) => (
                <label key={item} className="flex w-[134px] h-[48px] rounded-[8px] border-[1px] p-[10px] gap-[8px] bg-[#F9FAFB] border-[#E5E7EB]">
                  <div onClick={() => handleAmenity(item)} className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${form.amenities.includes(item) ? "bg-[#1A3C34] border-[#1A3C34]" : "border-[#BAB9B9] bg-white"}`}>
                    {form.amenities.includes(item) && <span className="text-white text-[12px]">✓</span>}
                  </div>
                  <span className={`text-[15px] ${form.amenities.includes(item) ? "text-[#023337] font-bold" : "text-[#023337]"}`}>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modal.show && (
        <Modal type={modal.type} message={modal.message} onClose={handleModalClose} />
      )}
    </div>
  );
};