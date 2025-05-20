import React, { useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Card } from './Card';
import type { GraphData, GraphNode, Link } from '../types';


type Props = {
  searchResults: GraphData|null; 
};

const GraphViewer: React.FC<Props> = ({ searchResults }) => {
  const [fullGraphData, setFullGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [error, setError] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/graph')
      .then((res) => res.json())
      .then((data) => setFullGraphData(data))
      .catch((e) => setError(e.message));
  }, []);


  return (
    <div style={{ display: 'flex', justifyContent: 'end' }}>
      {!error ? (
        <>
        <div>
          <ForceGraph2D
            graphData={searchResults || fullGraphData}
            nodeLabel={(node: GraphNode) => node.properties?.title || node.properties?.name}
            nodeAutoColorBy="label"
            linkLabel={(link: Link) => link.type}
            nodeRelSize={8}
            onNodeClick={(node: any) => {
              setSelectedNode(node);
            }}
          />
</div>
          {selectedNode && (
            <Card
            setSelectedNode={setSelectedNode}
            selectedNode={selectedNode}
            />
          )}
        </>
      ) : null}
    </div>
  );
};

export default GraphViewer;
