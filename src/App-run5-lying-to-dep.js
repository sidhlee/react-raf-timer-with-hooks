import React, { useState, useEffect } from 'react';
import './styles.css';

function useFrameNow(isRunning) {
  const [now, setNow] = useState(null);
  const time = performance.now();

  useEffect(() => {
    let id;
    step();
    function step() {
      if (!isRunning) return;
      //  always true when now is null (time is lapse since UNIX epoch which is much greater than just 1000)
      if (time > now + 1000) {
        setNow(performance.now());
      }
      id = requestAnimationFrame(step);
    }

    return () => cancelAnimationFrame(id);
    // if time | now is included in dep array, they will casuse infinite loop!
    // setNow => now has changed => re-render => time & now has changed => setNow => now has changed =>...
  }, [isRunning]);
  /* 
  # When time & now is NOT included in the dep array
  - setNow => now has changed, but effect will not run because it only re-runs when isRunning is changed.
  - step is called before next repaint and Only when time > now + 1000, setNow is called.
  > We're calling step in every frame even though we're not really using it. (Waste!)

  */

  return isRunning ? now : null;
}

function Timer({ seconds }) {
  const [startTime, setStartTime] = useState(null);
  const [pastLapse, setPastLapse] = useState(0);

  const isRunning = startTime !== null;
  const frameNow = useFrameNow(isRunning);
  const frameLapse = isRunning ? Math.max(frameNow - startTime, 0) : null;
  const totalLapse = Math.min(pastLapse + frameLapse, seconds * 1000);
  const up = totalLapse >= seconds * 1000;

  function handleRunClick() {
    if (isRunning) {
      setPastLapse(l => l + frameNow - startTime);
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
    <div className={up ? 'up' : null}>
      <label className="display">
        {seconds - Math.floor(totalLapse / 1000)}
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
