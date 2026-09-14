import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";

export default function Favourites() {
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");

  const loadSavedListings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/v1/saved");

      setSavedListings(data.results || []);
    } catch (err) {
      setError(err.message || "Could not load saved properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedListings();
  }, []);

  const removeSavedListing = async (listingId) => {
    try {
      setRemovingId(listingId);

      await apiRequest(`/v1/saved/${listingId}`, {
        method: "DELETE",
      });

      setSavedListings((currentListings) =>
        currentListings.filter(
          (listing) => listing.listing_id !== listingId
        )
      );
    } catch (err) {
      alert(err.message || "Could not remove saved property");
    } finally {
      setRemovingId("");
    }
  };

  const formatMoney = (amount) => {
    if (amount === null || amount === undefined) {
      return "N/A";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Loading saved properties...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Could not load saved properties</h2>
        <p>{error}</p>

        <button
          className="secondary-btn"
          onClick={loadSavedListings}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Saved Properties</h1>

          <p>
            {savedListings.length} saved{" "}
            {savedListings.length === 1
              ? "property"
              : "properties"}
          </p>
        </div>
      </div>

      {savedListings.length === 0 ? (
        <div className="empty-state">
          <h2>No saved properties yet</h2>

          <p>
            Browse properties and save the ones you like.
          </p>

          <Link
            to="/listings"
            className="primary-btn"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="listing-grid">
          {savedListings.map((listing) => (
            <div
              className="property-card"
              key={listing.listing_id}
            >
              <Link
                className="property-card-link"
                to={`/listings/${listing.listing_id}`}
              >
                <div className="property-image">
                  🏠
                </div>

                <div className="property-content">
                  <div className="property-top">
                    {listing.bedroom && (
                      <span className="badge">
                        {listing.bedroom} BHK
                      </span>
                    )}

                    {listing.is_verified && (
                      <span className="verified">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <h3>
                    {listing.apartment_name ||
                      listing.title ||
                      "Property"}
                  </h3>

                  {listing.locality && (
                    <p className="locality">
                      📍 {listing.locality}
                    </p>
                  )}

                  {listing.price && (
                    <h2>
                      {formatMoney(listing.price)}
                    </h2>
                  )}
                </div>
              </Link>

              <div className="property-card-actions">
                <button
                  className="secondary-btn"
                  disabled={
                    removingId === listing.listing_id
                  }
                  onClick={() =>
                    removeSavedListing(listing.listing_id)
                  }
                >
                  {removingId === listing.listing_id
                    ? "Removing..."
                    : "Remove ♡"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}