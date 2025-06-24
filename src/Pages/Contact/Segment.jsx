import { useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {   ArrowDownUp,  ChevronDown,  ChevronUp,  Edit, Eye, EyeOff, FileDown,  FilterIcon as Funnel,  PlusCircle, RefreshCcw, Trash,} from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import axios from "axios"
import SearchHeader from "../../Components/SearchHeader"
import toast from "react-hot-toast"

dayjs.extend(relativeTime)

function Segment() {
  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const Timer = useRef(null)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentTagId, setCurrentTagId] = useState(null)
  const [newTagName, setNewTagName] = useState("")
  const [showColumnOptions, setShowColumnOptions] = useState(false)
  const [hiddenColumns, setHiddenColumns] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [createTagName, setCreateTagName] = useState("")

  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false)
  const [segmentToDelete, setSegmentToDelete] = useState(null)
 
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const {
    data: segmentData = [],
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["segment"],
    queryFn: async () => {
      const wabaId = sessionStorage.getItem("waba_id");
      const accessToken = sessionStorage.getItem("auth_token");
  
      if (!wabaId || !accessToken) {
        console.error("Missing waba_id or auth_token in sessionStorage");
        throw new Error("Missing authentication data");
      }
  
      try {
        const response = await axios.get(`${BASE_URL}/api/tags/${wabaId}`, {
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
  
  

  const createSegment = async () => {
    if (!createTagName) {
      toast.error("Tag name cannot be empty");
      return;
    }
  
    const wabaId = sessionStorage.getItem("waba_id");
    const accessToken = sessionStorage.getItem("auth_token");
  
    if (!wabaId || !accessToken) {
      toast.error("Missing authentication credentials");
      return;
    }
  
    try {
      await axios.post(
        `${BASE_URL}/api/tags`,
        {
          whatsapp_business_account_id: wabaId,
          tag_name: createTagName,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Tag created successfully");
      setShowModal(false);
      setCreateTagName("");
      refetch();
    } catch (error) {
      console.error("Create error:", error);
      toast.error("Failed to create tag");
    }
  };
  

  // const updateSegment = async () => {
  //   if (!currentTagId || !newTagName) {
  //     toast.error("Tag name cannot be empty")
  //     return
  //   }
  //   try {
  //     await axios.put(`http://localhost:3001/api/tags/${currentTagId}`, {
  //       tag_name: newTagName,
  //     })
  //     toast.success("Tag updated successfully")
  //     setShowEditModal(false)
  //     setCurrentTagId(null)
  //     setNewTagName("")
  //     refetch()
  //   } catch (error) {
  //     console.error("Edit error:", error)
  //     toast.error("Failed to update tag")
  //   }
  // }

  const updateSegment = async () => {
    if (!currentTagId || !newTagName) {
      toast.error("Tag name cannot be empty")
      return
    }
  
    try {
      const token = sessionStorage.getItem("auth_token") // or localStorage
  
      await axios.put(
        `${BASE_URL}/api/tags/${currentTagId}`,
        { tag_name: newTagName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      toast.success("Tag updated successfully")
      setShowEditModal(false)
      setCurrentTagId(null)
      setNewTagName("")
      refetch()
    } catch (error) {
      console.error("Edit error:", error)
      toast.error("Failed to update tag")
    }
  }
  

  const deleteSegment = async (id) => {
    const accessToken = sessionStorage.getItem("auth_token");
  
    if (!accessToken) {
      toast.error("Missing authentication credentials");
      return;
    }
  
    try {
      await axios.delete(`${BASE_URL}/api/tags/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Tag deleted successfully");
      refetch(); // Refresh data
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete tag");
    }
  };
  

  const handleSelectAll = () => {
    if (selectedIds.length === displayedData.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(displayedData.map((c) => c.id))
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    clearTimeout(Timer.current)
    Timer.current = setTimeout(() => refetch(), 370)
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

  const columns = [
    { label: "ID", key: "id" },
    { label: "TagName", key: "tag_name" },
    { label: "Action", key: "action" },
  ]

  const toggleColumn = (key) => {
    setHiddenColumns((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  // const filteredData =
  //   segmentData?.filter((item) => (item.tag_name || "").toLowerCase().includes(search.toLowerCase())) || []

  const filteredData =
  segmentData?.filter((item) => (item.tag_name || "").toLowerCase().includes(search.toLowerCase())) || [];

console.log("Filtered data:", filteredData); // ✅ Check what's going to render

  const sortedData = [...filteredData].sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]

    if (Array.isArray(aVal)) {
      aVal = aVal.join(", ")
      bVal = bVal.join(", ")
    }

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

  const displayedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-0 mt-16">
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow"
        >
          <PlusCircle size={19} />
          Create Segment
        </button>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow"
        >
          <RefreshCcw size={15} />
          Refresh
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold mb-6">Add Segment</h2>
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter Segment Name"
                value={createTagName}
                onChange={(e) => setCreateTagName(e.target.value)}
                className="px-3 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-2 mt-11">
              <button
                onClick={() => {
                  setShowModal(false)
                  setCreateTagName("")
                }}
                className="px-3 py-2 text-sm rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={createSegment}
                className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Create Segment
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-6">Edit Segment</h2>
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Name</label>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="px-3 py-2 border rounded"
                placeholder="Enter Segment Name"
              />
            </div>
            <div className="flex justify-end gap-2 mt-11">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setCurrentTagId(null)
                  setNewTagName("")
                }}
                className="px-3 py-2 text-sm rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={updateSegment}
                className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Update Segment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-xl p-4 md:p-4 mt-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="bg-white text-gray-500 p-2 border rounded-lg">
            <FileDown size={20} />
          </div>
          <div
            className="bg-white text-gray-500 p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => setShowColumnOptions((prev) => !prev)}
            title="Hide/Show Columns"
          >
            {showColumnOptions ? <Eye className="text-blue-500" /> : <EyeOff />}
          </div>
          {showColumnOptions && (
            <div className="absolute z-10 mt-24 w-56 bg-white border rounded-md shadow-lg p-2 top-[120px] sm:top-[120px]">
              <p className="text-sm font-semibold mb-2">Toggle Columns</p>
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

        {isLoading ? (
          <p className="text-sm text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Error loading data</p>
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="min-w-full table-auto border-collapse text-xs md:text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 md:p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === displayedData.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    {columns
                      .filter((col) => !hiddenColumns.includes(col.key))
                      .map((col) => (
                        <th
                          key={col.key}
                          className="p-2 md:p-3 cursor-pointer whitespace-nowrap"
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
                  {displayedData.map((item) => (
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
                      {!hiddenColumns.includes("tag_name") && <td className="p-2 md:p-3">{item.tag_name}</td>}
                      {!hiddenColumns.includes("action") && (
                        <td className="p-2 md:p-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setCurrentTagId(item.id)
                                setNewTagName(item.tag_name)
                                setShowEditModal(true)
                              }}
                              className="text-blue-600"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="text-red-600 hover:underline text-sm"
                              // onClick={() => deleteSegment(item.id)}
                              onClick={() => {
                                setSegmentToDelete(item)
                                setDeleteConfirmModal(true)
                              }}
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
              <div>
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
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 ? "bg-gray-100 text-gray-400" : "bg-white border hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  Previous
                </button>
                {Array.from(
                  {
                    length: Math.ceil(filteredData.length / itemsPerPage),
                  },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "bg-white border hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredData.length / itemsPerPage)))
                  }
                  disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                  className={`px-3 py-1 rounded ${
                    currentPage === Math.ceil(filteredData.length / itemsPerPage)
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white border hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {deleteConfirmModal && segmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[95%] md:w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-center">Are you sure you want to delete this segment?</h2>
            <p className="text-center text-gray-500 mb-6">
              Segment: <strong>{segmentToDelete.tag_name}</strong>
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setDeleteConfirmModal(false)
                  setSegmentToDelete(null)
                }}
                className="px-4 py-2 text-sm rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteSegment(segmentToDelete.id)
                    setDeleteConfirmModal(false)
                    setSegmentToDelete(null)
                  } catch (err) {
                    console.error(err)
                  }
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Segment
