import React, { useRef, useState } from 'react';
import SearchHeader from '../../Components/SearchHeader';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ArrowDownUp, ChevronDown, ChevronUp, FileDown, Funnel } from 'lucide-react';

dayjs.extend(relativeTime);

function TemplateBot() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const Timer = useRef(null);

  const [temp, setTemp] = useState([
    {
      id: 1,
      name: 'Template message 1',
      type: ['On exact match'],
      triggerKeyword: 'hello world',
      relationType: 'Lead',
      active: true,
      createdAt: dayjs().subtract(2, 'hour').toISOString(),
    },
    {
      id: 2,
      name: 'Message 1',
      type: ['Sport'],
      triggerKeyword: 'mmm',
      relationType: 'Lead',
      active: true,
      createdAt: dayjs().subtract(2, 'hour').toISOString(),
    },
  ]);

  const { data: temps, refetch } = useQuery({
    queryKey: ['Temp'],
    queryFn: async () => {
      const response = await api.get('');
      return response.data;
    },
  });

  const handleSelectAll = () => {
    if (selectedIds.length === temp.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(temp.map((item) => item.id));
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
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Type', key: 'type' },
    { label: 'Trigger Keyword', key: 'triggerKeyword' },
    { label: 'Relation', key: 'relationType' },
    { label: 'Active', key: 'active' },
    { label: 'Created At', key: 'createdAt' },
  ];

  const filteredTemp = sortedTemp.filter((item) =>
    [item.id.toString(), item.name, item.type.join(', '), item.triggerKeyword]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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

      <div className="overflow-x-auto mt-6">
        <table className="w-full table-auto border-collapse text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 md:p-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === temp.length}
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
                  <span className="inline-block ml-1">{getArrow(col.key)}</span> */}
                      <div className="flex items-center gap-1">
                        {col.label} {getArrow(col.key)}
                      </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredTemp
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => {
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
                  <td className="p-2 md:p-3">{item.triggerKeyword}</td>
                  <td className="p-2 md:p-3">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-md inline-block text-center">
                      {item.relationType}
                    </span>
                  </td>
                  <td className="p-2 md:p-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={() =>
                          setTemp((prev) =>
                            prev.map((c) =>
                              c.id === item.id ? { ...c, active: !c.active } : c
                            )
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </td>
                  <td className="p-2 md:p-3">{dayjs(item.createdAt).fromNow()}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
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
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border hover:bg-gray-50 text-gray-700'
              }`}
            >
              Previous
            </button>
            {Array.from(
              { length: Math.ceil(filteredTemp.length / itemsPerPage) },
              (_, i) => i + 1
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
                  Math.min(prev + 1, Math.ceil(filteredTemp.length / itemsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(filteredTemp.length / itemsPerPage)}
              className={`px-3 py-1 rounded ${
                currentPage === Math.ceil(filteredTemp.length / itemsPerPage)
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
  );
}

export default TemplateBot;
