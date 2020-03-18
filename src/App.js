import React from 'react';
import './styles.css';

function useRAF(isRunning) {
  const [timestamp, setTimestamp] = React.useState(null);

  React.useEffect(() => {
    if (!isRunning) return;
    function step() {
      if (!isRunning) return;
      setTimestamp(performance.now());
      rafId = requestAnimationFrame(step);
    }
    setTimestamp(performance.now());
    let rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isRunning]);

  return isRunning ? timestamp : null;
}

function Timer({ remainingTime }) {
  const [pastLapse, setPastLapse] = React.useState(0);
  const [startTime, setStartTime] = React.useState(null);
  const isRunning = startTime !== null;
  const timestamp = useRAF(isRunning);
  const currentLapse = isRunning ? Math.max(0, timestamp - startTime) : 0;
  const totalLapse = pastLapse + currentLapse;

  function handleRunClick() {
    if (isRunning) {
      setPastLapse(l => l + performance.now() - startTime);
      setStartTime(null);
    } else {
      setStartTime(performance.now());
    }
  }

  function handleClearClick() {
    setPastLapse(0);
    setStartTime(null);
  }

  return (
    <div>
      <label className="display">
        {Math.floor(Math.max(remainingTime - totalLapse, 0))}ms
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
  const [show, setShow] = React.useState(true);
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
      {show ? <Timer remainingTime={5000} /> : null}
    </div>
  );
}
