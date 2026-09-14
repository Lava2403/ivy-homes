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

    const value = Number(amount);

    if (Number.isNaN(value)) return "N/A";

    return `₹${value.toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          <h2>Loading property details...</h2>
          <p>Please wait while we fetch the property information.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-state">
          <h2>Could not load property</h2>
          <p>{error}</p>

          <Link to="/listings" className="back-link">
            ← Back to properties
          </Link>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="page">
        <div className="error-state">
          <h2>Property not found</h2>

          <Link to="/listings" className="back-link">
            ← Back to properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page listing-detail-page">
      <Link to="/listings" className="back-link">
        ← Back to properties
      </Link>

      <div className="detail-card">

        {/* HEADER */}
        <div className="detail-header">
          <div className="detail-title-section">
            <div className="detail-tags">
              <span className="badge">
                {listing.bedroom} BHK
              </span>

              {listing.is_verified && (
                <span className="verified">
                  ✓ Verified
                </span>
              )}
            </div>

            <h1>
              {listing.apartment_name || "Property"}
            </h1>

            <p className="locality">
              📍 {listing.locality || "Location not available"}
            </p>

            <div className="detail-price">
              {formatMoney(listing.price)}
            </div>
          </div>

          <button
            className="save-btn detail-save-btn"
            disabled={saving}
            onClick={saveListing}
          >
            {saving ? "Saving..." : "♡ Save Property"}
          </button>
        </div>

        {/* PROPERTY DETAILS */}
        <section className="detail-section">
          <h2>Property Details</h2>

          <div className="detail-grid">

            <div className="detail-item">
              <span>Bedrooms</span>
              <strong>{listing.bedroom ?? "N/A"}</strong>
            </div>

            <div className="detail-item">
              <span>Bathrooms</span>
              <strong>{listing.bathroom ?? "N/A"}</strong>
            </div>

            <div className="detail-item">
              <span>Balconies</span>
              <strong>{listing.balcony ?? "N/A"}</strong>
            </div>

            <div className="detail-item">
              <span>Carpet Area</span>
              <strong>
                {listing.carpet_area
                  ? `${listing.carpet_area} sqft`
                  : "N/A"}
              </strong>
            </div>

            <div className="detail-item">
              <span>Property Type</span>
              <strong>{listing.property_type || "N/A"}</strong>
            </div>

            <div className="detail-item">
              <span>Furnishing</span>
              <strong>{listing.furnishing || "N/A"}</strong>
            </div>

            <div className="detail-item">
              <span>Facing</span>
              <strong>
                {listing.facing_direction || "N/A"}
              </strong>
            </div>

            <div className="detail-item">
              <span>Floor</span>
              <strong>
                {listing.floor ?? "N/A"} of{" "}
                {listing.total_floors ?? "N/A"}
              </strong>
            </div>

            <div className="detail-item">
              <span>Parking</span>
              <strong>
                {listing.covered_parking ?? 0} covered
              </strong>
            </div>

            <div className="detail-item">
              <span>Posted By</span>
              <strong>
                {listing.posted_by_name ||
                  listing.posted_by ||
                  "N/A"}
              </strong>
            </div>

          </div>
        </section>

        {/* DESCRIPTION */}
        <section className="detail-section">
          <h2>Description</h2>

          <p className="detail-description">
            {listing.description ||
              "No description available for this property."}
          </p>
        </section>

        {/* LISTING INFORMATION */}
        <section className="detail-section listing-information">
          <h2>Listing Information</h2>

          <div className="listing-info-grid">

            <div>
              <span>Listing ID</span>
              <strong>{listing.listing_id}</strong>
            </div>

            <div>
              <span>Posted On</span>
              <strong>{formatDate(listing.posted_at)}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong className={listing.is_live ? "live-status" : ""}>
                {listing.is_live ? "● Live" : "Not Live"}
              </strong>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}