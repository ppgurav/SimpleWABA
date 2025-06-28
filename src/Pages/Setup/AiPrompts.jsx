import { useRef, useState } from "react"
import { EyeOff, Plus, ArrowDownUp, ChevronDown, ChevronUp, Eye, RefreshCcw } from "lucide-react"
import dayjs from "dayjs"
import { z } from "zod"
import SearchHeader from "../../Components/SearchHeader"

function AiPrompts() {
  const Timer = useRef(null)

  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const [hideInactive, setHideInactive] = useState(false)
  const [hiddenColumns, setHiddenColumns] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newStatus, setNewStatus] = useState({ name: "", action: "" })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [formErrors, setFormErrors] = useState({})

  const statusSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    action: z.string().min(1, { message: "Action is required" }),
  })

  const [temp, setTemp] = useState([
    {
      id: 1,
      name: "Auto-Reply Suggestions",
      promoption: "Generate a polite and professional WhatsApp auto-reply for a customer inquiry about their query.",
    },
    { id: 2, name: "hdf", promoption: "hdfhdf" },
    { id: 3, name: "sdfg", promoption: "sdfgsdfg" },
    { id: 4, name: "ttt", promoption: "yyy" },
    { id: 5, name: "fdgfdg", promoption: "ghjkjhkjhkh" },
  ])

  // const { data: mess, refetch } = useQuery({
  //   queryKey: ['Mess'],
  //   queryFn: async () => {
  //     const response = await api.get(``);
  //     return response.data;
  //   },
  // });

  const handleSearch = (e) => {
    setSearch(e.target.value)
    clearTimeout(Timer.current)
    Timer.current = setTimeout(() => {
      // refetch(); // You can re-enable this if using API
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
    return sortDirection === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />
  }

  const toggleColumn = (key) => {
    setHiddenColumns((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const handleEdit = (item) => {
    console.log("Edit clicked for:", item)
  }

  const columns = [
    { label: "ID", key: "id" },
    { label: "NAME", key: "name" },
    { label: "PROMOPTION", key: "promoption" },
  ]

  const filteredTemp = temp.filter((item) =>
    Object.values(item).some((val) => String(val).toLowerCase().includes(search.toLowerCase())),
  )

  const sortedTemp = [...filteredTemp].sort((a, b) => {
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

  // Calculate total pages for pagination
  const totalPages = Math.ceil(sortedTemp.length / itemsPerPage)

  // Get current page items
  const currentItems = sortedTemp.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleAddPrompt = () => {
    const result = statusSchema.safeParse(newStatus)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setFormErrors(fieldErrors)
      return
    }

    // Add new prompt to the list
    const newPrompt = {
      id: temp.length > 0 ? Math.max(...temp.map((item) => item.id)) + 1 : 1,
      name: newStatus.name,
      promoption: newStatus.action,
    }

    setTemp([...temp, newPrompt])
    setShowModal(false)
    setNewStatus({ name: "", action: "" })
    setFormErrors({})
  }

  return (
    <div className="px-1 md:px-1 mt-14">
      <div className="max-w-full mx-auto flex justify-between items-center mt-10 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} />
            New AI Prompt
          </button>

          <button
            onClick={() => {
              console.log("Refresh clicked")
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow"
            title="Refresh"
          >
            <RefreshCcw size={15} />
            Refresh
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-7 rounded-xl shadow-lg max-w-md w-full">
            <h1 className="text-lg font-semibold">Add New AI Prompt</h1>
            <hr className="mt-3" />
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-7">Name</label>
              <input
                type="text"
                value={newStatus.name}
                onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-emerald-300"
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-7">Prompt Template</label>
              <textarea
                value={newStatus.action}
                onChange={(e) => setNewStatus({ ...newStatus, action: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-emerald-300 min-h-[100px]"
              />
              {formErrors.action && <p className="text-red-500 text-xs mt-1">{formErrors.action}</p>}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowModal(false)
                  setNewStatus({ name: "", action: "" })
                  setFormErrors({})
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPrompt}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full bg-white shadow-md rounded-xl p-4 overflow-x-auto">

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 relative">
            <div
              className="bg-white text-gray-500 p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => setHideInactive((prev) => !prev)}
              title="Hide/Show columns"
            >
              {hideInactive ? <Eye size={20} className="text-emerald-500" /> : <EyeOff size={20} />}
            </div>

            {hideInactive && (
              <div className="absolute top-12 left-0 z-10 bg-white border shadow-md rounded-lg p-4 w-60">
                {columns.map((col) => (
                  <div
                    key={col.key}
                    onClick={() => toggleColumn(col.key)}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-1 rounded mb-1 text-sm"
                  >
                    <span>{col.label}</span>
                    {hiddenColumns.includes(col.key) ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-emerald-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="ml-auto w-full sm:w-auto">
            <SearchHeader search={search} handleSearch={handleSearch} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {columns
                  .filter((col) => !hiddenColumns.includes(col.key))
                  .map((col) => (
                    <th
                      key={col.key}
                      className="p-2 md:p-3 cursor-pointer select-none"
                      onClick={() => handleSort(col.key)}
                    >
                      <div className="flex items-center">
                        {col.label}
                        <span className="inline-block ml-1">{getArrow(col.key)}</span>
                      </div>
                    </th>
                  ))}
                <th className="p-2 md:p-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    {columns
                      .filter((col) => !hiddenColumns.includes(col.key))
                      .map((col) => (
                        <td key={col.key} className="p-3">
                          {item[col.key]}
                        </td>
                      ))}
                    <td className="p-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="p-3 text-center text-gray-500">
                    No prompts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
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
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>

            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border hover:bg-gray-50 text-gray-700"}`}
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return pageNum
              }).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${currentPage === page ? "bg-indigo-600 text-white" : "bg-white border hover:bg-gray-50 text-gray-700"}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages || totalPages === 0
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
    </div>
  )
}

export default AiPrompts
