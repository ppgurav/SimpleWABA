// import { Link } from "react-router-dom";
// import { Settings, Moon, Sun, Plus, User2Icon } from "lucide-react";
// import { useState } from "react";

// function Navbar() {
//   const [isOpen, setIsOpen] = useState(true)
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
//   const [isDarkModeMenuOpen, setIsDarkModeMenuOpen] = useState(false);
//   const [isUserOpen ,setUserOpen]= useState(false);
//   const toggleDarkMode = (mode) => {
//     if (mode === "light") {
//       setIsDarkMode(false);
      
//     } else if (mode === "dark") {
//       setIsDarkMode(true);
      
//     } else {
     
//       const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
//       setIsDarkMode(prefersDarkMode);
//     }
//     setIsDarkModeMenuOpen(false); 
//   };


//   const handleLogout = () => {
//     sessionStorage.clear();
//     document.cookie = "auth_token=; Max-Age=0; path=/;";
//     window.location.href = "/login";
//   };
  

//   const handlePlusMenuClick = () => {
//     setIsPlusMenuOpen(false); 
//   };
//   const handleUserClick = () => {
//     setUserOpen(false); 
//   };
  

//   return (
//     <nav className=" w-full h-16 bg-gray-50 shadow-xl flex items-center px-6 fixed top-0 left-0">
//       <div className="ml-auto flex items-center space-x-4 ">

//         {/* <Link to="setup" className="text-gray-600 hover:text-gray-900">
//           <Settings size={20} />
//         </Link> */}
//         <Link
//               to="/setup"
//               className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 p-1 hover:bg-indigo-50"
//             >
//               <Settings size={20} />
//               <span className={`${!isOpen && "md:hidden"}`}></span>
//             </Link>


//         <div className="relative ">
//           <button
//             onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
//             className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white p-2 shadow-lg hover:shadow-indigo-400 transition-transform hover:scale-110"
//           >
//             <Plus size={20} />
//           </button>

//           {isPlusMenuOpen && (
//             <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-visible z-50 transition-all animate-fadeIn ">
//               {[
//                 { to: "/dashboard", label: "Dashboard" },
//                 { to: "/connect", label: "Connect WABA" },
//                 { to: "/contact", label: "Contact" },
//                 { to: "/temp", label: "Templates" },
//                 { to: "/campaign", label: "Marketing" },
//                 { to: "/campaign", label: "Campaign" },
//                 { to: "/messBot", label: "Message Bot" },
//                 { to: "/tempBot", label: "Support" },
//                 { to: "/chat", label: "Chat" },
//                 { to: "/setup", label: "Setup" },
//               ].map((item, index) => (
//                 <Link
//                   key={index}
//                   to={item.to}
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
//                   onClick={handlePlusMenuClick}
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>


//         <button
//            onClick={() => setIsDarkModeMenuOpen(!isDarkModeMenuOpen) }
//           className="text-gray-600 hover:text-gray-900 relative flex items-center cursor-not-allowed"
//         >
//           {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//         </button>

//         {/* {isDarkModeMenuOpen && (
//           <div className="absolute right-0 mt-36 w-48 bg-white shadow-md rounded-md border border-gray-300 ">
//             <button
//               onClick={() => toggleDarkMode("light")}
//               className="w-full text-gray-600 hover:bg-gray-100 px-4 py-2 text-sm flex items-center space-x-2 "
//             >
//               <Sun size={15} />
//               <span>Light</span>
//             </button>

//             <button
//               onClick={() => toggleDarkMode("dark")}
//               className="w-full text-gray-600 hover:bg-gray-100 px-4 py-2 text-sm flex items-center space-x-2"
//             >
//               <Moon size={15} />
//               <span>Dark</span>
//             </button>

//             <button
//               onClick={() => toggleDarkMode("system")}
//               className="w-full text-gray-600 hover:bg-gray-100 px-4 py-2 text-sm flex items-center space-x-2"
//             >
//               <Sun size={15} />
//               <span>System</span>
//             </button>
//           </div>
//         )} */}


//         <button
//           onClick={() => setUserOpen(!isUserOpen)}
//           className=" bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white p-2 shadow-lg hover:shadow-indigo-400 hover:underline  relative flex items-center"
//         >
//           <User2Icon size={20} />
//         </button>

//         {isUserOpen && (
//           <div className="absolute right-0 mt-28 w-42 bg-white shadow-md rounded-md border border-gray-300">
//             <Link
//               to="/"
//               className="block w-full text-gray-600 hover:bg-gray-100 px-4 py-2 text-sm"
//               onClick={handleUserClick}
//             >
//               User profile
//             </Link>
//             <Link
//               onClick={handleLogout}
//               className="block w-full text-red-400 hover:bg-gray-100 px-4 py-2 text-sm"
//               // onClick={handleUserClick}
//             >
//                Logout
//             </Link>
  
//           </div>
//         )}


//       </div>
//     </nav>
//   );
// }

// export default Navbar;









import { useState, useEffect } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import {
  MessageCircle,
  LayoutDashboard,
  User,
  File,
  Tag,
  MessageSquareText,
  Megaphone,
  Settings,
  Link2,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  Circle,
  Moon,
  Sun,
  Plus,
  User2Icon,
  LogOut,
  UserCircle,
} from "lucide-react"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

function Navbar({ children }) {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [contactExpanded, setContactExpanded] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false)
  const [isDarkModeMenuOpen, setIsDarkModeMenuOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [userData, setUserData] = useState({ name: "User", user_type: "Admin" })
  const [isLoadingUser, setIsLoadingUser] = useState(true)


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token")

        if (!accessToken) {
          console.error("No access token found")
          setIsLoadingUser(false)
          return
        }

        const response = await fetch(`${BASE_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setUserData({
              name: data.name || "User",
              user_type: data.user_type || "Admin",
            })
          }
        } else {
          console.error("Failed to fetch user profile:", response.status)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setIsLoadingUser(false)
      }
    }

    fetchUserProfile()
  }, [])

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setIsOpen(!mobile)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsPlusMenuOpen(false)
        setIsUserOpen(false)
        setIsDarkModeMenuOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const toggleSidebar = () => {
    setIsTransitioning(true)
    setIsOpen(!isOpen)

    if (isOpen) {
      setContactExpanded(false)
    }

    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  const toggleContactDropdown = () => {
    // Only allow dropdown in expanded state
    if (isOpen) {
      setContactExpanded(!contactExpanded)
    }
  }

  const toggleDarkMode = (mode) => {
    if (mode === "light") {
      setIsDarkMode(false)
    } else if (mode === "dark") {
      setIsDarkMode(true)
    } else {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(prefersDarkMode)
    }
    setIsDarkModeMenuOpen(false)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.clear()
    document.cookie = "auth_token=; Max-Age=0; path=/;"
    window.location.href = "/login"
  }

  const closePlusMenu = () => setIsPlusMenuOpen(false)
  const closeUserMenu = () => setIsUserOpen(false)

  const handleLinkClick = (path) => {
    setActiveLink(path)
  }

  const navigationItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/connect", label: "Connect WABA", icon: Link2 },
  ]

  const contactItems = [
    { to: "/contact", label: "Contact" },
    { to: "/contact/segment", label: "Segment" },
    { to: "/contact/group", label: "Group" },
  ]

  const templateItems = [{ to: "/temp", label: "Templates", icon: File }]

  const marketingItems = [
    { to: "/campaign", label: "Campaign", icon: Megaphone },
    { to: "/messBot", label: "Message Bot", icon: MessageSquareText },
    { to: "/tempBot", label: "Template Bot", icon: Tag },
  ]

  const supportItems = [
    { to: "/chat", label: "Chat", icon: MessageCircle },
    { to: "/setup", label: "Setup", icon: Settings },
  ]

  const quickAccessItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/connect", label: "Connect WABA" },
    { to: "/contact", label: "Contact" },
    { to: "/temp", label: "Templates" },
    { to: "/campaign", label: "Campaign" },
    { to: "/messBot", label: "Message Bot" },
    { to: "/tempBot", label: "Template Bot" },
    { to: "/chat", label: "Chat" },
    { to: "/setup", label: "Setup" },
  ]

  const NavLink = ({ to, icon: Icon, children, className = "" }) => {
    const isActive = activeLink === to

    return (
      <Link
        to={to}
        onClick={() => handleLinkClick(to)}
        className={`
          flex items-center rounded-lg transition-all duration-200 group relative
          ${isOpen ? "gap-3 px-3 py-2" : "justify-center p-3 mx-1"}
          ${
            isActive
              ? "text-indigo-600 bg-indigo-100 font-semibold shadow-sm" + (isOpen ? " border-l-4 border-blue-600" : "")
              : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          } ${className}
        `}
        title={!isOpen ? children : ""}
      >
        <Icon size={20} className="flex-shrink-0" />
        <span className={`${!isOpen ? "hidden" : "block"} font-medium`}>{children}</span>
        {/* Tooltip for collapsed state */}
        {!isOpen && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
            {children}
          </div>
        )}
      </Link>
    )
  }

  const SectionHeader = ({ children }) => (
    <h2
      className={`px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isOpen ? "hidden" : "block"}`}
    >
      {children}
    </h2>
  )

  const isContactSectionActive = contactItems.some((item) => activeLink === item.to)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <Menu size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`
          fixed md:static inset-y-0 left-0 z-20
          bg-white border-r border-gray-200 shadow-xl
          transform-gpu flex flex-col h-screen
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-16"}
        `}
      >
        <div className={`flex items-center border-gray-200 ${isOpen ? "justify-between p-4" : "justify-center p-2"}`}>
          <div className={`${!isOpen ? "hidden" : "block"}`}>
            <img src="/waba logo 18-04-2025 (1).svg" className="block h-32 w-screen object-contain" alt="Logo" />
          </div>
          {/* <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${!isOpen ? "mt-2" : ""}`}
            aria-label="Toggle sidebar"
          >
            <Menu size={18} className="text-gray-600 " />
          </button> */}
  <button
  onClick={toggleSidebar}
  className={`hidden md:block p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${!isOpen ? "mt-2" : ""}`}
  aria-label="Toggle sidebar"
>
  <Menu size={18} className="text-gray-600" />
</button>

        </div>

        <nav className={`flex-1 overflow-y-auto space-y-6 ${isOpen ? "p-4" : "p-2"}`}>
          <div className={`space-y-2 ${!isOpen ? "space-y-1" : ""}`}>
            {navigationItems.map((item) => (
              <NavLink key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className={`space-y-2 ${!isOpen ? "space-y-1" : ""}`}>
            <SectionHeader>Contact</SectionHeader>
            <div>
              {isOpen ? (
                <button
                  onClick={toggleContactDropdown}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                    isContactSectionActive
                      ? "text-indigo-600 bg-indigo-100 border-l-4 border-blue-600 font-semibold shadow-sm"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <User size={20} className="flex-shrink-0" />
                  <span className="flex-grow text-left font-medium">Contact</span>
                  <div className="transition-transform duration-200">
                    {contactExpanded ? (
                      <ChevronDown size={16} className="text-gray-500" />
                    ) : (
                      <ChevronLeft size={16} className="text-gray-500" />
                    )}
                  </div>
                </button>
              ) : (
                <Link
                  to="/contact"
                  onClick={() => handleLinkClick("/contact")}
                  className={`
                    flex items-center justify-center p-3 mx-1 rounded-lg transition-all duration-200 group relative
                    ${
                      isContactSectionActive
                        ? "text-blue-600 bg-blue-100 font-semibold shadow-sm"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }
                  `}
                  title="Contact"
                >
                  <User size={20} className="flex-shrink-0" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    Contact
                  </div>
                </Link>
              )}

              {isOpen && (
                <div
                  className={`ml-6 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                    contactExpanded ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                  }`}
                >
                  {contactItems.map((item) => {
                    const isActive = activeLink === item.to
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => handleLinkClick(item.to)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "text-blue-600 bg-blue-50 border-l-2 border-blue-400 font-medium"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <Circle size={8} className="flex-shrink-0" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className={`space-y-2 ${!isOpen ? "space-y-1" : ""}`}>
            <SectionHeader>Templates</SectionHeader>
            {templateItems.map((item) => (
              <NavLink key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className={`space-y-2 ${!isOpen ? "space-y-1" : ""}`}>
            <SectionHeader>Marketing</SectionHeader>
            {marketingItems.map((item) => (
              <NavLink key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className={`space-y-2 ${!isOpen ? "space-y-1" : ""}`}>
            <SectionHeader>Support</SectionHeader>
            {supportItems.map((item) => (
              <NavLink key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-col min-h-screen">
        <nav
          className={`
            fixed top-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm 
            flex items-center px-6 z-10 transition-all duration-300 ease-in-out
            ${isMobile ? "left-0 w-full" : isOpen ? "left-64 w-[calc(100%-16rem)]" : "left-16 w-[calc(100%-4rem)]"}
          `}
        >
          <div className="ml-auto flex items-center space-x-4">
            <Link
              to="/setup"
              onClick={() => handleLinkClick("/setup")}
              className={`p-2 rounded-lg transition-colors ${
                activeLink === "/setup"
                  ? "text-blue-600 bg-blue-100"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
              title="Settings"
            >
              <Settings size={20} />
            </Link>

            <div className="relative dropdown-container">
              <button
                onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                title="Quick Access"
              >
                <Plus size={20} />
              </button>

              {isPlusMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    {quickAccessItems.map((item, index) => {
                      const isActive = activeLink === item.to
                      return (
                        <Link
                          key={index}
                          to={item.to}
                          className={`block px-4 py-3 text-sm transition-colors ${
                            isActive
                              ? "text-blue-600 bg-blue-50 font-medium border-l-2 border-blue-400"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                          onClick={() => {
                            handleLinkClick(item.to)
                            closePlusMenu()
                          }}
                        >
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>


            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDarkModeMenuOpen(!isDarkModeMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title="Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isDarkModeMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    <button
                      onClick={() => toggleDarkMode("light")}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Sun size={16} />
                      Light
                    </button>
                    <button
                      onClick={() => toggleDarkMode("dark")}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Moon size={16} />
                      Dark
                    </button>
                    <button
                      onClick={() => toggleDarkMode("system")}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={16} />
                      System
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative dropdown-container flex items-center gap-3">
      {/* Button */}
      <button
        onClick={() => setIsUserOpen(!isUserOpen)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ring-2 ring-transparent hover:ring-blue-300 hover:ring-opacity-50"
        title="User Menu"
      >
        <User2Icon size={20} />
      </button>

      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsUserOpen(!isUserOpen)}>
        <div className="flex flex-col leading-tight">
          <span className="text-gray-800 text-sm font-medium">{isLoadingUser ? "Loading..." : userData.name}</span>
          <p className="text-gray-500 text-xs">{isLoadingUser ? "..." : userData.user_type}</p>
        </div>

        {/* Up/Down Arrow */}
        <div className={`transition-transform duration-200 ease-in-out ${isUserOpen ? "rotate-180" : "rotate-0"}`}>
          <ChevronDown size={16} className="text-gray-500 hover:text-gray-700" />
        </div>
      </div>

      {isUserOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Menu items */}
          <div className="py-2">
            <Link
              to="/profile"
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                activeLink === "/profile"
                  ? "text-blue-600 bg-blue-50 font-medium border-l-3 border-blue-500"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
              onClick={() => {
                handleLinkClick("/profile")
                closeUserMenu()
              }}
            >
              <UserCircle size={18} className="text-gray-500" />
              <span>User Profile</span>
            </Link>

            {/* Separator line */}
            <div className="mx-4 my-2 border-t border-gray-200"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
            >
              <LogOut size={18} className="text-red-500 group-hover:text-red-600" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
          </div>
        </nav>

        {/* <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">{children}</div>
        </div> */}
        {/* Page content with proper margin */}
        <div
          className={`
           flex-1 pt-16 transition-all duration-300 ease-in-out overflow-hidden
            ${isMobile ? "ml-0" : isOpen ? "ml-64" : "ml-16"}
          `}
        >
          {children}
        </div>


      </div>
    </div>
    
  )
}

export default Navbar






