import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/scss/partials/widget/_insights.scss';

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5001/api/euro/insights')
      .then(res => {
        setInsights(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load insights:", err);
        setError("Failed to load insights. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="insights-container">
        <p>Loading insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="insights-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="insights-container">
      <h1>{insights.title}</h1>
      {insights.sections.map((section, index) => (
        <article key={index} className="insight-section">
          <h2>{section.header}</h2>
          <p>{section.text}</p>
        </article>
      ))}
    </div>
  );
};

export default Insights;
