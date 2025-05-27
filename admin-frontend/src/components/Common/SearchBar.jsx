import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-est-blue"
      />
    </form>
  );
};

export default SearchBar;