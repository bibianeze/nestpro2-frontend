import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../Components/AdminPage/SideBar';
import Dashboard from '../Components/AdminPage/DashBoard';
import ManageContent from '../Components/AdminPage/ManageContent[1]';
import { AddPropertyContent } from '../Components/AdminPage/AddPropertyContent[1]';
// ---- BACKEND ADDED: imported Enquiries page ----
import Enquiries from '../Components/AdminPage/Enquiries';
import { useContext, useEffect } from 'react';
import { ManageContext } from '../Components/AdminPage/ManageProperty';

const AdminPage = () => {
  const manageContext = useContext(ManageContext);
  const activePage = manageContext?.activepage;
  const setActivePage = manageContext?.setActivePage;
  const location = useLocation();

  // ---- BACKEND ADDED: sync activePage with URL on page refresh ----
  useEffect(() => {
    if (location.pathname === "/adminPage/manage-property") {
      if (activePage !== "Add Property" && activePage !== "Update Property") {
        setActivePage?.("All Properties");
      }
    } else if (location.pathname === "/adminPage/add-property") {
      setActivePage?.("Add Property");
    // ---- BACKEND ADDED: sync enquiries page on refresh ----
    } else if (location.pathname === "/adminPage/enquiries") {
      setActivePage?.("Enquiries");
    } else if (location.pathname === "/adminPage" || location.pathname === "/adminPage/dashboard") {
      if (activePage !== "Add Property" && activePage !== "Update Property") {
        setActivePage?.("Dashboard");
      }
    }
  }, [location.pathname]);

  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar />
      <main className='flex-1 h-full overflow-y-auto bg-[#F3F4F6]'>
        <Routes>
          <Route index element={
            activePage === "Add Property" || activePage === "Update Property"
              ? <AddPropertyContent />
              : <Dashboard />
          } />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-property" element={<AddPropertyContent />} />
          <Route path="manage-property" element={
            activePage === "Add Property" || activePage === "Update Property"
              ? <AddPropertyContent />
              : <ManageContent />
          } />
          {/* ---- BACKEND ADDED: enquiries route ---- */}
          <Route path="enquiries" element={<Enquiries />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminPage;