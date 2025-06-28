import { Layers, Mail, Plane, SlidersHorizontal, SquareArrowRight, X } from "lucide-react"
import { useLocation, Link, Outlet } from "react-router-dom"
import { useState } from "react"

function Setup() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()

  const closeSidebar = () => setIsSidebarOpen(false)

  const getLinkClasses = (path) => {
    const isActive = location.pathname === `/setup/${path}`  // or use endsWith(path)
    const baseClasses = "flex items-center gap-2 py-2 px-3 rounded-lg transition-colors duration-200"
    const activeClasses = "bg-gradient-to-r text-white from-blue-500 to-purple-600  shadow-blue-500/25font-medium border-l-4 border-blue-600"
    const inactiveClasses = "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
  }
  

  return (
    <div className="flex">
      {isSidebarOpen && (
        <div className="w-72 bg-white border-r p-4 h-screen space-y-4 fixed top-0 left-0 z-40">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black">Setup</h1>
            <button onClick={closeSidebar}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="overflow-y-auto h-full pr-2 space-y-2">
            <Link to="status" className={getLinkClasses("status")}>
              <SlidersHorizontal size={20} /> Status
            </Link>
            <Link to="source" className={getLinkClasses("source")}>
              <Layers size={20} /> Source
            </Link>
            <Link to="ai" className={getLinkClasses("ai")}>
              <Plane size={20} /> AI Prompts
            </Link>
            <Link to="canned" className={getLinkClasses("canned")}>
              <SquareArrowRight size={20} /> Canned Reply
            </Link>
            <Link to="emailtemp" className={getLinkClasses("emailtemp")}>
              <Mail size={20} /> Email Template
            </Link>
          </nav>
        </div>
      )}
      <div className="ml-16 w-full p-6">
        <Outlet />
      </div>
    </div>
  )
}

export default Setup
