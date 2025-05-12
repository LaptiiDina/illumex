Illumex Project

## 🚀 How to Run the Project

Follow these steps to run the fullstack project locally:

1. **Clone the repository:**

```bash
git clone https://github.com/LaptiiDina/illumex.git
cd illumex

Install and run the frontend:

cd client
npm install
npm run dev

Install and run the backend:
cd ../server
npm install
npm run start:dev


## 🧠 Client Overview

The frontend is built with **React** and **TypeScript**, using **Vite** as the build tool. It includes a simple, interactive visualization of a graph (movies and people), powered by `react-force-graph-2d`.

### 📁 Project Structure
client/
├── src/
│ ├── components/
│ │ ├── Card.tsx # Displays movie/person info, allows voting and IMDb fetch
│ │ ├── GraphViewer.tsx # Visualizes graph using ForceGraph2D
│ │ └── Search.tsx # Allows searching for movies
│ ├── tests/
│ │ ├── Card.test.tsx # Unit test for Card component
│ │ └── Search.test.tsx # Unit test for Search component
│ ├── App.tsx # Main app logic and routing of components
│ ├── main.tsx # Entry point
│ ├── types.ts # Shared types (GraphNode, GraphData, etc.)

### ✨ Features

- **Search functionality** for movies by title.
- **Graph visualization** of people and movies with dynamic layout.
- **Details card**:
  - Displays title, release year, internal rating and vote count.
  - Allows voting with instant UI feedback.
  - Fetches additional movie data (IMDb rating, plot, genre) from the backend.
- **Tests** using `@testing-library/react` and `vitest`.



## 🧩 Backend Overview

The backend is built using **NestJS** and connects to a **Neo4j** graph database.

### 🧱 Project Structure
server/
├── src/
│ ├── graph/
│ │ ├── graph.controller.ts # Defines all API routes
│ │ ├── graph.module.ts # Encapsulates graph logic
│ │ ├── graph.service.ts # Handles business logic, DB queries, OMDb API calls
│ │ └── graph.service.spec.ts # Unit tests
│ ├── neo4j/
│ │ └── neo4j.module.ts # Neo4j driver configuration and injection
│ ├── app.module.ts # Root module
│ └── main.ts # Bootstrap entry

### ⚙️ Features

- Exposes a RESTful API under `/graph`.
- Communicates with a Neo4j instance to:
  - Retrieve a full people–movie graph (`GET /graph`)
  - Search for movies by title (`GET /graph/search`)
  - Fetch additional data from the **OMDb API** (`GET /graph/omdb?title=...`)
  - Accept and update custom user ratings (`POST /graph/vote`)
- Ratings are stored and averaged server-side using Neo4j.

### 🛠 Technologies
Backend
- **NestJS** – for structured server-side logic.
- **Neo4j** – as the graph database.
- **Axios** – to fetch data from the [OMDb API](http://www.omdbapi.com/).
- **Jest** – for unit testing (`graph.service.spec.ts`).

Frontend
- **React** – for building the UI.
- **react-force-graph-2d** – for rendering interactive force-directed graph visualizations.
- **TypeScript** – for static typing.
- **Vitest + Testing Library** – for component testing (`Card`, `Search`).
