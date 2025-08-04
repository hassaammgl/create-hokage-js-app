import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.scss';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="glass-container">
      <div className="glass-background">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
      </div>

      <div className="glass-card hero-card">
        <div className="logo-group">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>

        <h1 className="gradient-heading">Vite + React + TS</h1>
        <p className="subtitle">Modern frontend experience</p>
      </div>

      <div className="glass-card content-card">
        <div className="counter-card">
          <button
            className="glass-button"
            onClick={() => setCount((count) => count + 1)}
          >
            <span className="count-number">{count}</span>
            <span className="count-label">Clicks</span>
          </button>
          <div className="counter-hint">Click to increase the counter</div>
        </div>

        <div className="info-section">
          <p className="info-text">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
          <div className="features">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">Blazing Fast</div>
            </div>
            <div className="feature">
              <div className="feature-icon">🧩</div>
              <div className="feature-text">Modular</div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔧</div>
              <div className="feature-text">Developer Friendly</div>
            </div>
          </div>
        </div>
      </div>
      <div className="glass-card footer-card">
        <p className="footer-text">
          Click on the Vite and React logos to learn more
        </p>
        <div className="social-links">
          <a href="#" className="social-link">Documentation</a>
          <a href="#" className="social-link">GitHub</a>
          <a href="#" className="social-link">Community</a>
        </div>
      </div>
    </div>
  );
}

export default App;