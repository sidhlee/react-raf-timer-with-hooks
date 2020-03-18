import React from 'react';
import './styles.css';

// returns timestamp generated at every frame.
// meaning that this function is rendered at every frame.<NOT TRUE>
// => will request step function
// Custom hook is just a reusable abstraction of codes away from a component
// and will run every time the enclosing component is rendered by React
function useCurrentTime(isActive) {
  const [now, setNow] = React.useState(null);

  // ...and this effect will only run
  // once on component mount, and then
  // only when isActive is changed
  React.useEffect(() => {
    if (!isActive) return; // 2 . if isActive is changed to false, do nothing

    function step(/* timestamp - "beginning of the main thread frame that we're currently in" */) {
      // will prevent pre-queued step function from running
      // if deactivated after rAF is called
      if (!isActive) return;
      setNow(performance.now()); // because the passed timestamp is confusing sometimes.
      rafId = requestAnimationFrame(step); // Enqueue new request (there will be 1 request at the most)
    }
    // 3. only if isActive is changed to true,
    setNow(performance.now()); // set current timestamp
    let rafId = requestAnimationFrame(step); // Enqueue step to run before next repaint.

    // 1 . If isActive is changed, previous request will be canceled. (queue is now empty.)
    return () => cancelAnimationFrame(rafId);
  }, [isActive]);

  return isActive ? now : null;
}

function Stopwatch() {
  // previously accumulated lapse before the render.
  // which will persist across re-renders but will reset upon page reload | unmount.
  const [pastLapse, setPastLapse] = React.useState(0);
  // is set when "start" button is clicked.
  const [startTime, setStartTime] = React.useState(null);

  // Stopwatch (functional component) will create new stack frame every time startTime is updated
  // , so isRunning will be re-decalred with new value (it is a constant after all).
  const isRunning = startTime !== null; // false if startTime is null

  // Custom hook that requests animationFrame and returns timestamp (if isActive: true) or null
  const currentTime = useCurrentTime(isRunning);

  const currentLapse = isRunning ? Math.max(0, currentTime - startTime) : 0;
  // Displayed value in ms (will be floored)
  const totalLapse = pastLapse + currentLapse;

  function handleRunClick() {
    // if startTime is not null, perform "pause" operations
    if (isRunning) {
      setPastLapse(pastLapse => pastLapse + performance.now() - startTime);
      // set startTime to null so that it can be updated with the most current timestamp
      // at the time when "Start" is clicked on paused state.
      setStartTime(null);
    } else {
      // If startTime is null, set startTime with current timestamp
      setStartTime(performance.now());
    }
  }
  function handleClearClick() {
    // clear pastLapse
    setPastLapse(0);
    setStartTime(null);
  }

  return (
    <div>
      <label className="display">{Math.floor(totalLapse)}ms</label>
      <button onClick={handleRunClick} className="btn">
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button onClick={handleClearClick} className="btn">
        {'Clear'}
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
        Show stopwatch
      </label>
      {show ? <Stopwatch /> : null}
    </div>
  );
}
