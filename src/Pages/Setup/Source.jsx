import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {  ArrowDownUp,  ChevronDown,  ChevronUp,  Plus,  EyeOff, Eye, RefreshCcw,} from 'lucide-react';
import dayjs from 'dayjs';
import { z } from 'zod';
import SearchHeader from '../../Components/SearchHeader';

function Source() {
  const [messBot, setMessBot] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [hideInactive, setHideInactive] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState({ name: '' });
  const [formErrors, setFormErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const Timer = useRef(null);

  const statusSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
  });

  const temp = [
    { id: 1, name: 'New', action: 'Edit' },
    { id: 2, name: 'In progress', action: 'Edit' },
    { id: 3, name: 'Qualified', action: 'Edit' },
    { id: 4, name: 'Contacted', action: 'Edit' },
    { id: 5, name: 'Closed', action: 'Edit' },
  ];

  const { data: mess, refetch } = useQuery({
    queryKey: ['Mess'],
    queryFn: async () => {
      const response = await api.get('');
      return response.data;
    },
  });

  const handleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === messBot.length ? [] : messBot.map((c) => c.id),
    );
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
    if (sortBy !== column) return <ArrowDownUp size={15} />
    return sortDirection === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />
  }

  const sortedTemp = [...temp].sort((a, b) => {
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
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'NAME', key: 'name' },
    { label: 'ACTION', key: 'action' },
  ];

  const toggleColumn = (key) => {
    setHiddenColumns((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key],
    );
  };

  const handleEdit = (item) => {
    console.log('Edit clicked for:', item);
  };

  return (
    <div className="px-1 md:px-1 mt-14">
      {/* Header Buttons */}
      <div className="max-w-full mx-auto flex justify-between items-center mt-10 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} />
            New Source
          </button>
          <button
            onClick={() => console.log('Refresh clicked')}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-indigo-600 hover:bg-indigo-700 text-white shadow"
          >
            <RefreshCcw size={15} />
            Refresh
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-7 rounded-xl shadow-lg max-w-md w-full">
            <h1 className="text-lg font-semibold">Status</h1>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-7">
                Name
              </label>
              <input
                value={newStatus.name}
                onChange={(e) =>
                  setNewStatus({ ...newStatus, name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.name[0]}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const result = statusSchema.safeParse(newStatus);
                  if (!result.success) {
                    setFormErrors(result.error.flatten().fieldErrors);
                    return;
                  }
                  console.log('Saved Status:', newStatus);
                  setShowModal(false);
                  setNewStatus({ name: '' });
                  setFormErrors({});
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className="w-full bg-white shadow-md rounded-xl p-4 overflow-x-auto">
        {/* Column Toggles and Search */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 relative">
            <button
              className="bg-white text-gray-500 p-2 border rounded-lg hover:bg-gray-100"
              onClick={() => setHideInactive((prev) => !prev)}
              title="Hide/Show columns"
            >
              {hideInactive ? <Eye className="text-blue-500" /> : <EyeOff size={20} />}
            </button>

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

        {/* Table */}
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
                      {col.label}
                      <span className="inline-block ml-1 ">{getArrow(col.key)}</span>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {sortedTemp
                .filter(
                  (item) =>
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.action.toString().includes(search),
                )
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    {columns
                      .filter((col) => !hiddenColumns.includes(col.key))
                      .map((col) => (
                        <td key={col.key} className="p-3">
                          {col.key === 'action' ? (
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
          <div className="flex justify-between items-center mt-4">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded p-1 text-sm"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>

            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border hover:bg-gray-50 text-gray-700'
                }`}
              >
                Previous
              </button>

              {Array.from(
                {
                  length: Math.ceil(
                    sortedTemp.filter(
                      (item) =>
                        item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.action.toString().includes(search),
                    ).length / itemsPerPage,
                  ),
                },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(
                        sortedTemp.filter(
                          (item) =>
                            item.name.toLowerCase().includes(search.toLowerCase()) ||
                            item.action.toString().includes(search),
                        ).length / itemsPerPage,
                      ),
                    ),
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(
                    sortedTemp.filter(
                      (item) =>
                        item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.action.toString().includes(search),
                    ).length / itemsPerPage
                  )
                }
                className={`px-3 py-1 rounded ${
                  currentPage ===
                  Math.ceil(
                    sortedTemp.filter(
                      (item) =>
                        item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.action.toString().includes(search),
                    ).length / itemsPerPage
                  )
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border hover:bg-gray-50 text-gray-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Source;