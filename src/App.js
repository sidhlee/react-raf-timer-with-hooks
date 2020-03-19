import React from 'react';
import './styles.css';

function useFrameNow(isRunning) {
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
  const [startTime, setStartTime] = React.useState(null);
  const [pastLapse, setPastLapse] = React.useState(0);

  const isRunning = startTime !== null;
  const frameNow = useFrameNow(isRunning); // get time for current frame
  const frameLapse = isRunning ? Math.max(0, frameNow - startTime) : 0; // elapsed time since start until current frame
  const totalLapse = Math.min(pastLapse + frameLapse, duration);

  function handleRunClick() {
    if (isRunning) {
      // using totalLapse here would allow maximum 1/60s (~16ms) time error
      setPastLapse(pastLapse => pastLapse + performance.now() - startTime);
      setStartTime(null);
    } else {
      setStartTime(performance.now());
    }
  }
  function handleClearClick() {
    setStartTime(null);
    setPastLapse(0);
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
      <input
        type="checkbox"
        id="toggleTimer"
        checked={show}
        onChange={e => setShow(e.target.checked)}
      />
      <label htmlFor="toggleTimer">Toggle timer</label>
      {show ? <Timer duration={5000} /> : null}
    </div>
  );
}
