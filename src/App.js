/* Timer that re-renders every second with stop and clear functionality*/

import React, { useState, useEffect } from 'react';
import './styles.css';

function Timer({ seconds }) {
  const isRunning = false;
  function handleRunClick() {}

  function handleClearClick() {}

  return (
    <div>
      <label className="display">{5}</label>
      <button className="btn" onClick={handleRunClick}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button className="btn" onClick={handleClearClick}>
        Clear
      </button>
    </div>
  );
}

export default function App() {
  const [show, setShow] = useState(true);

  return (
    <div className="App">
      <label>
        Show timer
        <input
          type="checkbox"
          checked={show}
          onChange={e => setShow(e.target.checked)}
        />
      </label>
      {show ? <Timer seconds={5} /> : null}
    </div>
  );
}
