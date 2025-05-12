import { useState, useEffect, type FC } from "react";
import type { GraphNode } from "../types";

interface CardProps {
  selectedNode: GraphNode;
  setSelectedNode: (node: GraphNode | null) => void;
}

export const Card: FC<CardProps> = ({ selectedNode, setSelectedNode }) => {
  const { label, properties } = selectedNode;

  const [omdb, setOmdb] = useState<null | {
    imdbRating: number;
    plot: string;
    genre: string;
    year: string;
  }>(null);

  const [vote, setVote] = useState<number>(5);
  const [voteMessage, setVoteMessage] = useState<string | null>(null);


  useEffect(() => {
    setOmdb(null);
    setVote(5);
    setVoteMessage(null);
  }, [properties.title]);

  const handleOmdbFetch = async () => {
    try {
      const res = await fetch(`http://localhost:3000/graph/omdb?title=${encodeURIComponent(properties.title)}`);
      const data = await res.json();
      setOmdb(data);
    } catch (e) {
      setOmdb(null);
    }
  };

  const handleVote = async () => {
    if (vote < 1 || vote > 10) {
      setVoteMessage("Vote must be between 1 and 10");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/graph/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: properties.title, score: vote }),
      });

      const data = await res.json();
      setSelectedNode({
        ...selectedNode,
        properties: {
          ...selectedNode.properties,
          rating: data.rating,
          voteCount: data.voteCount,
        },
      });

      setVoteMessage(`Thanks for voting! New rating: ${data.rating?.toFixed(2)} (votes: ${data.voteCount})`);
    } catch (e) {
      setVoteMessage("Voting failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 1000,
        width: "300px",
        backgroundColor: "#1e1e1e",
        color: "white",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <h3>{properties?.title || properties?.name}</h3>

      {label === "Movie" && (
        <>
          <p>
            <strong>Year:</strong> {properties?.released?.low}
          </p>
          <p>
            <strong>Our Rating:</strong> {properties?.rating ?? "—"}
          </p>
          <p>
            <strong>Vote Count:</strong> {properties?.voteCount ?? 0}
          </p>

          <button onClick={handleOmdbFetch}>IMDb Info</button>

          {omdb && (
            <div style={{ marginTop: "10px", fontSize: "14px" }}>
              <p>
                <strong>IMDb Rating:</strong> {omdb.imdbRating}
              </p>
              <p>
                <strong>Genre:</strong> {omdb.genre}
              </p>
              <p>
                <strong>Year:</strong> {omdb.year}
              </p>
              <p>
                <strong>Plot:</strong> {omdb.plot}
              </p>
            </div>
          )}

          <div style={{ marginTop: "12px" }}>
            <label>
              Your vote:
              <input
                type="number"
                min={1}
                max={10}
                value={vote}
                onChange={(e) => setVote(Number(e.target.value))}
                style={{ width: "50px", marginLeft: "8px" }}
              />
            </label>
            <button onClick={handleVote} style={{ display: "block", marginTop: "8px", marginLeft: "120px" }}>
              Submit Vote
            </button>
            {voteMessage && <p style={{ color: "lightgreen", marginTop: "8px" }}>{voteMessage}</p>}
          </div>
        </>
      )}

      <button onClick={() => setSelectedNode(null)} style={{ marginTop: "16px" }}>
        Close
      </button>
    </div>
  );
};
