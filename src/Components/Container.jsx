import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Container() {
  return (
      <div className="flex flex-col md:flex-row h-screen bg-gray-100 ">
     
      <Navbar />
       <main className="flex-1">
        <Outlet />
      </main>

      
    </div>
  )
}
export default Container;