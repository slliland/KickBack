// // backend/index.js
// const express = require('express');
// const cors = require('cors');
// const { Pool } = require('pg');

// const app = express();
// const PORT = process.env.PORT || 5001;

// app.use(cors());
// app.use(express.json());

// app.use('/api/championships', require('./routes/championships'));

// const euroStatsRoute = require('./routes/euroStats');
// app.use('/api/euro', require('./routes/euroStats')); 

// app.use('/api/search', require('./routes/search'));

// const nationsTimelineRoute = require('./routes/nationsTimeline');
// app.use('/api/nations', nationsTimelineRoute);

// const nationsProfilesRouter = require('./routes/nationsProfiles');
// app.use('/api/nations', nationsProfilesRouter);

// const nationsTrendsRouter = require('./routes/nationsTrends');
// app.use('/api/nations', nationsTrendsRouter);

// app.use('/api/nations', require('./routes/flagMap'));

// const insightsRouter = require('./routes/insights');
// app.use('/api/euro', insightsRouter);

// const landscapeRoutes = require('./routes/landscape');
// app.use('/api/euro', landscapeRoutes);

// // Start server
// app.use(express.static(path.join(__dirname, '..', 'dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
// });


// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path'); // ← make sure this is imported

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/championships', require('./routes/championships'));
app.use('/api/euro', require('./routes/euroStats'));
app.use('/api/search', require('./routes/search'));
app.use('/api/nations', require('./routes/nationsTimeline'));
app.use('/api/nations', require('./routes/nationsProfiles'));
app.use('/api/nations', require('./routes/nationsTrends'));
app.use('/api/nations', require('./routes/flagMap'));
app.use('/api/euro', require('./routes/insights'));
app.use('/api/euro', require('./routes/landscape'));

// Serve frontend from /dist (Vite build output)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Only send index.html if the request didn't match a static file or API route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next(); // Skip API routes
  res.sendFile(path.join(distPath, 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
