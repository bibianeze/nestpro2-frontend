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

  // ---- BACKEND ADDED: check activePage context for highlighting ----
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

  // ---- BACKEND ADDED: admin logout clears JWT token ----
  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  // ---- BACKEND ADDED: Dashboard is active when on /adminPage and not on Add/Update/Manage ----
  const isDashboardActive =
    isActive("/adminPage") &&
    !isPageActive("Add Property") &&
    !isPageActive("Update Property") &&
    !isPageActive("All Properties") &&
    !isPageActive("For Sale") &&
    !isPageActive("For Rent") &&
    !isPageActive("Featured") &&
    !isPageActive("Draft");

  // ---- BACKEND ADDED: Add Property is active when activePage is Add or Update Property ----
  const isAddPropertyActive =
    isActive("/adminPage/add-property") ||
    isPageActive("Add Property") ||
    isPageActive("Update Property");

  // ---- BACKEND ADDED: Manage Property is active when on manage page and not editing ----
  const isManageActive =
    (isActive("/adminPage/manage-property") ||
      isPageActive("All Properties") ||
      isPageActive("For Sale") ||
      isPageActive("For Rent") ||
      isPageActive("Featured") ||
      isPageActive("Draft")) &&
    !isPageActive("Add Property") &&
    !isPageActive("Update Property");

  return (
    <div style={{
      width: "260px",
      borderRightWidth: "1px",
      backgroundColor: "#FFFFFF",
      position: "relative",
      borderRightColor: "#BAB9B9",
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
          <img src={Logo} onClick={() => navigate("/")} alt="Arrow Logo" />
          <div style={{
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: "17.89px",
            letterSpacing: "0%",
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
        height: "212px",
        top: "91px",
        gap: "24px"
      }}>
        <div style={{
          display: "flex",
          width: "260px",
          height: "24px",
          paddingLeft: "24px",
          paddingRight: "24px",
          gap: "10px"
        }}>
          <h1 style={{
            fontFamily: "lato",
            fontWeight: 400,
            fontSize: "15px",
            lineHeight: "24px",
            color: "#4F887B"
          }}>MAIN MENU</h1>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          width: "260px",
          height: "164px",
          gap: "20px"
        }}>

          {/* Dashboard */}
          <div onClick={handleClick} style={{
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
            backgroundColor: isDashboardActive ? "#1A3C34" : "#FFFFFF",
          }}>
            <img className="w-6 h-6" src={home} alt="" />
            <h1 style={{
              fontFamily: "lato",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "22px",
              verticalAlign: "middle",
              color: isDashboardActive ? "#FFFFFF" : "#4F887B"
            }}>Dashboard</h1>
          </div>

          {/* Add Property */}
          <div onClick={handleAddPropertyClick} style={{
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
            backgroundColor: isAddPropertyActive ? "#1A3C34" : "#FFFFFF",
          }}>
            <img className="w-6 h-6" src={circle} alt="" />
            <h1 style={{
              fontWeight: 400,
              fontFamily: "lato",
              fontSize: "16px",
              lineHeight: "22px",
              verticalAlign: "middle",
              color: isAddPropertyActive ? "#FFFFFF" : "#4F887B"
            }}>Add Property</h1>
          </div>

          {/* Manage Property */}
          <div onClick={handleManageClick} style={{
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
            backgroundColor: isManageActive ? "#1A3C34" : "#FFFFFF",
          }}>
            <img className="w-6 h-6" src={user} alt="" />
            <h1 style={{
              fontFamily: "lato",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "22px",
              verticalAlign: "middle",
              color: isManageActive ? "#FFFFFF" : "#4F887B"
            }}>Manage Property</h1>
          </div>

        </div>
      </div>

      {/* ---- BACKEND UPDATED: logout now clears JWT token ---- */}
      <div className="flex items-center absolute bottom-8 left-5">
        <img src={users} alt="" />
        <button
          onClick={handleLogout}
          className="text-[#FF0000]">
          logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar