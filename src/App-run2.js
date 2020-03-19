import React from 'react';
import './styles.css';

// After the containing component is rendered, and if isRunning,
// 1. updates state(timestamp) before every re-paint by browser (~60fps)
// 2. returns timestamp
// If not running, return null.
function useRAF(isRunning) {
  const [timestamp, setTimestamp] = React.useState(null);

  // This effect will run when Start | Stop button is clicked
  React.useEffect(() => {
    if (!isRunning) return; // 2. If Stop button is clicked, do nothing
    setTimestamp(performance.now()); // 3. If Start button is clicked, update timestamp state with current time
    let rafId = requestAnimationFrame(step); // 4. and enqueue step fn for next repaint

    // Basically repeat 2 - 4 until Stop | Clear button is clicked
    function step() {
      if (!isRunning) return;
      setTimestamp(performance.now());
      rafId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(rafId); // 1. first clear request queue from the previous effect
  }, [isRunning]);

  return isRunning ? timestamp : null;
}

function Timer({ remainingTime }) {
  // state to persist between renders
  const [pastLapse, setPastLapse] = React.useState(0); // elapsed time b/w 'Start' and 'Stop' accumulated before 'Clear'
  const [startTime, setStartTime] = React.useState(null); // time when 'Start' btn is clicked (for the first time | again).

  const isRunning = startTime !== null;
  const timestamp = useRAF(isRunning); // returns timestamp of every frame if running
  const currentLapse = isRunning ? Math.max(0, timestamp - startTime) : 0; // elapsed time b/w '(re)Start' and timestamp
  const totalLapse = pastLapse + currentLapse; // total running time

  function handleRunClick() {
    if (isRunning) {
      // 'Stop' btn clicked
      setPastLapse(l => l + performance.now() - startTime); // update pastLapse
      setStartTime(null); // reset startTime
    } else {
      // 'Start' btn clicked (again)
      setStartTime(performance.now()); // set startTime as now
    }
  }

  function handleClearClick() {
    setPastLapse(0);
    setStartTime(null);
  }

  const displayingTime = Math.floor(Math.max(remainingTime - totalLapse, 0));

  // render displyaingTime + controls(stop|start, clear)
  return (
    <div>
      <label className="display">{displayingTime}ms</label>
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
  // state for Timer component mount | unmount
  const [show, setShow] = React.useState(true);
  return (
    <div className="App">
      <label>
        {/* toggle switch for Timer */}
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
