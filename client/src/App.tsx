import { useState } from 'react';
import './App.css';
import GraphViewer from './components/GraphViewer';
import { Search } from './components/Search';
import type { GraphNode, GraphData } from './types';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const res = await fetch(`http://localhost:3000/graph/search?title=${encodeURIComponent(searchTerm)}`);
      const results = await res.json();
      setSearchResults(results);
    } catch (e) {
      console.error('Error', e);
    }
  };

  return (
    <>
      <h2>Neo4j Graph Viewer</h2>
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        onSelectResult={(node) => {
          setSelectedNode(node);
          setSearchResults(null);
          setSearchTerm('');
        } } searchResults={[]}      />
      <GraphViewer
        searchResults={searchResults}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
    </>
  );
}

export default App;
