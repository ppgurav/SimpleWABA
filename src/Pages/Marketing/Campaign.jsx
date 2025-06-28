import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {  ArrowDownUp,  ChevronDown,  ChevronUp,  Eye,  EyeOff,  Funnel,} from 'lucide-react';

import SearchHeader from '../../Components/SearchHeader';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

function Campaign() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [hideInactive, setHideInactive] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const Timer = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const navigate = useNavigate();
  const campaigns = [
    {
      id: 1,
      campaignName: 'testing - corbital',
      template: 'whatsmark_youtube_video',
      relationType: 'Lead',
      total: 1,
      deleveredTo: 1,
      readBy: 1,
      createdAt: dayjs().subtract(2, 'hour').toISOString(),
    },
    {
      id: 2,
      campaignName: 'WTemplate',
      template: 'video',
      relationType: 'Lead',
      total: 46,
      deleveredTo: 46,
      readBy: 0,
      createdAt: dayjs().subtract(3, 'hour').toISOString(),
    },
  ];

  const { refetch } = useQuery({
    queryKey: ['Campaign'],
    queryFn: async () => {
      const response = await api.get('');
      return response.data;
    },
  });

  const handleSelectAll = () => {
    if (selectedIds.length === campaigns.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(campaigns.map((c) => c.id));
    }
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

  const toggleColumn = (key) => {
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const filteredCampaigns = campaigns.filter((item) =>
    [item.id.toString(), item.campaignName, item.template, item.relationType]
      .join(' ') // combine fields
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

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

  const paginatedCampaigns = sortedCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'CAMPAIGN_NAME', key: 'campaignName' },
    { label: 'TEMPLATE', key: 'template' },
    { label: 'RELATIONTYPE', key: 'relationType' },
    { label: 'TOTAL', key: 'total' },
    { label: 'DELEVEREDTO', key: 'deleveredTo' },
    { label: 'READBY', key: 'readBy' },
    { label: 'CREATEDAT', key: 'createdAt' },
  ];

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

  return (
    <>
 <div className="flex justify-start gap-2 mt-20">
              
              <button
                onClick={() => navigate("/campaign/create")}
                className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Create Campaign
              </button>
            </div>
    <div className="w-full mx-auto bg-white shadow-md rounded-xl p-4 md:p-10 mt-3">
      
      <div className="flex flex-wrap items-center gap-4 ">
        <div
          className="bg-white text-gray-500 p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => setHideInactive((prev) => !prev)}
          title="Hide/Show columns"
        >
          {hideInactive ? <Eye size={20} className="text-blue-500" /> : <EyeOff size={20} />}
        </div>
 
        {hideInactive && (
          <div className="absolute z-10 mt-24  w-56 bg-white border rounded-md shadow-lg p-2 top-[100px] sm:top-[120px]">
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
                  checked={selectedIds.length === campaigns.length}
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
                    {/* {col.label}
                    <span className="inline-block ml-1">{getArrow(col.key)}</span> */}
                      <div className="flex items-center gap-1">
                        {col.label} {getArrow(col.key)}
                      </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {paginatedCampaigns.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-2 md:p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id]
                      )
                    }
                  />
                </td>
                {!hiddenColumns.includes('id') && <td className="p-2 md:p-3">{item.id}</td>}
                {!hiddenColumns.includes('campaignName') && <td className="p-2 md:p-3">{item.campaignName}</td>}
                {!hiddenColumns.includes('template') && <td className="p-2 md:p-3">{item.template}</td>}
                {!hiddenColumns.includes('relationType') && (
                  <td className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-md min-w-[80px] md:mt-3 inline-block text-center">
                    {item.relationType}
                  </td>
                )}
                {!hiddenColumns.includes('total') && <td className="p-2 md:p-3">{item.total}</td>}
                {!hiddenColumns.includes('deleveredTo') && <td className="p-2 md:p-3">{item.deleveredTo}</td>}
                {!hiddenColumns.includes('readBy') && <td className="p-2 md:p-3">{item.readBy}</td>}
                {!hiddenColumns.includes('createdAt') && <td className="p-2 md:p-3">{dayjs(item.createdAt).fromNow()}</td>}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded p-1 text-sm"
            >
              {[3, 5, 10, 20].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border hover:bg-gray-50 text-gray-700'}`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${currentPage === page ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-50 text-gray-700'}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border hover:bg-gray-50 text-gray-700'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Campaign;