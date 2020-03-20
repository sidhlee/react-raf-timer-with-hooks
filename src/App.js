import React, { useState, useEffect } from 'react';
import './styles.css';

function useFrameNow(isRunning) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    if (!isRunning) return;
    const time = performance.now();
    // only re-render every second (not on every frame)
    if (!now || time > now + 1000) {
      setNow(time);
    }
    let id = requestAnimationFrame(step);

    function step() {
      if (!isRunning) return;
      const time = performance.now();
      if (!now || time > now + 1000) {
        setNow(time);
      }
      id = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(id);
  }, [isRunning, now]);
  return isRunning ? now : null;
}

function Timer({ duration }) {
  const [startTime, setStartTime] = useState(null);
  const [pastLapse, setPastLapse] = useState(0);

  const isRunning = startTime !== null; // isRunning is 100% determined by startTime. no need to be state,
  const frameNow = useFrameNow(isRunning);
  const frameLapse = isRunning ? Math.max(frameNow - startTime, 0) : 0;
  const totalLapse = Math.min(pastLapse + frameLapse, duration);

  function handleRunClick(e) {
    if (isRunning) {
      setPastLapse(pastLapse => pastLapse + performance.now() - startTime);
      setStartTime(null);
    } else {
      setStartTime(performance.now());
    }
  }

  function handleClearClick(e) {
    setStartTime(null);
    setPastLapse(0);
  }
  return (
    <div>
      <label className="display">
        {Math.floor((duration - totalLapse) / 1000)}s
      </label>
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
        <input
          type="checkbox"
          checked={show}
          onChange={e => setShow(e.target.checked)}
        />{' '}
        Show timer
      </label>
      {show ? <Timer duration={5000} /> : null}
    </div>
  );
}
