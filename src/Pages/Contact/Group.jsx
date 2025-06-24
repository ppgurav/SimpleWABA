import { useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowDownUp,
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  EyeOff,
  FileDown,
  FilterIcon as Funnel,
  PlusCircle,
  Trash,
} from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import SearchHeader from "../../Components/SearchHeader"
import axios from "axios"
import toast from "react-hot-toast"

dayjs.extend(relativeTime)

function Group() {
  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const Timer = useRef(null)
  const [showModal, setShowModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [showColumnOptions, setShowColumnOptions] = useState(false)
  const [hiddenColumns, setHiddenColumns] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [newGroupName, setNewGroupName] = useState("")
  const [currentGroup, setCurrentGroup] = useState(null)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState(null)
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["groupsAttachment"],
    queryFn: async () => {
      try {
        const accessToken = sessionStorage.getItem("auth_token");
        console.log("Access token:", accessToken);
        
        const response = await axios.get(`${BASE_URL}/api/groups`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
    
        console.log("Response:", response.data);
        return response.data.data;
      } catch (error) {
        console.error("API error response:", error?.response?.data || error.message);
        throw new Error("Failed to load groups");
      }
    }
    
  })

  const temp = Array.isArray(data) ? data : []

  const handleSelectAll = () => {
    setSelectedIds(selectedIds.length === temp.length ? [] : temp.map((c) => c.id))
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

  const sortedTemp = [...temp].sort((a, b) => {
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

  const columns = [
    { label: "ID", key: "id" },
    { label: "NAME", key: "group_name" },
    { label: "Action", key: "action" },
  ]

  const toggleColumn = (key) => {
    setHiddenColumns((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const handleEdit = (group) => {
    setCurrentGroup(group)
    setNewGroupName(group.group_name)
    setEditModal(true)
  }

  const updateGroup = async () => {
    if (!currentGroup || !newGroupName) return
    try {
      const accessToken = sessionStorage.getItem("auth_token")

      await axios.put(
        `${BASE_URL}/api/groups/${currentGroup.id}`,
        {
          group_name: newGroupName,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      toast.success("Group updated successfully")
      setEditModal(false)
      setCurrentGroup(null)
      refetch()
    } catch (error) {
      console.error("Edit error:", error)
      toast.error("Failed to update group")
    }
  }

  const deleteGroup = async (id) => {
    try {
      const accessToken = sessionStorage.getItem("auth_token")

      await axios.delete(`${BASE_URL}/api/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      toast.success("Group deleted successfully")
      refetch()
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete group")
    }
  }

  const createGroup = async () => {
    if (!newGroupName) {
      toast.error("Group name cannot be empty")
      return
    }

    const wabaId = sessionStorage.getItem("waba_id")
    const accessToken = sessionStorage.getItem("auth_token")

    if (!wabaId) {
      toast.error("WABA ID not found in session")
      return
    }

    if (!accessToken) {
      toast.error("Access token not found")
      return
    }

    try {
      await axios.post(
        `${BASE_URL}/api/groups`,
        {
          whatsapp_business_account_id: wabaId,
          group_name: newGroupName,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      toast.success("Group created successfully")
      setShowModal(false)
      setNewGroupName("")
      refetch()
    } catch (error) {
      console.error("Create Group error:", error)
      toast.error("Failed to create group")
    }
  }

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-0 mt-16">
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow"
        >
          <PlusCircle size={19} /> Create Group
        </button>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[95%] md:w-full max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">Add Group</h2>
            <div className="flex flex-col mb-6">
              <label className="font-semibold mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="px-3 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 text-sm rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[95%] md:w-full max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">Edit Group</h2>
            <div className="flex flex-col mb-6">
              <label className="font-semibold mb-1">Name</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="px-3 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModal(false)}
                className="px-3 py-2 text-sm rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={updateGroup}
                className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && groupToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[95%] md:w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-center">Are you sure you want to delete this group?</h2>
            <p className="text-center text-gray-500 mb-6">
              Group: <strong>{groupToDelete.group_name}</strong>
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setDeleteConfirmModal(false)
                  setGroupToDelete(null)
                }}
                className="px-4 py-2 text-sm rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteGroup(groupToDelete.id)
                    setDeleteConfirmModal(false)
                    setGroupToDelete(null)
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
                  {hiddenColumns.includes(col.key) ? <EyeOff size={16} /> : <Eye size={16} className="text-blue-500" />}
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
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full table-auto border-collapse text-xs md:text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 md:p-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === temp.length && temp.length > 0}
                        onChange={handleSelectAll}
                      />
                      Select <ArrowDownUp size={15} className="opacity-30" />
                    </div>
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
                {sortedTemp
                  .filter((item) => item.group_name.toLowerCase().includes(search.toLowerCase()))
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item) => (
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
                      {!hiddenColumns.includes("group_name") && <td className="p-2 md:p-3">{item.group_name}</td>}
                      {!hiddenColumns.includes("action") && (
                        <td className="p-2 md:p-3">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:underline text-sm" onClick={() => handleEdit(item)}>
                              <Edit size={18} />
                            </button>
                            <button
                              className="text-red-600 hover:underline text-sm"
                              onClick={() => {
                                setGroupToDelete(item)
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
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
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

          <div className="flex gap-1 flex-wrap">
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
            {Array.from({ length: Math.ceil(sortedTemp.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(sortedTemp.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(sortedTemp.length / itemsPerPage)}
              className={`px-3 py-1 rounded ${
                currentPage === Math.ceil(sortedTemp.length / itemsPerPage)
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
  )
}

export default Group
