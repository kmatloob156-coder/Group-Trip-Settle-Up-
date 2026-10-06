# Group Trip Settle-Up

A responsive shared-expense tracker for group trips. It supports multiple currencies, equal splitting, local browser persistence, exchange-rate API integration with fallback rates, and a minimum-payment settlement algorithm.

## Features
- Add/remove group members
- Add expenses in INR, USD, EUR, GBP, AED or JPY
- Equal split among selected members
- Multi-currency conversion to INR
- Minimum number of settlement payments
- Exchange-rate API with fallback
- Form validation and error handling
- LocalStorage persistence
- Responsive mobile/desktop UI
- No backend or database required

## Tech Stack
HTML5, CSS3, JavaScript (ES6+), Fetch API, LocalStorage.

## Run locally
Open `index.html` in a modern browser. For API requests, a local static server is recommended.

Example with VS Code Live Server, or:
`python -m http.server 8000`

Then open `http://localhost:8000`.

## GitHub Pages
1. Create a public GitHub repository, e.g. `group-trip-settle-up`.
2. Upload `index.html`, `style.css`, `app.js`, `README.md`.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save and wait for the Pages URL.

## Important
This project is fully client-side. It does not need Render or a server. GitHub Pages is the simplest way to make it public as a website.

The currency API is external. If it fails, the app automatically uses built-in fallback rates so the core calculator remains usable.

## Project purpose
This project demonstrates JavaScript algorithms, API integration with fallback, form validation, client-side state management, error handling, local data persistence and responsive web design.
