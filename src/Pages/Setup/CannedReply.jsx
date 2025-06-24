import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { EyeOff, Plus, ArrowDownUp, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import dayjs from 'dayjs';
import SearchHeader from '../../Components/SearchHeader';

function CannedReply() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [hideInactive, setHideInactive] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const Timer = useRef(null);

  const cannedData = [
    {
      id: 1,
      title: 'General Question',
      description: 'WhatsMark helps you automate WhatsApp marketing and bulk messaging efficiently. Let us know what you’re looking for!',
      public: 'Public'
    },
    {
      id: 2,
      title: 'Feature Details',
      description: 'WhatsMark offers bulk messaging, scheduled campaigns, and automation tools. Would you like a demo or more details on a specific feature?',
      public: 'Public'
    },
  ];

  const { data: mess, refetch } = useQuery({
    queryKey: ['Mess'],
    queryFn: async () => {
      const response = await api.get('');
      return response.data;
    },
  });

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
    return sortDirection === 'asc' ? <ChevronUp size={15} /> : <ChevronDown  size={15}  />;
  };

  const filteredData = cannedData.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
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
    } else {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'TITLE', key: 'title' },
    { label: 'DESCRIPTION', key: 'description' },
    { label: 'PUBLIC', key: 'public' },
  ];

  const toggleColumn = (key) => {
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleEdit = (item) => {
    console.log('Edit clicked for:', item);
  };

  return (
    <div className="px-4 md:px-0 mt-9">
      <div className="max-w-full mx-auto flex justify-end items-center mt-10 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow">
            <Plus size={16} />
            New CannedReply
          </button>
        </div>
      </div>

      <div className="max-w-full mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative inline-block">
              <div
                className="bg-white text-gray-500 p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => setHideInactive((prev) => !prev)}
                title="Hide/Show columns"
              >
                {hideInactive ? (
                  <Eye size={20} className="text-blue-500" />
                ) : (
                  <EyeOff size={20} />
                )}
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
                        <Eye size={16} className="text-blue-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="ml-auto w-full sm:w-auto ">
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
                      {col.label}
                      <span className="inline-block ml-1">{getArrow(col.key)}</span>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  {columns
                    .filter((col) => !hiddenColumns.includes(col.key))
                    .map((col) => (
                      <td key={col.key} className="p-3">
                        {item[col.key]}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between mt-4">
            <div>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-3 py-2 text-sm text-gray-700"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border hover:bg-gray-50 text-gray-700'
                }`}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages || totalPages === 0
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

export default CannedReply;
