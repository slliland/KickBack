// backend/index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use('/api/championships', require('./routes/championships'));

const euroStatsRoute = require('./routes/euroStats');
app.use('/api/euro', require('./routes/euroStats')); 

app.use('/api/search', require('./routes/search'));

const nationsTimelineRoute = require('./routes/nationsTimeline');
app.use('/api/nations', nationsTimelineRoute);

const nationsProfilesRouter = require('./routes/nationsProfiles');
app.use('/api/nations', nationsProfilesRouter);

const nationsTrendsRouter = require('./routes/nationsTrends');
app.use('/api/nations', nationsTrendsRouter);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
