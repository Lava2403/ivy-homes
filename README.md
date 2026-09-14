# Ivy Homes – Property Discovery Platform

A React-based property discovery application built for the Ivy Homes frontend assignment.

The application integrates with the Ivy Homes API to allow users to browse residential properties, explore rentals and projects, view detailed property information, save favourite properties, and view market insights calculated from live API data.

---

## 🚀 Live Application

🔗 **Deployment:** Add your deployed application URL here

---

## 📂 GitHub Repository

🔗 https://github.com/Lava2403/ivy-homes

---

# ✨ Features

## 🔐 Authentication

- User login using the Ivy Homes API
- Access and refresh token handling
- Automatic token refresh when the access token expires
- Protected application routes
- Persistent authentication using `localStorage`

---

## 🏠 Property Listings

- Browse thousands of residential properties
- Search properties by locality
- Filter properties by:
  - BHK
  - Furnishing status
  - Maximum price
- Client-side pagination
- Verified property indicators
- Save properties to favourites

---

## 🔎 Property Details

Users can view detailed information about an individual property including:

- Property name
- Locality
- Property type
- BHK configuration
- Bathrooms
- Balcony
- Furnishing
- Floor information
- Carpet area
- Price
- Parking
- Facing direction
- Verification status
- Property description

---

## ❤️ Saved Properties

Users can save properties using the API.

The working API endpoint discovered during API testing was:

```text
POST /v1/saved
GET /v1/saved
DELETE /v1/saved/{listing_id}
