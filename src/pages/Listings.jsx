import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";

const PAGE_SIZE = 12;
const API_LIMIT = 50;

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");

  const [locality, setLocality] = useState("");
  const [bhk, setBhk] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        setError("");

        let allListings = [];
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
          setLoadingMessage(
            `Loading properties... ${allListings.length.toLocaleString()} loaded`
          );

          const data = await apiRequest(
            `/v1/listings?limit=${API_LIMIT}&offset=${offset}`
          );

          const results = data.results || [];

          allListings = [...allListings, ...results];

          if (results.length === 0) {
            break;
          }

          offset += results.length;
          hasMore = Boolean(data.has_more);
        }

        // Remove duplicate listing IDs just in case
        const uniqueListings = Array.from(
          new Map(
            allListings.map((listing) => [
              listing.listing_id,
              listing,
            ])
          ).values()
        );

        setListings(uniqueListings);
      } catch (err) {
        setError(err.message || "Could not load listings");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (locality.trim()) {
      const search = locality.toLowerCase().trim();

      result = result.filter((item) =>
        item.locality?.toLowerCase().includes(search)
      );
    }

    if (bhk) {
      if (bhk === "5") {
        result = result.filter(
          (item) => Number(item.bedroom) >= 5
        );
      } else {
        result = result.filter(
          (item) => Number(item.bedroom) === Number(bhk)
        );
      }
    }

    if (furnishing) {
      result = result.filter(
        (item) =>
          item.furnishing?.toLowerCase() ===
          furnishing.toLowerCase()
      );
    }

    if (maxPrice) {
      result = result.filter(
        (item) =>
          Number(item.price) <= Number(maxPrice)
      );
    }

    return result;
  }, [listings, locality, bhk, furnishing, maxPrice]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredListings.length / PAGE_SIZE)
  );

  const currentListings = filteredListings.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const resetPage = () => setPage(1);

  const saveListing = async (listingId) => {
    try {
      setSavingId(listingId);

      await apiRequest("/v1/saved", {
        method: "POST",
        body: JSON.stringify({
          listing_id: listingId,
        }),
      });

      alert("Property saved successfully ❤️");
    } catch (error) {
      alert(error.message || "Could not save property");
    } finally {
      setSavingId("");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Loading Bangalore properties...</h2>
        <p>{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Could not load listings</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Browse Properties</h1>
          <p>
            {filteredListings.length.toLocaleString()} properties found
          </p>
        </div>
      </div>

      <div className="filters">
        <input
          placeholder="Search locality"
          value={locality}
          onChange={(e) => {
            setLocality(e.target.value);
            resetPage();
          }}
        />

        <select
          value={bhk}
          onChange={(e) => {
            setBhk(e.target.value);
            resetPage();
          }}
        >
          <option value="">Any BHK</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4 BHK</option>
          <option value="5">5+ BHK</option>
        </select>

        <select
          value={furnishing}
          onChange={(e) => {
            setFurnishing(e.target.value);
            resetPage();
          }}
        >
          <option value="">Any furnishing</option>
          <option value="unfurnished">
            Unfurnished
          </option>
          <option value="semi-furnished">
            Semi-furnished
          </option>
          <option value="fully-furnished">
            Fully furnished
          </option>
        </select>

        <input
          type="number"
          placeholder="Maximum price"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            resetPage();
          }}
        />

        <button
          className="secondary-btn"
          onClick={() => {
            setLocality("");
            setBhk("");
            setFurnishing("");
            setMaxPrice("");
            setPage(1);
          }}
        >
          Clear
        </button>
      </div>

      <div className="listing-grid">
        {currentListings.map((listing) => (
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
                  <span className="badge">
                    {listing.bedroom} BHK
                  </span>

                  {listing.is_verified && (
                    <span className="verified">
                      ✓ Verified
                    </span>
                  )}
                </div>

                <h3>
                  {listing.apartment_name || "Property"}
                </h3>

                <p className="locality">
                  📍 {listing.locality}
                </p>

                <div className="property-info">
                  <span>
                    {listing.carpet_area} sqft
                  </span>

                  <span>
                    {listing.furnishing}
                  </span>
                </div>

                <h2>
                  ₹
                  {Number(listing.price).toLocaleString(
                    "en-IN"
                  )}
                </h2>
              </div>
            </Link>

            <div className="property-card-actions">
              <button
                className="save-btn"
                disabled={savingId === listing.listing_id}
                onClick={() =>
                  saveListing(listing.listing_id)
                }
              >
                {savingId === listing.listing_id
                  ? "Saving..."
                  : "♡ Save Property"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="empty-state">
          No properties match your filters.
        </div>
      )}

      {filteredListings.length > 0 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
          >
            ← Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}