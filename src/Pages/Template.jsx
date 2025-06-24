// // import { useQuery } from '@tanstack/react-query';
// // import React, { useRef, useState } from 'react';
// // import SearchHeader from '../Components/SearchHeader';
// // import { ArrowDownUp, ChevronDown, ChevronUp, FileDown, Funnel, Plus, PlusCircle, RefreshCcw } from 'lucide-react';
// // import dayjs from 'dayjs';
// // import { useNavigate } from 'react-router-dom';

// // function Template() {
// //   const [selectedIds, setSelectedIds] = useState([]);
// //   const [search, setSearch] = useState('');
// //   const [sortBy, setSortBy] = useState('id');
// //   const [sortDirection, setSortDirection] = useState('asc');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage, setItemsPerPage] = useState(3);
// //   const Timer = useRef(null);
// //   const navigate = useNavigate();

// //   const temp = [
// //     { id: 1, template_name: 'Welcome Template', languages: ['en'], categories: ['Marketing'], template_type: 'IMAGE', status: 'APPROVED', body_data: 'Welcome to our service!' },
// //     { id: 2, template_name: 'Reminder Template', languages: ['en'], categories: ['Marketing'], template_type: 'TEXT', status: 'APPROVED', body_data: "Don't forget your appointment!" },
// //     { id: 3, template_name: 'Welcome Template', languages: ['en'], categories: ['Utility'], template_type: 'TEXT', status: 'APPROVED', body_data: 'Welcome to our service!' },
// //     { id: 4, template_name: 'Welcome Template', languages: ['en-US'], categories: ['Marketing'], template_type: 'TEXT', status: 'APPROVED', body_data: 'Welcome to our service!' },
// //     { id: 5, template_name: 'Welcome Template', languages: ['en'], categories: ['Marketing'], template_type: 'Email', status: 'APPROVED', body_data: 'Welcome to our service!' },
// //   ];

// //   const { refetch } = useQuery({
// //     queryKey: ['Template'],
// //     queryFn: async () => {
// //       const response = await AppleIcon.get('');
// //       return response.data;
// //     }
// //   });

// //   const handleSelectAll = () => {
// //     setSelectedIds(selectedIds.length === temp.length ? [] : temp.map((c) => c.id));
// //   };

// //   const handleSearch = (e) => {
// //     setSearch(e.target.value);
// //     clearTimeout(Timer.current);
// //     Timer.current = setTimeout(() => {
// //       refetch();
// //     }, 370);
// //   };

// //   const handleSort = (column) => {
// //     if (sortBy === column) {
// //       setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
// //     } else {
// //       setSortBy(column);
// //       setSortDirection('asc');
// //     }
// //   };

// //   const getArrow = (column) => {
// //     if (sortBy !== column) return <ArrowDownUp size={15} />;
// //     return sortDirection === 'asc' ? <ChevronUp /> : <ChevronDown />;
// //   };

// //   const sortedTemp = [...temp].sort((a, b) => {
// //     let aVal = a[sortBy];
// //     let bVal = b[sortBy];
// //     if (Array.isArray(aVal)) {
// //       aVal = aVal.join(', ');
// //       bVal = bVal.join(', ');
// //     }
// //     if (dayjs(aVal).isValid() && dayjs(bVal).isValid()) {
// //       aVal = dayjs(aVal).valueOf();
// //       bVal = dayjs(bVal).valueOf();
// //     }
// //     if (typeof aVal === 'string') {
// //       return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
// //     } else {
// //       return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
// //     }
// //   });

// //   const columns = [
// //     { label: 'ID', key: 'id' },
// //     { label: 'Template_Name', key: 'template_name' },
// //     { label: 'LANGUAGE', key: 'languages' },
// //     { label: 'CATEGORIES', key: 'categories' },
// //     { label: 'TEMPLATE_TYPE', key: 'template_type' },
// //     { label: 'STATUS', key: 'status' },
// //     { label: 'BODY_DATA', key: 'body_data' },
// //   ];

// //   const filteredData = sortedTemp.filter((item) =>
// //     item.id.toString().includes(search.toLowerCase()) ||
// //     item.template_type.toLowerCase().includes(search.toLowerCase()) ||
// //     item.status.toLowerCase().includes(search.toLowerCase()) ||
// //     item.body_data.toLowerCase().includes(search.toLowerCase())
// //   );

// //   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

// //   return (
// //     <div className="w-full px-2 sm:px-4 md:px-1 lg:px-17 py-4 mt-12">
// //       <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
// //         <div className="flex flex-wrap gap-2">
// //           <button onClick={() => navigate("/temp/create")} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow">
// //             <PlusCircle size={19} /> Create Template
// //           </button>
// //           <button onClick={() => console.log("Template Management")} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow">
// //             <Plus size={16} /> Template Management
// //           </button>
// //           <button onClick={() => refetch()} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow">
// //             <RefreshCcw size={15} /> Refresh
// //           </button>
// //         </div>
// //       </div>

// //       <div className="bg-white shadow-md rounded-xl p-4 md:p-6 w-full overflow-x-auto">
// //         <div className="flex flex-wrap items-center gap-3 mb-4">
// //           <div className="p-2 border rounded-lg text-gray-500">
// //             <FileDown size={20} />
// //           </div>
// //           <div className="p-2 border rounded-lg text-gray-500">
// //             <Funnel size={20} />
// //           </div>
// //           <div className="ml-auto w-full sm:w-auto">
// //             <SearchHeader search={search} handleSearch={handleSearch} />
// //           </div>
// //         </div>

// //         <table className="min-w-full table-auto text-sm text-left">
// //           <thead className="bg-gray-100 text-gray-700">
// //             <tr>
// //               <th className="p-3">
// //                 <input type="checkbox" checked={selectedIds.length === temp.length} onChange={handleSelectAll} />
// //               </th>
// //               {columns.map((col) => (
// //                 <th key={col.key} className="p-3 cursor-pointer whitespace-nowrap" onClick={() => handleSort(col.key)}>
// //                   {col.label}<span className='inline-block ml-1'>{getArrow(col.key)}</span>
// //                 </th>
// //               ))}
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredData
// //               .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
// //               .map((item) => (
// //                 <tr key={item.id} className="border-b hover:bg-gray-50">
// //                   <td className="p-3">
// //                     <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => setSelectedIds((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id])} />
// //                   </td>
// //                   <td className="p-3">{item.id}</td>
// //                   <td className="p-3">{item.template_name}</td>
// //                   <td className="p-3">{item.languages.join(', ')}</td>
// //                   <td className="p-3">{item.categories.join(', ')}</td>
// //                   <td className="p-3">{item.template_type}</td>
// //                   <td className="p-3">
// //                     <span className="inline-block text-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-md min-w-[80px]">{item.status}</span>
// //                   </td>
// //                   <td className="p-3">{item.body_data}</td>
// //                 </tr>
// //             ))}
// //           </tbody>
// //         </table>

// //         <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
// //           <div>
// //             <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border rounded p-1 text-sm">
// //               <option value={3}>3</option>
// //               <option value={5}>5</option>
// //               <option value={10}>10</option>
// //               <option value={20}>20</option>
// //             </select>
// //           </div>

// //           <div className="flex space-x-1">
// //             <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border hover:bg-gray-50 text-gray-700"}`}>Previous</button>

// //             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// //               <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded ${currentPage === page ? "bg-indigo-600 text-white" : "bg-white border hover:bg-gray-50 text-gray-700"}`}>{page}</button>
// //             ))}

// //             <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border hover:bg-gray-50 text-gray-700"}`}>Next</button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Template;



// import { useQuery } from "@tanstack/react-query"
// import { useRef, useState } from "react"
// import SearchHeader from "../Components/SearchHeader"
// import {
//   ArrowDownUp,
//   ChevronDown,
//   ChevronUp,
//   FileDown,
//   FilterIcon as Funnel,
//   Plus,
//   PlusCircle,
//   RefreshCcw,
// } from "lucide-react"
// import dayjs from "dayjs"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"

// function Template() {
//   const [selectedIds, setSelectedIds] = useState([])
//   const [search, setSearch] = useState("")
//   const [sortBy, setSortBy] = useState("id")
//   const [sortDirection, setSortDirection] = useState("asc")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage, setItemsPerPage] = useState(5)
//   const Timer = useRef(null)
//   const navigate = useNavigate()

//   const API_URL = "http://localhost:3001/api/templates"

//   const getAuthToken = () => {
//     return localStorage.getItem("authToken") 
//   }

//   const {
//     data: templates = [],
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["Template"],
//     queryFn: async () => {
//       try {
//         const response = await axios.get(API_URL, {
//           headers: {
//             Authorization: `Bearer ${getAuthToken()}`,
//             "Content-Type": "application/json",
//           },
//         })
//         return response.data
//       } catch (error) {
//         console.error("Error fetching templates:", error)
//         throw error
//       }
//     },
//   })

//   const handleSelectAll = () => {
//     setSelectedIds(selectedIds.length === filteredData.length ? [] : filteredData.map((c) => c.id))
//   }

//   const handleSearch = (e) => {
//     setSearch(e.target.value)
//     clearTimeout(Timer.current)
//     Timer.current = setTimeout(() => {
//       refetch()
//     }, 370)
//   }

//   const handleSort = (column) => {
//     if (sortBy === column) {
//       setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
//     } else {
//       setSortBy(column)
//       setSortDirection("asc")
//     }
//   }

//   const getArrow = (column) => {
//     if (sortBy !== column) return <ArrowDownUp size={15} />
//     return sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />
//   }

//   const sortedTemp = [...templates].sort((a, b) => {
//     let aVal = a[sortBy]
//     let bVal = b[sortBy]
//     if (Array.isArray(aVal)) {
//       aVal = aVal.join(", ")
//       bVal = bVal.join(", ")
//     }
//     if (dayjs(aVal).isValid() && dayjs(bVal).isValid()) {
//       aVal = dayjs(aVal).valueOf()
//       bVal = dayjs(bVal).valueOf()
//     }
//     if (typeof aVal === "string") {
//       return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
//     } else {
//       return sortDirection === "asc" ? aVal - bVal : bVal - aVal
//     }
//   })

//   const filteredData = sortedTemp.filter(
//     (item) =>
//       item.id.toString().includes(search.toLowerCase()) ||
//       item.template_type?.toLowerCase().includes(search.toLowerCase()) ||
//       item.status?.toLowerCase().includes(search.toLowerCase()) ||
//       item.body_data?.toLowerCase().includes(search.toLowerCase()),
//   )

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage)

//   const columns = [
//     { label: "ID", key: "id" },
//     { label: "Template_Name", key: "template_name" },
//     { label: "LANGUAGE", key: "languages" },
//     { label: "CATEGORIES", key: "categories" },
//     { label: "TEMPLATE_TYPE", key: "template_type" },
//     { label: "STATUS", key: "status" },
//     { label: "BODY_DATA", key: "body_data" },
//   ]

//   return (
//     <div className="w-full px-2 sm:px-4 md:px-1 lg:px-17 py-4 mt-12">
//       <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={() => navigate("/temp/create")}
//             className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow"
//           >
//             <PlusCircle size={19} /> Create Template
//           </button>
//           <button
//             onClick={() => console.log("Template Management")}
//             className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow"
//           >
//             <Plus size={16} /> Template Management
//           </button>
//           <button
//             onClick={() => refetch()}
//             className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow"
//           >
//             <RefreshCcw size={15} /> Refresh
//           </button>
//         </div>
//       </div>

//       <div className="bg-white shadow-md rounded-xl p-4 md:p-6 w-full overflow-x-auto">
//         <div className="flex flex-wrap items-center gap-3 mb-4">
//           <div className="p-2 border rounded-lg text-gray-500">
//             <FileDown size={20} />
//           </div>
//           <div className="p-2 border rounded-lg text-gray-500">
//             <Funnel size={20} />
//           </div>
//           <div className="ml-auto w-full sm:w-auto">
//             <SearchHeader search={search} handleSearch={handleSearch} />
//           </div>
//         </div>

//         {isLoading ? (
//           <p className="text-center py-4">Loading templates...</p>
//         ) : isError ? (
//           <div className="text-center text-red-600 py-4">
//             <p>Failed to load templates.</p>
//             <p className="text-sm mt-1">
//               {error?.response?.status === 401 ? "Authentication error. Please log in again." : error?.message}
//             </p>
//           </div>
//         ) : (
//           <>
//             <table className="min-w-full table-auto text-sm text-left">
//               <thead className="bg-gray-100 text-gray-700">
//                 <tr>
//                   <th className="p-3">
//                     <input
//                       type="checkbox"
//                       checked={selectedIds.length === filteredData.length}
//                       onChange={handleSelectAll}
//                     />
//                   </th>
//                   {columns.map((col) => (
//                     <th
//                       key={col.key}
//                       className="p-3 cursor-pointer whitespace-nowrap"
//                       onClick={() => handleSort(col.key)}
//                     >
//                       {col.label}
//                       <span className="inline-block ml-1">{getArrow(col.key)}</span>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
//                   <tr key={item.id} className="border-b hover:bg-gray-50">
//                     <td className="p-3">
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.includes(item.id)}
//                         onChange={() =>
//                           setSelectedIds((prev) =>
//                             prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="p-3">{item.id}</td>
//                     <td className="p-3">{item.template_name}</td>
//                     <td className="p-3">{item.languages?.join(", ")}</td>
//                     <td className="p-3">{item.categories?.join(", ")}</td>
//                     <td className="p-3">{item.template_type}</td>
//                     <td className="p-3">
//                       <span className="inline-block text-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-md min-w-[80px]">
//                         {item.status}
//                       </span>
//                     </td>
//                     <td className="p-3">{item.body_data}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
//               <div>
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => {
//                     setItemsPerPage(Number(e.target.value))
//                     setCurrentPage(1)
//                   }}
//                   className="border rounded p-1 text-sm"
//                 >
//                   <option value={3}>3</option>
//                   <option value={5}>5</option>
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                 </select>
//               </div>

//               <div className="flex space-x-1">
//                 <button
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border hover:bg-gray-50 text-gray-700"}`}
//                 >
//                   Previous
//                 </button>
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-3 py-1 rounded ${currentPage === page ? "bg-indigo-600 text-white" : "bg-white border hover:bg-gray-50 text-gray-700"}`}
//                   >
//                     {page}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border hover:bg-gray-50 text-gray-700"}`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Template



import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import SearchHeader from '../Components/SearchHeader';
import { ArrowDownUp, ChevronDown, ChevronUp, FileDown, Funnel, Plus, PlusCircle, RefreshCcw } from 'lucide-react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Template() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const Timer = useRef(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['Template'],
  //   queryFn: async () => {
  //     const token = localStorage.getItem('auth_token'); // ✅ Get token
  //     const response = await axios.get('http://localhost:3001/api/templates', {
  //       headers: {
  //         Authorization: `Bearer ${token}` // ✅ Send token
  //       }
  //     });
  //     return response.data.templates;
  //   }
  // });
  queryFn: async () => {
    const wabaId = sessionStorage.getItem("waba_id");
    const accessToken = sessionStorage.getItem("auth_token");

    if (!wabaId || !accessToken) {
      console.error("Missing waba_id or auth_token in sessionStorage");
      throw new Error("Missing authentication data");
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/templates`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("API Response:", response.data);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching segments:", error?.response?.data || error.message);
      throw new Error("Failed to load segment");
    }
  },
});

  const handleSelectAll = () => {
    setSelectedIds(selectedIds.length === templates.length ? [] : templates.map((c) => c.id));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    clearTimeout(Timer.current);
    Timer.current = setTimeout(() => {
      refetch();
    }, 370);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const getArrow = (column) => {
    if (sortBy !== column) return <ArrowDownUp size={15} />;
    return sortDirection === 'asc' ? <ChevronUp /> : <ChevronDown />;
  };

  const templates = Array.isArray(data) ? data : [];

  const sortedTemplates = [...templates].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (Array.isArray(aVal)) {
      aVal = aVal.join(', ');
      bVal = bVal.join(', ');
    }
    if (dayjs(aVal).isValid() && dayjs(bVal).isValid()) {
      aVal = dayjs(aVal).valueOf();
      bVal = dayjs(bVal).valueOf();
    }
    if (typeof aVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Template_Name', key: 'template_name' },
    { label: 'LANGUAGE', key: 'languages' },
    { label: 'CATEGORIES', key: 'categories' },
    { label: 'TEMPLATE_TYPE', key: 'template_type' },
    { label: 'STATUS', key: 'status' },
    { label: 'BODY_DATA', key: 'body_data' },
  ];

  const filteredData = sortedTemplates.filter((item) =>
    item.id.toString().includes(search.toLowerCase()) ||
    item.template_type?.toLowerCase()?.includes(search.toLowerCase()) ||
    item.status?.toLowerCase()?.includes(search.toLowerCase()) ||
    item.body_data?.toLowerCase()?.includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="w-full px-2 sm:px-4 md:px-1 lg:px-17 py-4 mt-12">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate("/temp/create")} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow">
            <PlusCircle size={19} /> Create Template
          </button>
          <button onClick={() => console.log("Template Management")} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow">
            <Plus size={16} /> Template Management
          </button>
          <button onClick={() => refetch()} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow">
            <RefreshCcw size={15} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-4 md:p-6 w-full overflow-x-auto">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="p-2 border rounded-lg text-gray-500">
            <FileDown size={20} />
          </div>
          <div className="p-2 border rounded-lg text-gray-500">
            <Funnel size={20} />
          </div>
          <div className="ml-auto w-full sm:w-auto">
            <SearchHeader search={search} handleSearch={handleSearch} />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10">Loading templates...</div>
        ) : (
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">
                  <input type="checkbox" checked={selectedIds.length === templates.length} onChange={handleSelectAll} />
                </th>
                {columns.map((col) => (
                  <th key={col.key} className="p-3 cursor-pointer whitespace-nowrap" onClick={() => handleSort(col.key)}>
                    {col.label}<span className='inline-block ml-1'>{getArrow(col.key)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => setSelectedIds((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id])} />
                    </td>
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">{item.template_name}</td>
                    <td className="p-3">{Array.isArray(item.languages) ? item.languages.join(', ') : item.languages}</td>
                    <td className="p-3">{Array.isArray(item.categories) ? item.categories.join(', ') : item.categories}</td>
                    <td className="p-3">{item.template_type}</td>
                    <td className="p-3">
                      <span className="inline-block text-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-md min-w-[80px]">{item.status}</span>
                    </td>
                    <td className="p-3">{item.body_data}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
          <div>
            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border rounded p-1 text-sm">
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex space-x-1">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border hover:bg-gray-50 text-gray-700"}`}>Previous</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded ${currentPage === page ? "bg-indigo-600 text-white" : "bg-white border hover:bg-gray-50 text-gray-700"}`}>{page}</button>
            ))}

            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border hover:bg-gray-50 text-gray-700"}`}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Template;
