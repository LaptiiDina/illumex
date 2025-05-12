
import React from 'react';
import type { GraphNode } from '../types'; 

type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  searchResults: GraphNode[]; 
  onSelectResult: (node: GraphNode) => void;
};

export const Search: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  searchResults,
  onSelectResult,
}) => {

  return (
    <div>
      <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <ul>
  {(searchResults || []).map((node) => (
    <li key={node.id} onClick={() => onSelectResult(node)}>
      {node.properties.title}
    </li>
  ))}
</ul>
    </div>
  );
};
