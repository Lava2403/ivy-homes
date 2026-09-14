import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Favourites from "./pages/Favourites";
import Rentals from "./pages/Rentals";
import Projects from "./pages/Projects";
import Insights from "./pages/Insights";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loader">Loading...</div>;

  return user ? children : <Navigate to="/" />;
}

function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/listings"
            element={
              <ProtectedRoute>
                <Listings />
              </ProtectedRoute>
            }
          />

          <Route
  path="/listings/:id"
  element={
    <ProtectedRoute>
      <ListingDetail />
    </ProtectedRoute>
  }
/>

          <Route
            path="/favourites"
            element={
              <ProtectedRoute>
                <Favourites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rentals"
            element={
              <ProtectedRoute>
                <Rentals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />

          
        </Routes>
      </main>
    </>
  );
}

export default App;