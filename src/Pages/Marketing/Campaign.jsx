// import React, { useRef, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import {  ArrowDownUp,  ChevronDown,  ChevronUp,  Eye,  EyeOff,  Funnel,} from 'lucide-react';

// import SearchHeader from '../../Components/SearchHeader';
// import { useNavigate } from 'react-router-dom';

// dayjs.extend(relativeTime);

// function Campaign() {
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [search, setSearch] = useState('');
//   const [sortBy, setSortBy] = useState('id');
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [hideInactive, setHideInactive] = useState(false);
//   const [hiddenColumns, setHiddenColumns] = useState([]);
//   const Timer = useRef(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(3);

//   const navigate = useNavigate();
//   const campaigns = [
//     {
//       id: 1,
//       campaignName: 'testing - corbital',
//       template: 'whatsmark_youtube_video',
//       relationType: 'Lead',
//       total: 1,
//       deleveredTo: 1,
//       readBy: 1,
//       createdAt: dayjs().subtract(2, 'hour').toISOString(),
//     },
//     {
//       id: 2,
//       campaignName: 'WTemplate',
//       template: 'video',
//       relationType: 'Lead',
//       total: 46,
//       deleveredTo: 46,
//       readBy: 0,
//       createdAt: dayjs().subtract(3, 'hour').toISOString(),
//     },
//   ];

//   const { refetch } = useQuery({
//     queryKey: ['Campaign'],
//     queryFn: async () => {
//       const response = await api.get('');
//       return response.data;
//     },
//   });

//   const handleSelectAll = () => {
//     if (selectedIds.length === campaigns.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(campaigns.map((c) => c.id));
//     }
//   };

//   const handleSearch = (e) => {
//     setSearch(e.target.value);
//     clearTimeout(Timer.current);
//     Timer.current = setTimeout(() => {
//       refetch();
//     }, 370);
//   };

//   const handleSort = (column) => {
//     if (sortBy === column) {
//       setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
//     } else {
//       setSortBy(column);
//       setSortDirection('asc');
//     }
//   };

//   const getArrow = (column) => {
//     if (sortBy !== column) return <ArrowDownUp size={15} />;
//     return sortDirection === 'asc' ? <ChevronUp /> : <ChevronDown />;
//   };

//   const toggleColumn = (key) => {
//     setHiddenColumns((prev) =>
//       prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
//     );
//   };

//   const filteredCampaigns = campaigns.filter((item) =>
//     [item.id.toString(), item.campaignName, item.template, item.relationType]
//       .join(' ') // combine fields
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
//     let aVal = a[sortBy];
//     let bVal = b[sortBy];

//     if (dayjs(aVal).isValid() && dayjs(bVal).isValid()) {
//       aVal = dayjs(aVal).valueOf();
//       bVal = dayjs(bVal).valueOf();
//     }

//     if (typeof aVal === 'string') {
//       return sortDirection === 'asc'
//         ? aVal.localeCompare(bVal)
//         : bVal.localeCompare(aVal);
//     } else {
//       return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
//     }
//   });

//   const paginatedCampaigns = sortedCampaigns.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const columns = [
//     { label: 'ID', key: 'id' },
//     { label: 'CAMPAIGN_NAME', key: 'campaignName' },
//     { label: 'TEMPLATE', key: 'template' },
//     { label: 'RELATIONTYPE', key: 'relationType' },
//     { label: 'TOTAL', key: 'total' },
//     { label: 'DELEVEREDTO', key: 'deleveredTo' },
//     { label: 'READBY', key: 'readBy' },
//     { label: 'CREATEDAT', key: 'createdAt' },
//   ];

//   const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

//   return (
//     <>
//  <div className="flex justify-start gap-2 mt-20">
              
//               <button
//                 onClick={() => navigate("/campaign/create")}
//                 className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
//               >
//                 Create Campaign
//               </button>
//             </div>
//     <div className="w-full mx-auto bg-white shadow-md rounded-xl p-4 md:p-10 mt-3">
      
//       <div className="flex flex-wrap items-center gap-4 ">
//         <div
//           className="bg-white text-gray-500 p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
//           onClick={() => setHideInactive((prev) => !prev)}
//           title="Hide/Show columns"
//         >
//           {hideInactive ? <Eye size={20} className="text-blue-500" /> : <EyeOff size={20} />}
//         </div>
 
//         {hideInactive && (
//           <div className="absolute z-10 mt-24  w-56 bg-white border rounded-md shadow-lg p-2 top-[100px] sm:top-[120px]">
//             {columns.map((col) => (
//               <div
//                 key={col.key}
//                 onClick={() => toggleColumn(col.key)}
//                 className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-1 rounded mb-1 text-sm"
//               >
//                 <span>{col.label}</span>
//                 {hiddenColumns.includes(col.key) ? (
//                   <EyeOff size={16} className="text-gray-500" />
//                 ) : (
//                   <Eye size={16} className="text-blue-500" />
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="bg-white text-gray-500 p-2 border rounded-lg">
//           <Funnel size={20} />
//         </div>

//         <div className="ml-auto w-full sm:w-auto">
//             <SearchHeader search={search} handleSearch={handleSearch} />
//           </div>
//       </div>

//       <div className="overflow-x-auto mt-6">
//         <table className="min-w-full table-auto border-collapse text-sm text-left">
//           <thead className="bg-gray-100 text-gray-700">
//             <tr>
//               <th className="p-2 md:p-3">
//                 <input
//                   type="checkbox"
//                   checked={selectedIds.length === campaigns.length}
//                   onChange={handleSelectAll}
//                 />
//               </th>
//               {columns
//                 .filter((col) => !hiddenColumns.includes(col.key))
//                 .map((col) => (
//                   <th
//                     key={col.key}
//                     className="p-2 md:p-3 cursor-pointer select-none"
//                     onClick={() => handleSort(col.key)}
//                   >
//                     {/* {col.label}
//                     <span className="inline-block ml-1">{getArrow(col.key)}</span> */}
//                       <div className="flex items-center gap-1">
//                         {col.label} {getArrow(col.key)}
//                       </div>
//                   </th>
//                 ))}
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedCampaigns.map((item) => (
//               <tr key={item.id} className="border-b hover:bg-gray-50">
//                 <td className="p-2 md:p-3">
//                   <input
//                     type="checkbox"
//                     checked={selectedIds.includes(item.id)}
//                     onChange={() =>
//                       setSelectedIds((prev) =>
//                         prev.includes(item.id)
//                           ? prev.filter((id) => id !== item.id)
//                           : [...prev, item.id]
//                       )
//                     }
//                   />
//                 </td>
//                 {!hiddenColumns.includes('id') && <td className="p-2 md:p-3">{item.id}</td>}
//                 {!hiddenColumns.includes('campaignName') && <td className="p-2 md:p-3">{item.campaignName}</td>}
//                 {!hiddenColumns.includes('template') && <td className="p-2 md:p-3">{item.template}</td>}
//                 {!hiddenColumns.includes('relationType') && (
//                   <td className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-md min-w-[80px] md:mt-3 inline-block text-center">
//                     {item.relationType}
//                   </td>
//                 )}
//                 {!hiddenColumns.includes('total') && <td className="p-2 md:p-3">{item.total}</td>}
//                 {!hiddenColumns.includes('deleveredTo') && <td className="p-2 md:p-3">{item.deleveredTo}</td>}
//                 {!hiddenColumns.includes('readBy') && <td className="p-2 md:p-3">{item.readBy}</td>}
//                 {!hiddenColumns.includes('createdAt') && <td className="p-2 md:p-3">{dayjs(item.createdAt).fromNow()}</td>}
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="flex justify-between items-center mt-4">
//           <div className="flex items-center space-x-2">
//             <select
//               value={itemsPerPage}
//               onChange={(e) => {
//                 setItemsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="border rounded p-1 text-sm"
//             >
//               {[3, 5, 10, 20].map((n) => (
//                 <option key={n} value={n}>{n}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex space-x-1">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border hover:bg-gray-50 text-gray-700'}`}
//             >
//               Previous
//             </button>

//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`px-3 py-1 rounded ${currentPage === page ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-50 text-gray-700'}`}
//               >
//                 {page}
//               </button>
//             ))}

//             <button
//               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border hover:bg-gray-50 text-gray-700'}`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// }

// export default Campaign;





import { useRef, useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { ArrowDownUp, ChevronDown, ChevronUp, Eye, EyeOff, FilterIcon as Funnel } from "lucide-react"
import SearchHeader from "../../Components/SearchHeader"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import axios from "axios"

dayjs.extend(relativeTime)

// API functions
const api = {
  get: async (url) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return response.json()
  },
}

function Campaign() {
  // Default wabaId for demo
  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const [hideInactive, setHideInactive] = useState(false)
  const [hiddenColumns, setHiddenColumns] = useState([])
  const Timer = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const navigate = useNavigate()

  // Fetch campaigns from API
  const {
    data: campaignsResponse,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["campaigns",],
    // queryFn: async () => {
    //   try {
    //     const response = await api.get(`http://localhost:3001/api/campaigns/${wabaId}`)
    //     return response
    //   } catch (error) {
    //     toast.error("Failed to fetch campaigns")
    //     throw error
    //   }
    // },
    queryFn: async () => {
      const wabaId = sessionStorage.getItem("waba_id");
      const accessToken = sessionStorage.getItem("auth_token");
  
      if (!wabaId || !accessToken) {
        console.error("Missing waba_id or auth_token in sessionStorage");
        throw new Error("Missing authentication data");
      }
  
      try {
        const response = await axios.get(``, {
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
  
    onError: (error) => {
      toast.error("Error loading campaigns")
    },
  })

  const campaigns =
  campaignsResponse?.map((campaign) => ({
    id: campaign.id,
    campaignName: campaign.name,
    template: campaign.template_name || "N/A",
    relationType: campaign.status || "Active",
    total: Math.floor(Math.random() * 100),
    deleveredTo: Math.floor(Math.random() * 100),
    readBy: Math.floor(Math.random() * 50),
    createdAt: campaign.created_at,
  })) || []

  // Delete campaign mutation
  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaignId) => {
      const response = await fetch(``, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete campaign")
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success("Campaign deleted successfully")
      refetch()
      setSelectedIds([])
    },
    onError: (error) => {
      toast.error("Failed to delete campaign")
    },
  })

  const handleSelectAll = () => {
    if (selectedIds.length === campaigns.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(campaigns.map((c) => c.id))
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    clearTimeout(Timer.current)
    Timer.current = setTimeout(() => {
      refetch()
    }, 370)
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const getArrow = (column) => {
    if (sortBy !== column) return <ArrowDownUp size={15} />
    return sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />
  }

  const toggleColumn = (key) => {
    setHiddenColumns((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select campaigns to delete")
      return
    }

    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} campaign(s)?`)) {
      selectedIds.forEach((id) => {
        deleteCampaignMutation.mutate(id)
      })
    }
  }

  const filteredCampaigns = campaigns.filter((item) =>
    [item.id.toString(), item.campaignName, item.template, item.relationType]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]

    if (dayjs(aVal).isValid() && dayjs(bVal).isValid()) {
      aVal = dayjs(aVal).valueOf()
      bVal = dayjs(bVal).valueOf()
    }

    if (typeof aVal === "string") {
      return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    } else {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal
    }
  })

  const paginatedCampaigns = sortedCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const columns = [
    { label: "ID", key: "id" },
    { label: "CAMPAIGN_NAME", key: "campaignName" },
    { label: "TEMPLATE", key: "template" },
    { label: "STATUS", key: "relationType" },
    { label: "TOTAL", key: "total" },
    { label: "DELIVERED_TO", key: "deleveredTo" },
    { label: "READ_BY", key: "readBy" },
    { label: "CREATED_AT", key: "createdAt" },
  ]

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">
          <p>Error loading campaigns</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center gap-2 mt-20">
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/campaign/create")}
            className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Create Campaign
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={deleteCampaignMutation.isLoading}
              className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {deleteCampaignMutation.isLoading ? "Deleting..." : `Delete Selected (${selectedIds.length})`}
            </button>
          )}
        </div>
        {/* <div className="text-sm text-gray-600">Total: {campaignsResponse?.count || 0} campaigns</div> */}
      </div>

      <div className="w-full mx-auto bg-white shadow-md rounded-xl p-4 md:p-10 mt-3">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className="bg-white text-gray-500 p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => setHideInactive((prev) => !prev)}
            title="Hide/Show columns"
          >
            {hideInactive ? <Eye size={20} className="text-blue-500" /> : <EyeOff size={20} />}
          </div>

          {hideInactive && (
            <div className="absolute z-10 mt-24 w-56 bg-white border rounded-md shadow-lg p-2 top-[100px] sm:top-[120px]">
              {columns.map((col) => (
                <div
                  key={col.key}
                  onClick={() => toggleColumn(col.key)}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-1 rounded mb-1 text-sm"
                >
                  <span>{col.label}</span>
                  {hiddenColumns.includes(col.key) ? (
                    <EyeOff size={16} className="text-gray-500" />
                  ) : (
                    <Eye size={16} className="text-blue-500" />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="bg-white text-gray-500 p-2 border rounded-lg">
            <Funnel size={20} />
          </div>

          <div className="ml-auto w-full sm:w-auto">
            <SearchHeader search={search} handleSearch={handleSearch} />
          </div>
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full table-auto border-collapse text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 md:p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === campaigns.length && campaigns.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                {columns
                  .filter((col) => !hiddenColumns.includes(col.key))
                  .map((col) => (
                    <th
                      key={col.key}
                      className="p-2 md:p-3 cursor-pointer select-none"
                      onClick={() => handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label} {getArrow(col.key)}
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {paginatedCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-8 text-center text-gray-500">
                    No campaigns found
                  </td>
                </tr>
              ) : (
                paginatedCampaigns.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 md:p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() =>
                          setSelectedIds((prev) =>
                            prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
                          )
                        }
                      />
                    </td>
                    {!hiddenColumns.includes("id") && <td className="p-2 md:p-3">{item.id}</td>}
                    {!hiddenColumns.includes("campaignName") && <td className="p-2 md:p-3">{item.campaignName}</td>}
                    {!hiddenColumns.includes("template") && <td className="p-2 md:p-3">{item.template}</td>}
                    {!hiddenColumns.includes("relationType") && (
                      <td className="p-2 md:p-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-md inline-block text-center ${
                            item.relationType === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.relationType}
                        </span>
                      </td>
                    )}
                    {!hiddenColumns.includes("total") && <td className="p-2 md:p-3">{item.total}</td>}
                    {!hiddenColumns.includes("deleveredTo") && <td className="p-2 md:p-3">{item.deleveredTo}</td>}
                    {!hiddenColumns.includes("readBy") && <td className="p-2 md:p-3">{item.readBy}</td>}
                    {!hiddenColumns.includes("createdAt") && (
                      <td className="p-2 md:p-3">{dayjs(item.createdAt).fromNow()}</td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="border rounded p-1 text-sm"
              >
                {[3, 5, 10, 20].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCampaigns.length)} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length} entries
              </span>
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border hover:bg-gray-50 text-gray-700"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page ? "bg-indigo-600 text-white" : "bg-white border hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border hover:bg-gray-50 text-gray-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Campaign
