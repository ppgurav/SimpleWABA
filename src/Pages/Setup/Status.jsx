import { useEffect, useRef, useState } from "react"
import {  Eye,  EyeOff,  Plus,  ArrowDownUp,  ChevronDown,  ChevronUp,  RefreshCcw,} from "lucide-react"
import dayjs from "dayjs"
import { z } from "zod"
import { ChromePicker } from "react-color"
import SearchHeader from "../../Components/SearchHeader"

export default function Status() {
  const [search, setSearch] = useState("")
  const Timer = useRef(null)
  const [sortBy, setSortBy] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const [hideInactive, setHideInactive] = useState(false)
  const [hiddenColumns, setHiddenColumns] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [newStatus, setNewStatus] = useState({ name: "", color: "" })
  const [showColorPicker, setShowColorPicker] = useState(false)
  const pickerRef = useRef(null)
  const [formErrors, setFormErrors] = useState({})

  const statusSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    color: z.string().min(1, { message: "Color is required" }),
  })

  const temp = [
    { id: 1, name: "New", color: "bg-green-500", action: "Edit" },
    { id: 2, name: "In progress", color: "bg-blue-500", action: "Edit" },
    { id: 3, name: "Qualified", color: "bg-yellow-500", action: "Edit" },
    { id: 4, name: "Contacted", color: "bg-purple-500", action: "Edit" },
    { id: 5, name: "Closed", color: "bg-green-500", action: "Edit" },
  ]

  const refetch = () => {
    console.log("Refetching data...")
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
    return sortDirection === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />
  }

  const columns = [
    { label: "ID", key: "id" },
    { label: "NAME", key: "name" },
    { label: "COLOR", key: "color" },
    { label: "ACTION", key: "action" },
  ]

  const toggleColumn = (key) => {
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleEdit = (item) => {
    console.log("Edit clicked for:", item)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowColorPicker(false)
      }
    }

    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showColorPicker])

  // ✅ Apply search filtering BEFORE sorting and pagination
  const filteredData = temp.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

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
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    return sortDirection === "asc" ? aVal - bVal : bVal - aVal
  })

  return (
    <div className="px-1 md:px-1 mt-14">
      <div className="max-w-full mx-auto flex justify-between items-center mt-10 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} />
            New Status
          </button>

          <button
            onClick={() => {
              console.log("Refresh clicked")
              refetch()
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow"
            title="Refresh"
          >
            <RefreshCcw size={15} />
            Refresh
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-7 rounded-xl shadow-lg w-full max-w-md mx-auto">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newStatus.name}
                onChange={(e) =>
                  setNewStatus({ ...newStatus, name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name[0]}</p>
            )}

            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowColorPicker((prev) => !prev)}
                  className="w-10 h-10 rounded-full border shadow-inner"
                  style={{ backgroundColor: newStatus.color || "#e5e7eb" }}
                  title="Pick a color"
                ></button>

                {newStatus.color && (
                  <span className="text-sm text-gray-600">{newStatus.color}</span>
                )}
              </div>

              {showColorPicker && (
                <div className="absolute z-50 mt-2" ref={pickerRef}>
                  <ChromePicker
                    color={newStatus.color}
                    onChange={(color) =>
                      setNewStatus({ ...newStatus, color: color.hex })
                    }
                  />
                </div>
              )}
            </div>

            {formErrors.color && (
              <p className="text-red-500 text-xs mt-1">{formErrors.color[0]}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const result = statusSchema.safeParse(newStatus)
                  if (!result.success) {
                    const fieldErrors = result.error.flatten().fieldErrors
                    setFormErrors(fieldErrors)
                    return
                  }

                  console.log("Saved Status:", newStatus)
                  setShowModal(false)
                  setNewStatus({ name: "", color: "" })
                  setFormErrors({})
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="w-full bg-white shadow-md rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div
              className="text-gray-500 p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => setHideInactive((prev) => !prev)}
              title="Hide/Show columns"
            >
              {hideInactive ? <Eye size={20} className="text-blue-500" /> : <EyeOff size={20} />}
            </div>

            {hideInactive && (
              <div className="absolute z-10 top-48 bg-white border shadow-md rounded-lg p-4 w-60">
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
                      <Eye size={16} className="text-blue-500" />
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
                    {col.label}
                    <span className="inline-block ml-1">{getArrow(col.key)}</span>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {sortedData
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  {columns
                    .filter((col) => !hiddenColumns.includes(col.key))
                    .map((col) => (
                      <td key={col.key} className="p-3">
                        {col.key === "color" ? (
                          <div className={`w-4 h-4 rounded-full ${item[col.key]}`}></div>
                        ) : col.key === "action" ? (
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1 rounded-md"
                          >
                            Edit
                          </button>
                        ) : (
                          item[col.key]
                        )}
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>

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
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border hover:bg-gray-50 text-gray-700"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => i + 1).map(
              (page) => (
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
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(filteredData.length / itemsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
              className={`px-3 py-1 rounded ${
                currentPage === Math.ceil(filteredData.length / itemsPerPage)
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
