// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import logo from "../assets/logo/logo.png";
// import { RxDashboard } from "react-icons/rx";
// import { FaCalendarAlt ,FaRegArrowAltCircleLeft,FaUserPlus,FaRegUser } from "react-icons/fa";
// import { IoSettingsOutline } from "react-icons/io5";
// import { FaPeopleGroup } from "react-icons/fa6";
// import { useEffect, useRef, useState } from "react";
// import { IoMdClose,IoMdGlobe } from "react-icons/io";
// import logo2 from '../assets/logo/logo2.png'
// import authService from "../services/authServices";

// const Sidebar = ({ sidebarOpen, setSidebarOpen, isCollapsed, setIsCollapsed }: any) => {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();
//   const [userRole, setUserRole] = useState(null);
//   const trigger = useRef(null);
//   const sidebar = useRef(null);

//   useEffect(() => {
//     const role = authService.getUserRole();
//     if (!role) {
//       navigate('/login');
//     } else {
//       setUserRole(role);
//     }
//   }, [navigate]);

//   const adminMenuItems = [
//     { to: "/", icon: RxDashboard, text: "Dashboard" },
//     { to: "/bdcandidates", icon: FaPeopleGroup, text: "BD Candidates" },
//     { to: "/addbdcandidates", icon: FaUserPlus, text: "Add BD Candidates" },
//     // { to: "/addUser", icon: FaUserPlus, text: "Add User" },
//     { to: "/profile", icon: FaRegUser, text: "Admin Profile" },
//     { to: "/settings", icon: IoSettingsOutline, text: "Settings" },
//     // { to: "/geofence", icon: IoMdGlobe, text: "Geo Fence" },
//   ];

//   const userMenuItems = [
//     { to: "/", icon: RxDashboard, text: "Dashboard" },
//     { to: "/calendar", icon: FaCalendarAlt, text: "Calendar" },
//     { to: "/profile", icon: FaRegUser, text: "Profile" },
//   ];

//   const menuItems = userRole === 'Admin' ? adminMenuItems : userMenuItems;

//   return (
//     <aside
//       ref={sidebar}
//       className={`flex flex-col justify-between fixed top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
//         sidebarOpen ? "translate-x-0" : "-translate-x-64"
//       } ${isCollapsed ? "w-20" : "w-64"} `}  // Adjust width based on isCollapsed
//     >
//       {/* Top Section with Logo */}
//       <div className={` ${isCollapsed ?"p-0":"p-6"} `}>
//         <div className={`flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'justify-center ' : 'justify-between'}`}>
//           {/* Hide the logo when collapsed */}
//           {isCollapsed ?
//           <div className=" flex justify-center items-center h-12">
//              <img src={logo2} alt="logo" width={40} className="transition-opacity duration-300 object-contain mt-5" />
//           </div>
//           :<img src={logo} alt="logo" className="transition-opacity duration-300" />}
//           {/* Close Button for Small Devices */}
//           <button
//             ref={trigger}
//             onClick={() => setSidebarOpen(false)}
//             className="lg:hidden rounded-full p-1 transition duration-300 hover:bg-gray-700"
//           >
//             <IoMdClose className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Navigation Menu */}
//         <nav className={`${isCollapsed ? "mt-8 py-8" : "mt-5 py-4"}`}>
//         <ul className="flex flex-col gap-1.5">
//           {menuItems.map((item) => (
//             <li key={item.to}>
//               <NavLink
//                 to={item.to}
//                 className={`group flex items-center justify-start ${
//                   isCollapsed ? 'justify-center' : 'gap-2.5'
//                 } rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
//                   pathname === item.to && "bg-gray-700 dark:bg-meta-4"
//                 }`}
//               >
//                 <item.icon className="h-6 w-6" />
//                 <span className={`${isCollapsed ? "hidden" : "inline"} transition-all duration-300`}>
//                   {item.text}
//                 </span>
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav>
//       </div>

//       {/* Arrow Icon at the bottom */}
//       <div className="p-6">
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="flex items-center justify-center w-full"
//         >
//           <FaRegArrowAltCircleLeft className={`h-8 w-8 text-gray-300 hover:text-white transition-colors transform duration-300 ease-in-out  ${isCollapsed?"rotate-180 ":""}`} />
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

// src/layout/Sidebar.tsx
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.png";
import { RxDashboard } from "react-icons/rx";
import {FaRegArrowAltCircleLeft, FaUserPlus } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import logo2 from '../assets/logo/logo2.png';
import authService from "../services/authServices";
import { RiDashboardLine } from "react-icons/ri";

const Sidebar = ({ sidebarOpen, setSidebarOpen, isCollapsed, setIsCollapsed }: any) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const trigger = useRef(null);
  const sidebar = useRef(null);

  useEffect(() => {
    const role = authService.getUserRole();
    if (!role) {
      navigate('/login');
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  const superadminMenuItems = [
    { to: "/", icon: RxDashboard, text: "Dashboard" },
    { to: "/bdcandidates", icon: FaPeopleGroup, text: "BD Candidates" },
    { to: "/backdoor-candidates/add", icon: FaUserPlus, text: "Add BD Candidates" },
    { to: "/adduser", icon: FaUserPlus, text: "Add User", visible: userRole === "superAdmin" }, 
    { to: "/bd", icon: FaUserPlus, text: "Add BD Candidates" },
    // { to: "/profile", icon: FaRegUser, text: "Admin Profile" },
    // { to: "/settings", icon: IoSettingsOutline, text: "Settings" },
  ];

  const adminMenuItems = [
    { to: "/", icon: RiDashboardLine, text: "Dashboard" },
    { to: "/bdcandidates", icon: FaPeopleGroup, text: " Candidates List" },
    { to: "/backdoor-candidates/add", icon: IoPersonAddOutline , text: "Add Candidates" },
    // { to: "/profile", icon: FaRegUser, text: "Admin Profile" },
    // { to: "/settings", icon: IoSettingsOutline, text: "Settings" },
   
  ];

  const menuItems = userRole === 'superAdmin' ? superadminMenuItems : adminMenuItems;

  return (
    <aside
      ref={sidebar}
      className={`flex flex-col justify-between fixed top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-64"
      } ${isCollapsed ? "w-20" : "w-64"} `}
    >
      <div className={` ${isCollapsed ? "p-0" : "p-6"} `}>
        <div className={`flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'justify-center ' : 'justify-between'}`}>
          {isCollapsed ? (
            <div className="flex justify-center items-center h-12">
              <img src={logo2} alt="logo" width={40} className="transition-opacity duration-300 object-contain mt-5" />
            </div>
          ) : (
            <img src={logo} alt="logo" className="transition-opacity duration-300" />
          )}
          <button
            ref={trigger}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden rounded-full p-1 transition duration-300 hover:bg-gray-700"
          >
            <IoMdClose className="h-5 w-5" />
          </button>
        </div>

        <nav className={`${isCollapsed ? "mt-8 py-8" : "mt-5 py-4"}`}>
          <ul className="flex flex-col gap-1.5">
            {menuItems.map((item:any) => (
              // Only render menu item if it is visible
              item.visible !== false && (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={`group flex items-center justify-start ${
                      isCollapsed ? 'justify-center' : 'gap-2.5'
                    } rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname === item.to && "bg-gray-700 dark:bg-meta-4"
                    }`}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className={`${isCollapsed ? "hidden" : "inline"} transition-all duration-300`}>
                      {item.text}
                    </span>
                  </NavLink>
                </li>
              )
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-6">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full"
        >
          <FaRegArrowAltCircleLeft className={`h-8 w-8 text-gray-300 hover:text-white transition-colors transform duration-300 ease-in-out ${isCollapsed ? "rotate-180 " : ""}`} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
