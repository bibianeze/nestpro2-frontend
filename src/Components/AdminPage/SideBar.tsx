import Logo from "/src/assets/logo.png"
import user from "/src/assets/addd.png"
import home from "/src/assets/dashboard.png"
import users from "/src/assets/users.png"
import circle from "/src/assets/addd.png"
import { ManageContext } from "./ManageProperty"
import { useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"

// ---- BACKEND ADDED: imported removeToken to clear JWT on logout ----
import { removeToken } from "../../services/api"

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const manageContext = useContext(ManageContext)
  if (!manageContext) return ("No content")

  const { activepage, setActivePage } = manageContext

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isPageActive = (page: string) => {
    return activepage === page;
  };

  const handleClick = () => {
    setActivePage("Dashboard");
    navigate("/adminPage");
  };

  const handleManageClick = () => {
    setActivePage("All Properties");
    navigate("/adminPage/manage-property");
  };

  const handleAddPropertyClick = () => {
    setActivePage("Add Property");
    navigate("/adminPage/add-property");
  };

  // ---- BACKEND ADDED: navigate to enquiries page ----
  const handleEnquiriesClick = () => {
    setActivePage("Enquiries");
    navigate("/adminPage/enquiries");
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const isDashboardActive =
    isActive("/adminPage") &&
    !isPageActive("Add Property") &&
    !isPageActive("Update Property") &&
    !isPageActive("All Properties") &&
    !isPageActive("For Sale") &&
    !isPageActive("For Rent") &&
    !isPageActive("Featured") &&
    !isPageActive("Draft") &&
    !isPageActive("Enquiries");

  const isAddPropertyActive =
    isActive("/adminPage/add-property") ||
    isPageActive("Add Property") ||
    isPageActive("Update Property");

  const isManageActive =
    (isActive("/adminPage/manage-property") ||
      isPageActive("All Properties") ||
      isPageActive("For Sale") ||
      isPageActive("For Rent") ||
      isPageActive("Featured") ||
      isPageActive("Draft")) &&
    !isPageActive("Add Property") &&
    !isPageActive("Update Property");

  // ---- BACKEND ADDED: Enquiries is active when on enquiries page ----
  const isEnquiriesActive =
    isPageActive("Enquiries") ||
    isActive("/adminPage/enquiries");

  const sidebarItem = (onClick: () => void, isActive: boolean, icon: string, label: string) => (
    <div onClick={onClick} style={{
      display: "flex",
      width: "260px",
      height: "42px",
      paddingTop: "9px",
      paddingRight: "16px",
      paddingBottom: "9px",
      paddingLeft: "16px",
      gap: "8px",
      borderRadius: "6px",
      cursor: "pointer",
      backgroundColor: isActive ? "#1A3C34" : "#FFFFFF",
    }}>
      <img className="w-6 h-6" src={icon} alt="" />
      <h1 style={{
        fontFamily: "lato",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "22px",
        verticalAlign: "middle",
        color: isActive ? "#FFFFFF" : "#4F887B"
      }}>{label}</h1>
    </div>
  );

  return (
    <div style={{
      width: "260px",
      borderRightWidth: "1px",
      backgroundColor: "#FFFFFF",
      position: "relative",
      borderRightColor: "#BAB9B9",
      minHeight: "100vh",
    }}>
      {/* Logo */}
      <div style={{
        display: "flex",
        gap: "4px",
        padding: "20px",
        width: "260px",
        height: "76px",
        alignItems: "center"
      }}>
        <div style={{
          width: "162.22px",
          height: "46px",
          gap: "10.22px",
          display: "flex",
          alignItems: "center"
        }}>
          <img src={Logo} onClick={() => navigate("/")} alt="Arrow Logo" className="cursor-pointer" />
          <div style={{
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: "17.89px",
            lineHeight: "100%",
          }}>
            <h1 className="text-[#1A3C34]">NestFinder Pro</h1>
          </div>
        </div>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        width: "260px",
        gap: "24px",
        paddingTop: "16px",
      }}>
        <div style={{
          display: "flex",
          width: "260px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}>
          <h1 style={{
            fontFamily: "lato",
            fontWeight: 400,
            fontSize: "15px",
            lineHeight: "24px",
            color: "#4F887B"
          }}>MAIN MENU</h1>
        </div>

        {/* ---- Sidebar items ---- */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          width: "260px",
          gap: "20px"
        }}>
          {sidebarItem(handleClick, isDashboardActive, home, "Dashboard")}
          {sidebarItem(handleAddPropertyClick, isAddPropertyActive, circle, "Add Property")}
          {sidebarItem(handleManageClick, isManageActive, user, "Manage Property")}
          {/* ---- BACKEND ADDED: Enquiries sidebar item ---- */}
          {sidebarItem(handleEnquiriesClick, isEnquiriesActive, user, "Enquiries")}
        </div>
      </div>

      {/* Logout */}
      <div className="flex items-center absolute bottom-8 left-5">
        <img src={users} alt="" />
        <button onClick={handleLogout} className="text-[#FF0000]">
          logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar