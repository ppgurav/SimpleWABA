
// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import {MessageCircle, LayoutDashboard, User,  File, Tag,  MessageSquareText,  Megaphone,  Settings,  Link2,  Menu, X,  Minus,} from "lucide-react"


// function Sidebar() {
//   const [isOpen, setIsOpen] = useState(true)
//   const [isMobile, setIsMobile] = useState(false)

//   // Check if screen is mobile
//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768)
//       if (window.innerWidth < 768) {
//         setIsOpen(false)
//       } else {
//         setIsOpen(true)
//       }
//     }


//     checkScreenSize()


//     window.addEventListener("resize", checkScreenSize)


//     return () => window.removeEventListener("resize", checkScreenSize)
//   }, [])

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen)
//   }

//   return (
//     <>

//       <button className="md:hidden fixed top-4 left-4 z-20 bg-white p-2 rounded-md shadow-md aspect-auto" onClick={toggleSidebar}>
//         {isOpen ? <X size={20} /> : <Menu size={20} />}
//       </button>
//       <div
//     className={`
//     fixed md:static inset-y-0 left-1 z-10
//     transition-all duration-300 ease-in-out
//     bg-white border-r p-0 space-y-4 h-full
//     ${isOpen ? "translate-x-0 w-42" : "translate-x-[-100%] md:translate-x-0 md:w-16"}
//   `}>
        
//          {/* <CircleArrowOutUpRight className="text-indigo-600 "/> <h1 className={`text-2xl font-bold text-indigo-600 mr-12 ${!isOpen && "md:hidden"}`}>WhatsMark</h1>  */}
//          <div className="flex flex-col justify-between h-full">
//         <nav className="overflow-y-auto h-full pr-5 space-y-1">
//         <img
//           src="/waba logo 18-04-2025 (1).svg"
//          className="block w-full h-28  object-contain"
//          />
//           <Link to="/dashboard" className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 py-1 hover:bg-indigo-50">

//             <LayoutDashboard size={20} />
//             <span className={`${!isOpen && "md:hidden"}`}>Dashboard</span>
//           </Link>

//           <Link to="/connect" className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 py-1 hover:bg-indigo-50">
//             <Link2 size={20} />
//             <span className={`${!isOpen && "md:hidden"}`}>Connect WABA</span>
//           </Link>

//           <h1 className={`py-3 text-sm ml-1 text-gray-500 ${!isOpen && "md:hidden"}`}>Contact</h1>

// {/* Main Contact Link */}
// <Link to="/contact" className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 p-1 hover:bg-indigo-50">
//   <User size={20} />
//   <span className={`${!isOpen && "md:hidden"}`}>Contact</span>
// </Link>

// {/* Nested Segment and Group links under Contact */}
// <div className="pl-6 space-y-1">
//   <Link to="/contact/segment" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 p-1 hover:bg-indigo-50">
//     <Minus size={10} />
//     <span className={`${!isOpen && "md:hidden"}`}>Segment</span>
//   </Link>
//   <Link to="/contact/group" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 p-1 hover:bg-indigo-50">
//     <Minus size={10} /> {/* Make sure to import Users icon if using this */}
//     <span className={`${!isOpen && "md:hidden"}`}>Group</span>
//   </Link>
// </div>


//           <h1 className={`py-3 text-sm ml-1 text-gray-500 ${!isOpen && "md:hidden"}`}>Templates</h1>
//           <Link to="/temp" className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 p-1 hover:bg-indigo-50">
//             <File size={20} />
//             <span className={`${!isOpen && "md:hidden"}`}>Templates</span>
//           </Link>

//           <h1 className={`py-4 text-sm ml-1 text-gray-500 ${!isOpen && "md:hidden"}`}>Marketing</h1>
//           <Link to="/campaign" className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 py-1 hover:bg-indigo-50">
//             <Megaphone size={20} />
//             <span className={`${!isOpen && "md:hidden"}`}>Campaign</span>
            
            
//           </Link>

//           <Link to="/messBot" className="flex items-center gap-2 ml-2 text-gray-700 hover:text-blue-600 py-2 hover:bg-indigo-50">
//             <MessageSquareText size={20} />
//             <span className={`${!isOpen && "md:hidden"}`}>Message Bot</span>
//           </Link>

//           <Link to="/tempBot" className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 py-2 hover:bg-indigo-50">
//             <Tag size={20} />
//             <span className={`${!isOpen && "md:hidden"}`}>Template Bot</span>
//           </Link>

//           <h1 className={`py-3 text-sm ml-1 text-gray-500 ${!isOpen && "md:hidden"}`}>Support</h1>
//           <Link to="/chat" className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 p-1 hover:bg-indigo-50">
//             <MessageCircle size={20} />
//             <span className={`${!isOpen && "md:hidden"}`}>Chat</span>
//           </Link>

//           <Link to="/setup" className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 p-1 hover:bg-indigo-50">
//             <Settings size={20} />
//             <span className={`${!isOpen && "md:hidden"}`}>Setup</span>
//           </Link>
//         </nav>
//         </div>
//       </div>

//       {isOpen && isMobile && <div className="fixed inset-0 bg-black bg-opacity-50 z-0" onClick={toggleSidebar} />}
//     </>
//   )
// }

// export default Sidebar












// // className= " sm: w-123 lg: w-1234  sm: hidden  lg: block "

// // Prefix	Min Width	Device Target	Example Use
// // sm:	640px	Small devices (phones)	sm:bg-blue-100
// // md:	768px	Medium devices (tablets)	md:text-lg
// // lg:	1024px	Large devices (laptops)	lg:flex
// // xl:	1280px	Extra large (desktops)	xl:grid-cols-4
// // 2xl:	1536px	Very large screens




import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {MessageCircle, LayoutDashboard,User,File,Tag,MessageSquareText,Megaphone, Settings, Link2, Menu, X, ChevronDown, ChevronLeft,Circle,
} from "lucide-react"

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [contactExpanded, setContactExpanded] = useState(false)
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
  const toggleSidebar = () => setIsOpen(!isOpen)
  const toggleContactDropdown = () => setContactExpanded(!contactExpanded)
  return (
    <>
      {/* Toggle Button */}
      <button
        className="md:hidden fixed top-9 left-4 z-30 bg-gray-50 p-2 rounded-md shadow-md md:left-4"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-20
          transition-all duration-300 ease-in-out
          bg-white border-r shadow-xl p-0 space-y-4 h-full 
          transform-gpuflex flex-col
          // ${isOpen ? "translate-x-0 w-42" : "translate-x-[-100%] md:translate-x-0 md:w-16"}
           ${isOpen ? "translate-x-0 w-56" : "translate-x-[-100%] md:translate-x-0 md:w-16"}        
        `}
      >
        <button
          onClick={toggleSidebar}
          className={`
            absolute top-4 right-3 z-30 p-2 rounded-md
            bg-gray-100 hover:bg-gray-200 transition-all duration-200
            shadow-sm hover:shadow-md
            ${!isOpen && "md:right-1"}
          `}
        >
          <Menu size={18} className="text-gray-600" />
        </button>
        <div className="flex flex-col justify-between h-full">
          <nav className="overflow-y-auto h-full pr-7 space-y-1">
            <img src="/waba logo 18-04-2025 (1).svg" className="block w-full h-28 object-contain" alt="Logo" />
            <Link
              to="/dashboard"
              className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 py-1 hover:bg-indigo-50"
            >
              <LayoutDashboard size={20} />
              <span className={`${!isOpen && "md:hidden"}`}>Dashboard</span>
            </Link>
            <Link
              to="/connect"
              className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 py-1 hover:bg-indigo-50"
            >
              <Link2 size={20} />
              <span className={`${!isOpen && "md:hidden"}`}>Connect WABA</span>
            </Link>
            <h1 className={`py-3 text-sm ml-1 text-gray-500 ${!isOpen && "md:hidden"}`}>Contact</h1>

            {/* Contact Dropdown */}
            <div className="relative">
              <button
                onClick={toggleContactDropdown}
                className="flex items-center ml-2 w-full gap-2 text-gray-700 hover:text-blue-600 p-1 hover:bg-indigo-50"
              >
                <User size={20} />
                <span className={`${!isOpen && "md:hidden"} flex-grow text-left`}>Contact</span>
                {isOpen &&
                  (contactExpanded ? (
                    <ChevronDown size={16} className="text-gray-500" />
                  ) : (
                    <ChevronLeft size={16} className="text-gray-500" />
                  ))}
              </button>

              <div
                className={`pl-6 space-y-1 overflow-hidden transition-all duration-200 ease-in-out ${contactExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <Link
                  to="/contact"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 p-1 hover:bg-indigo-50"
                >
                  <Circle size={10} />
                  <span className={`${!isOpen && "md:hidden"}`}>Contact</span>
                </Link>
                <Link
                  to="/contact/segment"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 p-1 hover:bg-indigo-50"
                >
                  <Circle size={10} />
                  <span className={`${!isOpen && "md:hidden"}`}>Segment</span>
                </Link>
                <Link
                  to="/contact/group"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 p-1 hover:bg-indigo-50"
                >
                  <Circle size={10} />
                  <span className={`${!isOpen && "md:hidden"}`}>Group</span>
                </Link>
              </div>
            </div>
            <h1 className={`py-3 text-sm ml-1 text-gray-500 ${!isOpen && "md:hidden"}`}>Templates</h1>
            <Link
              to="/temp"
              className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 p-1 hover:bg-indigo-50"
            >
              <File size={20} />
              <span className={`${!isOpen && "md:hidden"}`}>Templates</span>
            </Link>

            <h1 className={`py-4 text-sm ml-1 text-gray-500 ${!isOpen && "md:hidden"}`}>Marketing</h1>
            <Link
              to="/campaign"
              className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 py-1 hover:bg-indigo-50"
            >
              <Megaphone size={20} />
              <span className={`${!isOpen && "md:hidden"}`}>Campaign</span>
            </Link>

            <Link
              to="/messBot"
              className="flex items-center gap-2 ml-2 text-gray-700 hover:text-blue-600 py-2 hover:bg-indigo-50"
            >
              <MessageSquareText size={20} />
              <span className={`${!isOpen && "md:hidden"}`}>Message Bot</span>
            </Link>

            <Link
              to="/tempBot"
              className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 py-2 hover:bg-indigo-50"
            >
              <Tag size={20} />
              <span className={`${!isOpen && "md:hidden"}`}>Template Bot</span>
            </Link>

            <h1 className={`py-3 text-sm ml-1 text-gray-500 ${!isOpen && "md:hidden"}`}>Support</h1>
            <Link
              to="/chat"
              className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 p-1 hover:bg-indigo-50"
            >
              <MessageCircle size={20} />
              <span className={`${!isOpen && "md:hidden"}`}>Chat</span>
            </Link>

            <Link
              to="/setup"
              className="flex items-center ml-2 gap-2 text-gray-700 hover:text-blue-600 p-1 hover:bg-indigo-50"
            >
              <Settings size={20} />
              <span className={`${!isOpen && "md:hidden"}`}>Setup</span>
            </Link>
          </nav>
        </div>
      </div>
      {isOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={toggleSidebar} />
      )}
    </>
  )
}
export default Sidebar

