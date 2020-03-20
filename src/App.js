import React from 'react';
import './styles.css';

// We cannot display changed time faster than frame rate.
// Using requestAnimationFrame to set state inside useEffect allows us to re-render once in every frame
function useFrameNow(isRunning) {
  // we want to trigger re-render once per every frame
  const [now, setNow] = React.useState(null);

  React.useEffect(() => {
    if (!isRunning) return;
    setNow(performance.now());
    let id = requestAnimationFrame(step);

    function step() {
      if (!isRunning) return;
      setNow(performance.now());
      id = requestAnimationFrame(step);
    }

    return () => cancelAnimationFrame(id);
  }, [isRunning]);

  return isRunning ? now : null;
}

function Timer({ duration }) {
  // To calc total running time (excluding stopped time) we need to keep track of "start" time, and
  // when stop | clear button is clicked, calculate currentTime - startTime and store the value as pastLapse
  const [startTime, setStartTime] = React.useState(null); // time when Start is clicked. reset to null when Clear is clicked.
  const [pastLapse, setPastLapse] = React.useState(0); // total running time before current render

  // get totalLapse for display
  const isRunning = startTime !== null; // we want to only account for the time it was running (excluding stopped time)
  const frameNow = useFrameNow(isRunning); // get time for current frame. triggers re-render on every frame while running.
  const frameLapse = isRunning ? Math.max(0, frameNow - startTime) : 0; // elapsed time since start up to the current frame
  const totalLapse = Math.min(pastLapse + frameLapse, duration); // pastLapse stays the same while running.

  // set startTime on Start | set PastLapse & reset startTime on Stop
  function handleRunClick() {
    if (isRunning) {
      // using totalLapse here would allow maximum 1/60s (~16ms) time error
      setPastLapse(pastLapse => pastLapse + performance.now() - startTime); // we're only setting pastLapse when Stop is clicked.
      setStartTime(null);
    } else {
      // if stopped,
      setStartTime(performance.now()); // sets isRunning to true, start re-rendering on every frame
    }
  }

  // reset startTime & pastLapse
  function handleClearClick() {
    setStartTime(null); // reset start time
    setPastLapse(0); // reset total running time
  }
  return (
    <div>
      <label className="display">{Math.floor(duration - totalLapse)}</label>
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
      {/* checkboxs & radio-buttons are better wrapped inside label */}
      <label>
        <input
          type="checkbox"
          id="toggleTimer"
          checked={show}
          onChange={e => setShow(e.target.checked)}
        />
        Toggle timer
      </label>
      {show ? <Timer duration={5000} /> : null}
    </div>
  );
}
