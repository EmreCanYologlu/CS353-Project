import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  initialQuery: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery, className }) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);

    if (query.trim()) {
      params.set('q', query);
    } else {
      params.delete('q');
    }

    params.set('page', '1'); // Reset to the first page on search
    navigate(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search..."
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
