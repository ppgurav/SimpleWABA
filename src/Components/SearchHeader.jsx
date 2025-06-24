import React from 'react';

const SearchHeader = ({ search, handleSearch }) => {
  return (
    <div className="flex justify-end w-full">
      <input
        type="text"
        placeholder="Search..."
        className="border rounded px-2 py-2 w-full sm:w-40 md:w-64"
        value={search}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchHeader;
