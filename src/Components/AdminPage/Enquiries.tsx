import React, { useEffect, useState } from "react";
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from "../../services/api";
import Modal from "../Universal/Modal";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  propertyName: string;
  status: "new" | "responded";
  createdAt: string;
}

const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      const data = await getEnquiries();
      if (data.success) {
        setEnquiries(data.enquiries);
      }
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const result = await updateEnquiryStatus(id, status);
      if (result.success) {
        setEnquiries(prev =>
          prev.map(e => e._id === id ? { ...e, status: status as "new" | "responded" } : e)
        );
        setModal({ show: true, type: "success", message: "Status updated!" });
      }
    } catch (error) {
      setModal({ show: true, type: "error", message: "Failed to update status" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteEnquiry(id);
      if (result.success) {
        setEnquiries(prev => prev.filter(e => e._id !== id));
        setModal({ show: true, type: "success", message: "Enquiry deleted!" });
      }
    } catch (error) {
      setModal({ show: true, type: "error", message: "Failed to delete enquiry" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-[#023337] text-[18px]">Loading enquiries...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#F3F4F6] pb-10 min-h-screen">
      {/* NavBar */}
      <nav className="bg-white px-10 h-[76px] flex items-center border-b border-[#BAB9B9]">
        <h1 className="font-['Lato'] font-bold text-[22px] text-[#023337]">Enquiries</h1>
      </nav>

      <div className="px-10 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-bold text-[22px] text-[#023337] font-['Lato']">Manage Enquiries</h2>
            <p className="text-[14px] text-[#000000] font-['Lato']">
              {enquiries.length} total enquiries
            </p>
          </div>
          {/* ---- stats ---- */}
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-lg border border-[#E5E7EB]">
              <p className="text-[12px] text-[#75928B]">New</p>
              <p className="font-bold text-[#023337] text-[18px]">
                {enquiries.filter(e => e.status === "new").length}
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-[#E5E7EB]">
              <p className="text-[12px] text-[#75928B]">Responded</p>
              <p className="font-bold text-[#023337] text-[18px]">
                {enquiries.filter(e => e.status === "responded").length}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[8px] px-4 overflow-hidden">
          {enquiries.length === 0 ? (
            <div className="py-20 text-center text-[#75928B]">
              <p>No enquiries yet.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#B1FFED] h-[56px]">
                  <th className="text-[15px] font-medium text-[#023337] px-4 text-left">Name</th>
                  <th className="text-[15px] font-medium text-[#023337] px-4 text-left">Email</th>
                  <th className="text-[15px] font-medium text-[#023337] px-4 text-left">Property</th>
                  <th className="text-[15px] font-medium text-[#023337] px-4 text-left">Message</th>
                  <th className="text-[15px] font-medium text-[#023337] px-4 text-left">Date</th>
                  <th className="text-[15px] font-medium text-[#023337] px-4 text-left">Status</th>
                  <th className="text-[15px] font-medium text-[#023337] px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="h-[70px]">
                    <td className="px-4 py-4 font-bold text-[#0A1916] text-[14px]">
                      {enquiry.name}
                    </td>
                    <td className="px-4 py-4 text-[#403F3F] text-[14px]">
                      <a href={`mailto:${enquiry.email}`} className="text-[#1A3C34] hover:underline">
                        {enquiry.email}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-[#403F3F] text-[14px]">
                      {enquiry.propertyName}
                    </td>
                    <td className="px-4 py-4 text-[#403F3F] text-[14px] max-w-[200px]">
                      <p className="truncate">{enquiry.message}</p>
                    </td>
                    <td className="px-4 py-4 text-[#403F3F] text-[14px]">
                      {formatDate(enquiry.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                        enquiry.status === "new"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-green-100 text-green-600"
                      }`}>
                        {enquiry.status === "new" ? "New" : "Responded"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {enquiry.status === "new" ? (
                          <button
                            onClick={() => handleStatusUpdate(enquiry._id, "responded")}
                            className="text-[#1A3C34] font-normal text-[14px] hover:underline">
                            Mark Responded
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusUpdate(enquiry._id, "new")}
                            className="text-orange-500 font-normal text-[14px] hover:underline">
                            Mark New
                          </button>
                        )}
                        <span className="text-[#21C45D]">/</span>
                        <button
                          onClick={() => handleDelete(enquiry._id)}
                          className="text-[#FF0000] font-normal text-[14px] hover:underline">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal.show && (
        <Modal
          type={modal.type}
          message={modal.message}
          onClose={() => setModal({ ...modal, show: false })}
        />
      )}
    </div>
  );
};

export default Enquiries;