import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../api";

export default function ListingDetail() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadListing() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(`/v1/listings/${id}`);

        setListing(data);
      } catch (err) {
        setError(err.message || "Could not load listing");
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [id]);

  const saveListing = async () => {
    try {
      setSaving(true);

      await apiRequest("/v1/saved", {
        method: "POST",
        body: JSON.stringify({
          listing_id: listing.listing_id,
        }),
      });

      alert("Property saved successfully ❤️");
    } catch (err) {
      alert(err.message || "Could not save property");
    } finally {
      setSaving(false);
    }
  };

  const formatMoney = (amount) => {
    if (amount === null || amount === undefined) return "N/A";

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Loading property details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Could not load property</h2>
        <p>{error}</p>

        <Link to="/listings">
          ← Back to properties
        </Link>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="page">
        <h2>Property not found</h2>
      </div>
    );
  }

  return (
    <div className="page">

      <Link
        to="/listings"
        className="back-link"
      >
        ← Back to properties
      </Link>

      <div className="detail-card">

        <div className="detail-header">
          <div>
            <span className="badge">
              {listing.bedroom} BHK
            </span>

            {listing.is_verified && (
              <span className="verified">
                ✓ Verified
              </span>
            )}

            <h1>
              {listing.apartment_name || "Property"}
            </h1>

            <p className="locality">
              📍 {listing.locality}
            </p>
          </div>

          <button
            className="save-btn"
            disabled={saving}
            onClick={saveListing}
          >
            {saving
              ? "Saving..."
              : "♡ Save Property"}
          </button>
        </div>

        <div className="detail-price">
          {formatMoney(listing.price)}
        </div>

        <div className="detail-grid">

          <div>
            <strong>Bedrooms</strong>
            <p>{listing.bedroom}</p>
          </div>

          <div>
            <strong>Bathrooms</strong>
            <p>{listing.bathroom}</p>
          </div>

          <div>
            <strong>Balconies</strong>
            <p>{listing.balcony ?? "N/A"}</p>
          </div>

          <div>
            <strong>Carpet Area</strong>
            <p>{listing.carpet_area} sqft</p>
          </div>

          <div>
            <strong>Property Type</strong>
            <p>{listing.property_type}</p>
          </div>

          <div>
            <strong>Furnishing</strong>
            <p>{listing.furnishing}</p>
          </div>

          <div>
            <strong>Facing</strong>
            <p>{listing.facing_direction || "N/A"}</p>
          </div>

          <div>
            <strong>Floor</strong>
            <p>
              {listing.floor ?? "N/A"} of{" "}
              {listing.total_floors ?? "N/A"}
            </p>
          </div>

          <div>
            <strong>Parking</strong>
            <p>
              {listing.covered_parking ?? 0} covered
            </p>
          </div>

          <div>
            <strong>Posted By</strong>
            <p>
              {listing.posted_by_name ||
                listing.posted_by ||
                "N/A"}
            </p>
          </div>

        </div>

        <div className="detail-section">
          <h2>Description</h2>

          <p>
            {listing.description ||
              "No description available."}
          </p>
        </div>

        <div className="detail-section">
          <h2>Listing Information</h2>

          <p>
            <strong>Listing ID:</strong>{" "}
            {listing.listing_id}
          </p>

          <p>
            <strong>Posted:</strong>{" "}
            {listing.posted_at || "N/A"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {listing.is_live
              ? "Live"
              : "Not live"}
          </p>
        </div>

      </div>
    </div>
  );
}