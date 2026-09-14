import { useEffect, useState } from "react";
import { apiRequest } from "../api";

const REQUEST_LIMIT = 50;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const allProjects = [];
        const seenProjectIds = new Set();

        let offset = 0;
        let hasMore = true;

        while (hasMore) {
          setLoadingMessage(
            `Loading projects... ${seenProjectIds.size} loaded`
          );

          const data = await apiRequest(
            `/v1/projects?limit=${REQUEST_LIMIT}&offset=${offset}`
          );

          const results = data.results || [];

          // Add only unique projects
          results.forEach((project) => {
            if (
              project.project_id &&
              !seenProjectIds.has(project.project_id)
            ) {
              seenProjectIds.add(project.project_id);
              allProjects.push(project);
            }
          });

          // Stop if nothing was returned
          if (results.length === 0) {
            break;
          }

          // API pagination works with offsets of 50
          offset += results.length;

          hasMore = Boolean(data.has_more);

          // Safety check
          if (offset > 1000) {
            break;
          }
        }

        setProjects(allProjects);
      } catch (err) {
        setError(err.message || "Could not load projects");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return "N/A";
    }

    const value = Number(price);

    if (Number.isNaN(value)) {
      return "N/A";
    }

    // Project price units still need verification,
    // so we don't incorrectly label them as lakh/crore.
    return `₹${value}`;
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Loading Bangalore projects...</h2>
        <p>{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Could not load projects</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Residential Projects</h1>
          <p>
            {projects.length.toLocaleString()} unique projects loaded
          </p>
        </div>
      </div>

      <div className="listing-grid">
        {projects.map((project) => (
          <div
            className="property-card"
            key={project.project_id}
          >
            <div className="property-image">🏢</div>

            <div className="property-content">
              <div className="property-top">
                <span className="badge">
                  {project.project_status || "Project"}
                </span>
              </div>

              <h3>
                {project.apartment_name || "Unnamed Project"}
              </h3>

              <p className="locality">
                📍 {project.locality || "Location unavailable"}
              </p>

              <p>
                <strong>Developer:</strong>{" "}
                {project.developer_name || "N/A"}
              </p>

              <div className="property-info">
                <span>
                  {Number(project.min_area_sqft).toLocaleString("en-IN")}
                  {" – "}
                  {Number(project.max_area_sqft).toLocaleString("en-IN")} sqft
                </span>
              </div>

              <h2>
                {formatPrice(project.price_min)}
                {" – "}
                {formatPrice(project.price_max)}
              </h2>

              <p>
                {project.total_units ?? "N/A"} units ·{" "}
                {project.total_towers ?? "N/A"} towers
              </p>

              <p>
                Listings reported:{" "}
                {project.total_listings ?? "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          No projects found.
        </div>
      )}
    </div>
  );
}