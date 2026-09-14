import { useEffect, useState } from "react";
import { apiRequest } from "../api";

const API_LIMIT = 50;

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRentals() {
      try {
        setLoading(true);

        let allRentals = [];
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
          setLoadingMessage(
            `Loading rentals... ${allRentals.length} loaded`
          );

          const data = await apiRequest(
            `/v1/rentals?limit=${API_LIMIT}&offset=${offset}`
          );

          const results = data.results || [];

          allRentals = [...allRentals, ...results];

          if (results.length === 0) {
            break;
          }

          offset += results.length;
          hasMore = Boolean(data.has_more);
        }

        const uniqueRentals = Array.from(
          new Map(
            allRentals.map((rental) => [
              rental.listing_id,
              rental,
            ])
          ).values()
        );

        setRentals(uniqueRentals);
      } catch (err) {
        setError(err.message || "Could not load rentals");
      } finally {
        setLoading(false);
      }
    }

    loadRentals();
  }, []);

  const formatMoney = (amount) => {
    if (amount === null || amount === undefined) {
      return "N/A";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Loading Bangalore rentals...</h2>
        <p>{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Could not load rentals</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Rental Properties</h1>
          <p>{rentals.length.toLocaleString()} rentals available</p>
        </div>
      </div>

      <div className="listing-grid">
        {rentals.map((rental) => (
          <div
            className="property-card"
            key={rental.listing_id}
          >
            <div className="property-image">
              🏠
            </div>

            <div className="property-content">
              <div className="property-top">
                <span className="badge">
                  {rental.bedroom} BHK
                </span>
              </div>

              <h3>
                {rental.apartment_name || rental.title || "Rental Property"}
              </h3>

              <p className="locality">
                📍 {rental.locality}
              </p>

              <div className="property-info">
                <span>
                  {rental.carpet_area} sqft
                </span>

                <span>
                  {rental.furnishing}
                </span>
              </div>

              <h2>
                {formatMoney(rental.price)}
                <small> / month</small>
              </h2>

              <p>
                <strong>Deposit:</strong>{" "}
                {formatMoney(rental.deposit)}
              </p>

              <p>
                <strong>Maintenance:</strong>{" "}
                {formatMoney(rental.maintenance)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {rentals.length === 0 && (
        <div className="empty-state">
          No rentals found.
        </div>
      )}
    </div>
  );
}