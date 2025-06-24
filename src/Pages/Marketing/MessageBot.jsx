import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import SearchHeader from '../../Components/SearchHeader';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ArrowDownUp, ChevronDown, ChevronUp, FileDown, Funnel } from 'lucide-react';

// Extend dayjs with relativeTime
dayjs.extend(relativeTime);

function MessageBot() {
  const [messBot, setMessBot] = useState(['']);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const Timer = useRef(null);

  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const [temp, setTemp] = useState([
    {
      id: 1,
      name: 'Welcome Template',
      type: ['en'],
      tiggerKeyword: 'SaaS',
      relationType: 'Lead',
      active: true,
      createdAt: dayjs().subtract(2, 'week').toISOString()
    },
    {
      id: 2,
      name: 'Import large leads',
      type: ['On exact match'],
      tiggerKeyword: 'send_bulk_campaings_demo',
      relationType: 'Lead',
      active: true,
      createdAt: dayjs().subtract(1, 'week').toISOString()
    },
    {
      id: 3,
      name: 'Import large leads',
      type: ['On exact match'],
      tiggerKeyword: 'import_large_leads_demo',
      relationType: 'Lead',
      active: true,
      createdAt: dayjs().subtract(2, 'weeks').toISOString()
    },
    {
      id: 4,
      name: 'Welcome Template',
      type: ['On exact match'],
      tiggerKeyword: 'SaaS',
      relationType: 'Lead',
      active: true,
      createdAt: dayjs().subtract(2, 'weeks').toISOString()
    },
    {
      id: 5,
      name: 'Welcome Template',
      type: ['en'],
      tiggerKeyword: 'SaaS',
      relationType: 'Lead',
      active: true,
      createdAt: dayjs().subtract(2, 'weeks').toISOString()
    },
  ]);

  const { data: mess, refetch } = useQuery({
    queryKey: ["Mess"],
    queryFn: async () => {
      const response = await api.get(``);
      return response.data;
    },
  });

  const handleSelectAll = () => {
    if (selectedIds.length === messBot.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(messBot.map((c) => c.id));
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
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'NAME', key: 'name' },
    { label: 'TYPE', key: 'type' },
    { label: 'TIGGERKEYWORD', key: 'tiggerKeyword' },
    { label: 'RELATION', key: 'relationType' },
    { label: 'ACTIVE', key: 'active' },
    { label: 'CREATEDAT', key: 'createdAt' },
  ];

  const filteredData = sortedTemp.filter(
    (item) =>
      item.id.toString().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.type.join(', ').toLowerCase().includes(search.toLowerCase()) ||
      item.tiggerKeyword.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="w-full mx-auto bg-white shadow-md rounded-xl p-6 md:p-10 mt-20">
      <div className="flex items-center gap-4">
        <div className="bg-white text-gray-500 p-2 border rounded-lg">
          <FileDown size={20} />
        </div>
        <div className="bg-white text-gray-500 p-2 border rounded-lg">
          <Funnel size={20} />
        </div>
        <div className="ml-auto w-full sm:w-auto">
            <SearchHeader search={search} handleSearch={handleSearch} />
          </div>

        
      </div>

      <div className='overflow-x-auto mt-6'>
        <table className="w-full table-auto border-collapse text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 md:p-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === messBot.length}
                  onChange={handleSelectAll}
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-2 md:p-3 cursor-pointer select-none"
                  onClick={() => handleSort(col.key)}
                >
                  {/* {col.label}
                  <span className='inline-block ml-1'>{getArrow(col.key)}</span> */}
                      <div className="flex items-center gap-1">
                        {col.label} {getArrow(col.key)}
                      </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className='border-b hover:bg-gray-50'>
                <td className='p-2 md:p-3'>
                  <input
                    type='checkbox'
                    checked={selectedIds.includes(item.id)}
                    onClick={() => {
                      setSelectedIds((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id]
                      );
                    }}
                  />
                </td>
                <td className="p-2 md:p-3">{item.id}</td>
                <td className="p-2 md:p-3">{item.name}</td>
                <td className="p-2 md:p-3">{item.type.join(', ')}</td>
                <td className="p-2 md:p-3">{item.tiggerKeyword}</td>
                <td className="bg-purple-100 text-purple-800 text-xs mt-4 font-medium px-2 py-1 rounded-md min-w-[80px] inline-block text-center">
                  {item.relationType}
                </td>
                <td className="p-2 md:p-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={() => {
                        const updated = temp.map((c) =>
                          c.id === item.id ? { ...c, active: !c.active } : c
                        );
                        setTemp(updated);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                <td className="p-2 md:p-3">{dayjs(item.createdAt).fromNow()}</td>
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
              {[3, 5, 10, 20].map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border hover:bg-gray-50 text-gray-700"}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBot;