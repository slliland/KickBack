# ⚽ UEFA EURO Football Analytics Dashboard

A full-stack data visualization dashboard showcasing historical team performance, statistics, and trends across the UEFA European Championship. Built with React, Express, PostgreSQL, and Chart.js.

---

## Features

- Interactive country profiles with map-based visualizations
- Team performance trends over the years
- Dynamic search and filtering by region and EURO achievement
- Line & bar charts (goals, wins, attendance, red cards, etc.)
- Compare multiple teams with easy toggle controls
- Responsive design & styled with EURO-themed colors

---

## Demo Website


👉 [Live Demo](https://kickback-ac72db97537b.herokuapp.com/)

---

## Screenshots

![](./src/assets/images/screenshot.jpg)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL (with `euro_db` and proper schema imported)
- Google Maps API Key

---

## Local Installation

```bash
git clone git@github.com:slliland/KickBack.git
cd KickBack
npm install
cd backend && npm install
```

### Environment Setup

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://youruser:yourpass@localhost:5432/euro_db
PORT=5001
GOOGLE_MAPS_API_KEY=your_api_key_here
```

---

## Cloud Deployment

### Backend (Heroku)

1. **Provision a PostgreSQL database** via Heroku Add-ons.
2. Set the environment variables:

```bash
heroku config:set DATABASE_URL=your_heroku_postgres_url
heroku config:set GOOGLE_MAPS_API_KEY=your_api_key
```

3. Deploy the backend:

```bash
cd backend
git init
heroku git:remote -a your-heroku-app-name
git add .
git commit -m "Initial Heroku deploy"
git push heroku main
```

Your Flask/Express API will be live at:

```
https://your-heroku-app-name.herokuapp.com/
```

---

### Frontend (Heroku, Vercel or Netlify)

1. Go to your frontend project root (`KickBack/`).
2. Create a `.env.production` file:

```env
VITE_API_BASE_URL=https://your-heroku-app-name.herokuapp.com
```

3. Deploy via [Vercel](https://vercel.com) or [Netlify](https://netlify.com) using GitHub integration or CLI.

---

## Data Sources

- EURO match data: extracted from official UEFA archives & public datasets
- Country flags, coordinates, and metadata: manually curated

---

## Tech Stack

- **Frontend**: React, Bootstrap, Chart.js, React Google Maps
- **Backend**: Express, Node.js, PostgreSQL
- **Map/Geo**: Google Maps API
- **Charts**: Chart.js via `react-chartjs-2`

---

## 💡 To-Do

- [ ] Player-level performance dashboards
- [ ] Live data feed from upcoming tournaments
- [ ] Improved mobile layout
- [ ] Export charts to image/PDF

---

## Credits

Built by Yujian Song, with love for football and data.

---

## License

This project is licensed under the MIT License.
