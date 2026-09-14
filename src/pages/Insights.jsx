import { useEffect, useState } from "react";
import { apiRequest } from "../api";

const LIMIT = 50;

export default function Insights() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    listings: 0,
    rentals: 0,
    projects: 0,
    avgPrice: 0,
    verified: 0,
    live: 0,
  });

  async function fetchAll(endpoint) {
    let allData = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const data = await apiRequest(
        `${endpoint}?limit=${LIMIT}&offset=${offset}`
      );

      const results = data.results || [];

      allData = [...allData, ...results];

      hasMore = Boolean(data.has_more) && results.length > 0;
      offset += results.length;

      if (results.length === 0) break;
    }

    return allData;
  }

  useEffect(() => {
    async function loadInsights() {
      try {
        setLoading(true);
        setError("");

        const [listings, rentals, projects] = await Promise.all([
          fetchAll("/v1/listings"),
          fetchAll("/v1/rentals"),
          fetchAll("/v1/projects"),
        ]);

        const uniqueListings = Array.from(
          new Map(
            listings.map((item) => [item.listing_id, item])
          ).values()
        );

        const uniqueRentals = Array.from(
          new Map(
            rentals.map((item) => [item.listing_id, item])
          ).values()
        );

        const uniqueProjects = Array.from(
          new Map(
            projects.map((item) => [item.project_id, item])
          ).values()
        );

        const verified = uniqueListings.filter(
          (listing) => listing.is_verified
        ).length;

        const live = uniqueListings.filter(
          (listing) => listing.is_live
        ).length;

        const validPrices = uniqueListings
          .map((listing) => Number(listing.price))
          .filter((price) => Number.isFinite(price) && price > 0);

        const avgPrice =
          validPrices.length > 0
            ? validPrices.reduce(
                (sum, price) => sum + price,
                0
              ) / validPrices.length
            : 0;

        setStats({
          listings: uniqueListings.length,
          rentals: uniqueRentals.length,
          projects: uniqueProjects.length,
          avgPrice,
          verified,
          live,
        });
      } catch (err) {
        setError(
          err.message || "Could not calculate insights"
        );
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, []);

  const formatNumber = (number) =>
    Number(number).toLocaleString("en-IN");

  const formatMoney = (number) =>
    `₹${Number(number).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  if (loading) {
    return (
      <div className="page">
        <h2>Calculating Bangalore market insights...</h2>
        <p>This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Could not load insights</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Market Insights</h1>
          <p>
            Insights calculated directly from the live API data.
          </p>
        </div>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <span>Total Listings</span>
          <h2>{formatNumber(stats.listings)}</h2>
        </div>

        <div className="insight-card">
          <span>Total Rentals</span>
          <h2>{formatNumber(stats.rentals)}</h2>
        </div>

        <div className="insight-card">
          <span>Total Projects</span>
          <h2>{formatNumber(stats.projects)}</h2>
        </div>

        <div className="insight-card">
          <span>Average Listing Price</span>
          <h2>{formatMoney(stats.avgPrice)}</h2>
        </div>

        <div className="insight-card">
          <span>Verified Listings</span>
          <h2>{formatNumber(stats.verified)}</h2>
        </div>

        <div className="insight-card">
          <span>Live Listings</span>
          <h2>{formatNumber(stats.live)}</h2>
        </div>
      </div>

      <div className="insights-section">
        <h2>Data Quality Findings</h2>

        <div className="finding-card">
          <h3>Analytics endpoint unavailable</h3>

          <p>
            The API documentation describes
            <code> /v1/analytics/summary </code>
            as a pre-computed analytics endpoint.
          </p>

          <p>
            Testing the documented endpoint returned
            <strong> 404 Not Found</strong>.
          </p>

          <p>
            These insights are therefore calculated
            directly from the available API resources.
          </p>
        </div>

        <div className="finding-card">
          <h3>Listing detail endpoint discrepancy</h3>

          <p>
            Documentation describes
            <code> /v1/listing/{"{id}"} </code>.
          </p>

          <p>
            The documented endpoint returned 404, while
            <code> /v1/listings/{"{id}"} </code>
            successfully returned listing details.
          </p>
        </div>

        <div className="finding-card">
          <h3>Saved listings endpoint discrepancy</h3>

          <p>
            Documentation refers to favourites endpoints,
            but the working endpoint discovered through
            probing is:
          </p>

          <code>/v1/saved</code>
        </div>
      </div>
    </div>
  );
}