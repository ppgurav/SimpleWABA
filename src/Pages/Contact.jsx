import { useRef, useState, useEffect } from "react"
import {
  ArrowDownUp,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FileDown,
  FilterIcon as Funnel,
  Plus,
  PlusCircle,
  RefreshCcw,
  Upload,
} from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
const BASE_URL = import.meta.env.VITE_API_BASE_URL
dayjs.extend(relativeTime)

const SearchHeader = ({ search, handleSearch }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search contacts..."
        value={search}
        onChange={handleSearch}
        className="w-full pl-3 pr-10 py-2 border rounded-lg bg-opacity-75 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  )
}

function Contact() {
  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const timer = useRef(null)
  const exportButtonRef = useRef(null)
  const [showOptions, setShowOptions] = useState(false)
  const [showOptionss, setShowOptionss] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importType, setImportType] = useState("excel")
  const [selectedFile, setSelectedFile] = useState(null)
  const [createContactName, setCreateContactName] = useState("")
  const [createContactPhone, setCreateContactPhone] = useState("")
  const [createContactGroup, setCreateContactGroup] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const [showColumnOptions, setShowColumnOptions] = useState(false)
  const [hiddenColumns, setHiddenColumns] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [contacts, setContacts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [fields, setFields] = useState([])

  const fetchContacts = async () => {
    setIsLoading(true)
    setError(null)

    const wabaId = sessionStorage.getItem("waba_id")
    const accessToken = sessionStorage.getItem("auth_token")

    if (!wabaId || !accessToken) {
      console.error("Missing waba_id or auth_token in sessionStorage")
      throw new Error("Missing authentication data")
    }

    try {
      // const response = await fetch(`http://localhost:3001/api/contacts`, {
        const response = await fetch(`${BASE_URL}/api/contacts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const transformedData = data.data.map((user) => ({
        id: user.id,
        name: user.name,
        group: user.group_id,
        tag: user.tags,
        phone: user.mobile,
        type: ["Lead"],
        assigned: "Not assigned",
        status: "Connected",
        source: "web",
        active: true,
        createdAt: user.created_ts,
      }))

      setContacts(transformedData)
    } catch (err) {
      console.error("Error fetching contacts:", err)
      setError(err.message)
      toast.error("Failed to fetch contacts")
    } finally {
      setIsLoading(false)
    }
  }

  // Export function to handle file downloads
  const handleExport = async (format) => {
    setIsExporting(true)
    const accessToken = sessionStorage.getItem("auth_token")

    if (!accessToken) {
      toast.error("Authentication token not found. Please login again.")
      setIsExporting(false)
      return
    }

    try {
      const response = await fetch(`${BASE_URL}/api/contacts/export`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`)
      }

      // Get the filename from the response headers or use a default
      const contentDisposition = response.headers.get("Content-Disposition")
      let filename = `contacts.${format === "excel" ? "xlsx" : "csv"}`

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success(`Contacts exported successfully as ${format.toUpperCase()}`)
      setShowOptionss(false)
    } catch (error) {
      console.error("Export error:", error)
      toast.error(`Failed to export contacts: ${error.message}`)
    } finally {
      setIsExporting(false)
    }
  }

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts()
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (exportButtonRef.current && !exportButtonRef.current.contains(event.target) && showOptionss) {
        setShowOptionss(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showOptionss])

  const createContact = async () => {
    // Validate required fields
    if (!createContactName.trim()) {
      toast.error("Name is required")
      return
    }

    if (!createContactPhone.trim()) {
      toast.error("Phone number is required")
      return
    }

    const accessToken = sessionStorage.getItem("auth_token")

    if (!accessToken) {
      toast.error("Authentication token not found. Please login again.")
      return
    }

    try {
      const response = await fetch(`${BASE_URL}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: createContactName.trim(),
          mobile: createContactPhone.trim(),
          group_id: createContactGroup || null, // Send null if no group selected
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to create contact: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast.success(result.message || "Contact created successfully")
        setShowModal(false)
        // Reset form fields
        setCreateContactName("")
        setCreateContactPhone("")
        setCreateContactGroup("")
        setFields([]) // Clear additional fields
        fetchContacts() // Refresh the contacts list
      } else {
        toast.error(result.message || "Failed to create contact")
      }
    } catch (error) {
      console.error("Create contact error:", error)
      toast.error(`Failed to create contact: ${error.message}`)
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.length === contacts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(contacts.map((c) => c.id))
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {}, 370)
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

  // Sort contacts based on current sort settings
  const sortedContacts = [...contacts].sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]

    if (Array.isArray(aVal)) {
      aVal = aVal.join(", ")
      bVal = bVal.join(", ")
    }

    if (new Date(aVal).toString() !== "Invalid Date" && new Date(bVal).toString() !== "Invalid Date") {
      aVal = new Date(aVal).valueOf()
      bVal = new Date(bVal).valueOf()
    }

    if (typeof aVal === "string") {
      return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    } else {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal
    }
  })

  const columns = [
    { label: "ID", key: "id" },
    { label: "NAME", key: "name" },
    { label: "Group", key: "group" },
    { label: "PHONE", key: "phone" },
    { label: "Tags", key: "tag" },
    { label: "Type", key: "type" },
    { label: "STATUS", key: "status" },
    { label: "Assigned", key: "assigned" },
    { label: "SOURCE", key: "source" },
    { label: "ACTIVE", key: "active" },
    { label: "CREATED AT", key: "createdAt" },
  ]

  const toggleColumn = (key) => {
    setHiddenColumns((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const addField = () => {
    setFields([...fields, { name: "", type: "text", value: "" }])
  }

  const handleFieldChange = (index, key, newValue) => {
    const updatedFields = [...fields]
    updatedFields[index][key] = newValue
    setFields(updatedFields)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first")
      return
    }

    const accessToken = sessionStorage.getItem("auth_token")
    if (!accessToken) {
      toast.error("Authentication token not found. Please login again.")
      return
    }

    // Create FormData for file upload
    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch(`${BASE_URL}/api/contacts/import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Import failed: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast.success(result.message || `Successfully imported ${selectedFile.name}`)
        setShowImportModal(false)
        setSelectedFile(null)
        // Refresh the contacts list to show imported contacts
        fetchContacts()
      } else {
        toast.error(result.message || "Import failed")
      }
    } catch (error) {
      console.error("Import error:", error)
      toast.error(`Failed to import contacts: ${error.message}`)
    }
  }

  // Filter contacts based on search
  const filteredContacts = sortedContacts.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) || (item.phone && item.phone.toString().includes(search)),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage)
  const paginatedContacts = filteredContacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Function to refetch contacts

  return (
    <>
      {/* Header with action buttons */}
      <div className="w-full px-4 sm:px-1 lg:px-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-16 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow transition-colors"
            title="Create"
          >
            <PlusCircle size={19} />
            <span className="hidden sm:inline">Create Contact</span>
            <span className="inline sm:hidden">Create</span>
          </button>
          <button
            onClick={() => {
              console.log("Refresh clicked")
              fetchContacts()
            }}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow transition-colors"
            title="Refresh"
          >
            <RefreshCcw size={15} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        <div className="flex flex-row flex-wrap items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow transition-colors"
            title="Import"
          >
            <Upload size={15} />
            <span>Import</span>
          </button>

          <div className="relative" ref={exportButtonRef}>
            <button
              onClick={() => setShowOptionss(!showOptionss)}
              disabled={isExporting}
              className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg border text-white shadow transition-colors ${
                isExporting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              title="Export"
            >
              <FileDown size={15} />
              <span>{isExporting ? "Exporting..." : "Export"}</span>
            </button>

            {showOptionss && !isExporting && (
              <div className="absolute right-0 top-full mt-1 z-10 bg-white border rounded shadow-md w-40">
                <button
                  onClick={() => handleExport("excel")}
                  className="w-full text-left px-6 py-2 hover:bg-gray-100 transition-colors"
                >
                  Excel
                </button>
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full text-left px-6 py-2 hover:bg-gray-100 transition-colors"
                >
                  CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-4 md:p-6 mt-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex gap-2">
            <button
              className="bg-white text-gray-500 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
              title="Download"
            >
              <FileDown size={20} />
            </button>

            <button
              className={`bg-white p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                showColumnOptions ? "text-indigo-600" : "text-gray-500"
              }`}
              onClick={() => setShowColumnOptions((prev) => !prev)}
              title="Hide/Show Columns"
            >
              {showColumnOptions ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>

            <button
              className="bg-white text-gray-500 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
              title="Filter"
            >
              <Funnel size={20} />
            </button>
          </div>
          <div className="w-full mt-3 sm:mt-0 sm:w-auto sm:ml-auto">
            <SearchHeader search={search} handleSearch={handleSearch} />
          </div>
        </div>
        {/* Column visibility dropdown */}
        {showColumnOptions && (
          <div className="absolute z-10 mt-24 w-56 bg-white border rounded-md shadow-lg p-2 top-[180px] sm:top-[120px]">
            <div className="p-2 font-medium border-b">Toggle Columns</div>
            {columns.map((col) => (
              <div key={col.key} className="flex items-center p-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  id={`col-${col.key}`}
                  checked={!hiddenColumns.includes(col.key)}
                  onChange={() => toggleColumn(col.key)}
                  className="mr-2"
                />
                <label htmlFor={`col-${col.key}`} className="cursor-pointer select-none">
                  {col.label}
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 table-auto border-collapse text-xs md:text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 md:p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === contacts.length && contacts.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    {columns
                      .filter((col) => !hiddenColumns.includes(col.key))
                      .map((col) => (
                        <th
                          key={col.key}
                          className="p-2 md:p-3 cursor-pointer select-none whitespace-nowrap"
                          onClick={() => handleSort(col.key)}
                        >
                          <div className="flex items-center gap-1">
                            {col.label} {getArrow(col.key)}
                          </div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedContacts.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-2 md:p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() =>
                            setSelectedIds((prev) =>
                              prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
                            )
                          }
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      {columns
                        .filter((col) => !hiddenColumns.includes(col.key))
                        .map((col) => (
                          <td key={col.key} className="p-2 md:p-3 whitespace-nowrap">
                            {col.key === "type" ? (
                              <span className="capitalize">{item[col.key].join(", ")}</span>
                            ) : col.key === "active" ? (
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.active}
                                  onChange={() =>
                                    setContacts((prev) =>
                                      prev.map((c) => (c.id === item.id ? { ...c, active: !c.active } : c)),
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:rounded-full after:bg-white after:border after:transition-all peer-checked:after:translate-x-full"></div>
                              </label>
                            ) : col.key === "status" ? (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-md inline-block text-center min-w-[60px] sm:min-w-[80px]">
                                {item.status}
                              </span>
                            ) : col.key === "createdAt" ? (
                              dayjs(item.createdAt).fromNow()
                            ) : (
                              item[col.key]
                            )}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Show</span>
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
              <option value={20}>50</option>
              <option value={20}>200</option>
              <option value={20}>500</option>
              <option value={20}>1000</option>
            </select>
            <span className="text-sm text-gray-500">entries</span>
          </div>

          <div className="flex flex-wrap gap-1 w-full sm:w-auto justify-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border hover:bg-gray-50 text-gray-700 transition-colors"
              }`}
            >
              Previous
            </button>

            {(() => {
              const maxVisiblePages = 5
              const halfVisible = Math.floor(maxVisiblePages / 2)

              let startPage = Math.max(1, currentPage - halfVisible)
              const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

              // Adjust start page if we're near the end
              if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1)
              }

              const pages = []

              // Add first page and ellipsis if needed
              if (startPage > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm bg-white border hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    1
                  </button>,
                )

                if (startPage > 2) {
                  pages.push(
                    <span key="start-ellipsis" className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500">
                      ...
                    </span>,
                  )
                }
              }

              // Add visible page numbers
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                      currentPage === i
                        ? "bg-indigo-600 text-white"
                        : "bg-white border hover:bg-gray-50 text-gray-700 transition-colors"
                    }`}
                  >
                    {i}
                  </button>,
                )
              }

              // Add ellipsis and last page if needed
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(
                    <span key="end-ellipsis" className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500">
                      ...
                    </span>,
                  )
                }

                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm bg-white border hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    {totalPages}
                  </button>,
                )
              }

              return pages
            })()}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border hover:bg-gray-50 text-gray-700 transition-colors"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add New Contact</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-sm">Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={createContactName}
                  onChange={(e) => setCreateContactName(e.target.value)}
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-sm">Phone</label>
                <input
                  type="tel"
                  placeholder="Enter Phone number"
                  value={createContactPhone}
                  onChange={(e) => setCreateContactPhone(e.target.value)}
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Group & Segments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-sm">Group</label>
                <select
                  value={createContactGroup}
                  onChange={(e) => setCreateContactGroup(e.target.value)}
                  className="p-2 border border-gray-200 text-sm rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Group</option>
                  <option value="1">Apple</option>
                  <option value="2">Banana</option>
                  <option value="3">Cherry</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-sm">Segments/Tags</label>
                <select className="p-2 border border-gray-200 text-sm rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">Select Segments</option>
                  <option value="apple">Apple</option>
                  <option value="banana">Banana</option>
                  <option value="cherry">Cherry</option>
                </select>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="mt-6">
              <h2 className="font-semibold">Additional Fields</h2>
              <p className="text-sm text-gray-400">Add custom fields to store more information</p>

              <button
                className="bg-gray-200 w-full mt-5 p-2 flex justify-center items-center gap-2 rounded hover:bg-gray-300 transition-colors"
                onClick={addField}
              >
                <Plus size={16} />
                Add Field
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={index} className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1 font-semibold">Name</label>
                  <input
                    className="p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Name"
                    value={field.name}
                    onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1 font-semibold">Type</label>
                  <select
                    className="p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={field.type}
                    onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="date">Date</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1 font-semibold">Value</label>
                  <input
                    className="p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Enter ${field.type}`}
                    value={field.value}
                    type={field.type}
                    onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                  />
                </div>

                {/* Remove button in its own column */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => {
                      const updatedFields = fields.filter((_, i) => i !== index)
                      setFields(updatedFields)
                    }}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title="Remove Field"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 text-sm rounded border hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createContact}
                className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Create Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Import Contacts</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Select file format:</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="importType"
                    value="excel"
                    checked={importType === "excel"}
                    onChange={() => setImportType("excel")}
                    className="mr-2"
                  />
                  Excel (.xlsx)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="importType"
                    value="csv"
                    checked={importType === "csv"}
                    onChange={() => setImportType("csv")}
                    className="mr-2"
                  />
                  CSV (.csv)
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-xs text-red-500 mt-2 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Drag and drop your file here, or</p>
                    <label className="mt-2 inline-block cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                      <span>Browse files</span>
                      <input
                        type="file"
                        className="hidden"
                        accept={importType === "excel" ? ".xlsx, .xls" : ".csv"}
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {importType === "excel" ? "Supported formats: .xlsx, .xls" : "Supported format: .csv"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => {
                  console.log("Download template")
                }}
                className="px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800 text-center sm:text-left transition-colors"
              >
                Download Template
              </button>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-3 py-2 text-sm rounded border hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!selectedFile}
                  className={`px-3 py-2 text-sm rounded text-white ${
                    selectedFile ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-400 cursor-not-allowed"
                  } transition-colors`}
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Contact
