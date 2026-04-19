import React, { createContext, useState, useContext, useEffect } from "react";
import { CircleLoader } from "react-spinners";

// ---- BACKEND: imported api functions ----
import { getAdminProperties, deleteProperty as deletePropertyAPI } from "../../services/api";

// ---- BACKEND REMOVED: useFetch hook no longer needed ----
// import { useFetch } from "../../Hooks/useFetch";

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("useProperties must be used within a PropertyProvider");
  }
  return context;
};

// ---- BACKEND UPDATED: PropertyType now matches backend model ----
// ---- BACKEND REMOVED: id is now _id string from MongoDB ----
export type PropertyType = {
  _id: string;
  propertyName: string;
  price: number;
  propertyDescription: string;
  propertyType: "Villa" | "Duplex" | "Apartment" | "Residential" | "House";
  sale: "For Sale" | "For Rent";
  location: {
    city: string;
    state: string;
    fullAddress: string;
  };
  propertyDetails: {
    bedrooms: number;
    bathroom: number;
    size: number;
  };
  // ---- BACKEND UPDATED: images array instead of image ----
  images: string[];
  amenities: string[];
  isFeatured: boolean;
  isDraft: boolean;
  agentName: string;
  agentPhone: string;
  discount: string;
};

export type PropertyContextType = {
  properties: PropertyType[];
  // ---- BACKEND UPDATED: publishProperty now handled by backend ----
  publishProperty: (newProperty: PropertyType) => void;
  // ---- BACKEND UPDATED: deleteProperty now calls backend ----
  deleteProperty: (id: string) => void;
  editingProperty: PropertyType | null;
  setEditingProperty: (property: PropertyType | null) => void;
  // ---- BACKEND UPDATED: updateProperty now handled by backend ----
  updateProperty: (updatedProperty: PropertyType) => void;
  // ---- BACKEND ADDED: refetch properties from backend ----
  fetchProperties: () => void;
  isLoading: boolean;
};

export const PropertyContext = createContext<PropertyContextType | null>(null);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [editingProperty, setEditingProperty] = useState<PropertyType | null>(null);

  // ---- BACKEND ADDED: loading state ----
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ---- BACKEND ADDED: fetch all properties from backend on mount ----
  const fetchProperties = async () => {
    try {
      setIsLoading(true);

      // ---- BACKEND CALL: get all properties including drafts for admin ----
      // ---- BACKEND REMOVED: useFetch("/data/properties.json") ----
      const data = await getAdminProperties();

      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ---- BACKEND UPDATED: publishProperty adds to local state after backend save ----
  const publishProperty = (newProperty: PropertyType) => {
    setProperties((prev) => [newProperty, ...prev]);
  };

  // ---- BACKEND UPDATED: deleteProperty calls real backend then updates local state ----
  const deleteProperty = async (id: string) => {
    try {
      const result = await deletePropertyAPI(id);
      if (result.success) {
        setProperties((prev) => prev.filter((property) => property._id !== id));
      } else {
        alert("Failed to delete property");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
  };

  // ---- BACKEND UPDATED: updateProperty updates local state after backend save ----
  const updateProperty = (updatedProp: PropertyType) => {
    setProperties((prev) =>
      prev.map((p) => (p._id === updatedProp._id ? updatedProp : p))
    );
    setEditingProperty(null);
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      publishProperty,
      deleteProperty,
      editingProperty,
      setEditingProperty,
      updateProperty,
      fetchProperties,
      isLoading,
    }}>
      {isLoading ? (
        <div className='flex justify-center font-bold h-screen items-center'>
          <CircleLoader size={40} color={'green'} />
        </div>
      ) : (
        children
      )}
    </PropertyContext.Provider>
  );
};