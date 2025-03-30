import React, { useState, useRef, useEffect } from 'react';

const NavSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setResults(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openSearch = () => setIsOpen(true);

  const closeSearch = () => {
    setIsOpen(false);
    setQuery('');
    setResults(null);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:5001/api/search?q=${encodeURIComponent(query.trim())}`
      );
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className={`main-search ${isOpen ? 'open' : ''}`}
      ref={wrapperRef}
      style={{ position: 'relative' }}
    >
      <div className="input-group">
        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          placeholder="Search Euro Cup..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Close Button (only visible when open) */}
        {isOpen && (
          <button
            className="search-close-btn"
            onClick={closeSearch}
            type="button"
            aria-label="Close search"
          >
            <i className="feather icon-x" />
          </button>
        )}


        {/* Search Button - toggles open or performs search */}
        <button
          className="search-btn btn btn-primary"
          onClick={isOpen ? handleSearch : openSearch}
          type="button"
        >
          <i className="feather icon-search input-group-text" />
        </button>
      </div>

      {isOpen && results && (
        <div
          className="search-results bg-white shadow rounded mt-2 p-3"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            zIndex: 999,
            maxHeight: '300px',
            overflowY: 'auto',
            animation: 'fadeIn 0.2s ease-in-out',
          }}
        >
          <h6 className="mb-2">🔍 News</h6>
          {results.news?.length ? (
            results.news.map((item, i) => (
              <div key={i} className="mb-2">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none fw-bold"
                  style={{ color: '#3f4d67' }}
                >
                  {item.title}
                </a>
                <br />
                <small className="text-muted">
                  {new Date(item.fetched_at).toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            <p className="text-muted small">No news found.</p>
          )}

          <hr />

          <h6 className="mb-2">📘 Summary</h6>
          {results.summary?.length ? (
            results.summary.map((item, i) => (
              <div key={i} className="mb-2">
                <strong>{item.year}</strong> - {item.winner}
                <br />
                <small className="text-muted">Final: {item.final}</small>
              </div>
            ))
          ) : (
            <p className="text-muted small">No summaries found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NavSearch;
