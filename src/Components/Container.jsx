// import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";

// function Container() {
//   return (
//     <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-100">
//       <Navbar />
//       <main className="flex-1 overflow-auto">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
// export default Container;

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Container() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Navbar fixed height on top (mobile) or full height on left (desktop) */}
      <div className="md:h-screen h-16 md:w-64 flex-shrink-0">

        <Navbar />
      </div>


      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Container;
