# 🏡 Ivy Homes – Real Estate Dashboard

A responsive React-based real estate application built as part of the **Ivy Homes Frontend Assignment**.

The application integrates with the Ivy Homes API to provide authenticated access to property listings, rentals, residential projects, saved properties, property details, and market insights.

---

## 🚀 Features

### 🔐 Authentication

- User login using the Ivy Homes API
- JWT-based authentication
- Access token management
- Automatic token refresh when the access token expires
- Protected routes for authenticated users

---

### 🏠 Property Listings

- Browse thousands of property listings
- Search properties by locality
- Filter properties by:
  - BHK
  - Furnishing type
  - Maximum price
- Pagination for easier browsing
- View detailed information about individual properties
- Save properties to favourites

---

### ❤️ Saved Properties

- Save properties using the API
- View saved properties
- Remove saved properties

Working API endpoint:

```text
/v1/saved
```

---

### 🏢 Residential Projects

Browse residential projects and view information such as:

- Project name
- Developer
- Locality
- Project status
- Area range
- Price range
- Number of units
- Number of towers
- Listings reported

The application handles API pagination and fetches the available project records.

---

### 🏘 Rentals

Browse available rental properties and view information including:

- Property title
- Locality
- BHK
- Furnishing
- Rent
- Deposit
- Area

---

### 📊 Market Insights

The API documentation described an analytics endpoint:

```text
/v1/analytics/summary
```

However, testing showed that this endpoint returned:

```text
404 Not Found
```

Therefore, the application calculates insights directly from the available API data.

The insights page includes:

- Total Listings
- Total Rentals
- Total Projects
- Average Listing Price
- Verified Listings
- Live Listings
- API and documentation discrepancies discovered during testing

---

# 🛠 Tech Stack

## Frontend

- React
- JavaScript
- React Router DOM
- Vite

## Styling

- CSS
- CSS Grid
- Flexbox

## API Integration

- Fetch API
- REST APIs
- JWT Authentication

## Development Tools

- npm
- Git
- GitHub
- ESLint

---

# 📁 Project Structure

```text
ivy-homes/
│
├── public/
│
├── src/
│   │
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   │
│   ├── components/
│   │   └── Navbar.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   └── pages/
│       ├── Login.jsx
│       ├── Listings.jsx
│       ├── ListingDetail.jsx
│       ├── Favourites.jsx
│       ├── Rentals.jsx
│       ├── Projects.jsx
│       └── Insights.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# ⚙️ Installation and Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Lava2403/ivy-homes.git
```

## 2. Navigate to the Project Directory

```bash
cd ivy-homes
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start the Development Server

```bash
npm run dev
```

After starting the server, Vite will display a local URL similar to:

```text
http://localhost:5173
```

Open this URL in your browser.

---

# 🏗 Build for Production

To create a production build:

```bash
npm run build
```

This generates an optimized production build inside the:

```text
dist/
```

folder.

---

# 🔍 Preview Production Build

After building the application, preview it locally using:

```bash
npm run preview
```

---

# 🔑 Authentication Flow

The application uses JWT-based authentication.

## Login Flow

```text
User Login
     ↓
POST /auth/login
     ↓
Receive Access Token + Refresh Token
     ↓
Tokens stored in localStorage
     ↓
Authenticated API Requests
```

## Token Refresh Flow

When an API request returns:

```text
401 Unauthorized
```

the application automatically:

```text
Detect expired access token
        ↓
POST /auth/refresh
        ↓
Receives new access token
        ↓
Retries original API request
```

This prevents users from needing to manually log in again whenever an access token expires.

---

# 🌐 API Integration

Base API URL:

```text
https://solve.ivy.homes
```

## Authentication

```text
POST /auth/login
POST /auth/refresh
```

## Listings

```text
GET /v1/listings
GET /v1/listings/{id}
```

## Rentals

```text
GET /v1/rentals
```

## Projects

```text
GET /v1/projects
```

## Saved Properties

```text
GET /v1/saved
POST /v1/saved
DELETE /v1/saved/{listing_id}
```

---

# 🧪 API Investigation and Findings

During development, the API was tested to verify the endpoints described in the documentation.

Several discrepancies were discovered.

---

## Analytics Endpoint

The documented endpoint:

```text
/v1/analytics/summary
```

returned:

```text
404 Not Found
```

### Solution

Market insights are calculated directly from listings, rentals, and projects data.

---

## Listing Detail Endpoint

The documentation referenced:

```text
/v1/listing/{id}
```

This endpoint returned:

```text
404 Not Found
```

The working endpoint was:

```text
/v1/listings/{id}
```

---

## Saved Properties Endpoint

Several favourites-related routes returned `404`.

The working endpoint discovered through API probing was:

```text
/v1/saved
```

The application uses this endpoint for saved property functionality.

---

## Project Pagination Discrepancy

The projects API reported a total count that differed from the number of project records returned during pagination.

The application therefore continues fetching available pages based on the API pagination response rather than relying solely on the reported total count.

---

# 📄 Application Pages

| Page | Description |
|---|---|
| Login | User authentication |
| Listings | Browse and filter properties |
| Property Details | View complete information about a property |
| Saved Properties | Manage saved properties |
| Rentals | Browse rental properties |
| Projects | Browse residential projects |
| Market Insights | View calculated market statistics |

---

# ✨ Key Implementation Details

## Protected Routes

Pages requiring authentication are protected using React Router.

Unauthenticated users are redirected to the login page.

---

## Client-Side Filtering

Property listings can be filtered by:

- Locality
- BHK
- Furnishing type
- Maximum price

---

## Pagination

Large datasets are fetched from the API in batches and displayed using client-side pagination.

---

## Responsive UI

The application uses:

- CSS Grid
- Flexbox
- Responsive layouts

to provide a user-friendly experience across different screen sizes.

---

# 🧹 Code Quality

The project uses ESLint for code quality and linting.

Run the linter using:

```bash
npm run lint
```

---

# 📦 Available Scripts

## Start Development Server

```bash
npm run dev
```

## Build Application

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Run Linter

```bash
npm run lint
```

---

# 👩‍💻 Author

**Lavanya Agarwal**

GitHub: [https://github.com/Lava2403](https://github.com/Lava2403)

---

# 📌 Repository

[https://github.com/Lava2403/ivy-homes](https://github.com/Lava2403/ivy-homes)
