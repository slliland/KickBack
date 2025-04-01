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

## Screenshots

![](./src/assets/images/grid_image_no_resize.jpg)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL (with `euro_db` and proper schema imported)
- Google Maps API Key

### Installation

```bash
git clone git@github.com:slliland/KickBack.git
cd KickBack
npm install
cd backend && npm install
```

### Set up environment

Create a `.env` file in the `backend/` directory:

```bash
DATABASE_URL=postgresql://youruser:yourpass@localhost:5432/euro_db
PORT=5001
GOOGLE_MAPS_API_KEY=your_api_key_here
```

---

## Data Sources

- EURO match data: extracted from official UEFA archives & public datasets
- Country flags, coordinates, and metadata: manually curated

---

## Tech Stack

- **Frontend**: React, Bootstrap, Chart.js, React Google Maps
- **Backend**: Express, Node.js, PostgreSQL
- **Map/Geo**: Google Maps API
- **Charts**: chart.js via `react-chartjs-2`

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

MIT License
