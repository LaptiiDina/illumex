
import React from 'react';


type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void; 
};

export const Search: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
}) => {

  return (
    <div>
      <input title='' placeholder="movie" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};
