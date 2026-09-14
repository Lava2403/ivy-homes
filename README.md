# 🏠 Ivy Homes – Real Estate Discovery Platform

A responsive real estate discovery platform built using **React + Vite** that integrates with the Ivy Homes API to help users browse properties, rentals, residential projects, save favourite properties, and explore market insights.

This project was built as part of the **Ivy Homes Frontend/API Assignment**.

---

## ✨ Features

### 🔐 Authentication

- Login functionality using the provided demo accounts
- JWT-based authentication
- Access token management
- Automatic access token refresh using refresh tokens
- Protected routes for authenticated users

### 🏠 Property Listings

- Browse thousands of property listings
- Search properties by locality
- Filter by:
  - BHK configuration
  - Furnishing type
  - Maximum price
- Client-side pagination
- Verified property indicators
- Property pricing and area information
- Individual property detail pages

### ❤️ Saved Properties

- Save properties to favourites
- View saved properties
- Remove properties from saved listings

### 🏢 Residential Projects

- Browse residential projects available through the API
- View:
  - Developer information
  - Locality
  - Project status
  - Area range
  - Price range
  - Number of units
  - Number of towers
  - Reported listings

### 🏘️ Rental Properties

- Browse rental listings
- Explore rental property details and pricing

### 📊 Market Insights

The application calculates useful market insights directly from the available API data, including:

- Total property listings
- Total rentals
- Total residential projects
- Average listing price
- Number of verified listings
- Number of live listings

---

## 🛠️ Tech Stack

- **React**
- **Vite**
- **React Router DOM**
- **JavaScript**
- **CSS**
- **REST API**
- **JWT Authentication**

---

## 🔌 API Integration

The application integrates with the Ivy Homes API.

### Main API Resources Used

- `/auth/login`
- `/auth/refresh`
- `/v1/listings`
- `/v1/listings/{id}`
- `/v1/rentals`
- `/v1/projects`
- `/v1/saved`

Authentication is handled using Bearer tokens along with the required API key header.

The application automatically refreshes expired access tokens using the refresh token.

---

## 🔐 Authentication Flow

1. User logs in using their credentials.
2. The API returns:
   - Access token
   - Refresh token
3. Tokens are stored locally.
4. API requests include:

```text
Authorization: Bearer <access_token>
X-API-Key: <api_key>
