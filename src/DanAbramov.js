import React from 'react';
import ReactDOM from 'react-dom';

const buttonStyles = {
  border: '1px solid #ccc',
  background: '#fff',
  fontSize: '2em',
  padding: 15,
  margin: 5,
  width: 200,
};
const labelStyles = {
  fontSize: '5em',
  display: 'block',
};

// Gives you a continuously updating timestamp.
// Note this triggers a render on every frame.
function useFrameNow(isActive) {
  const [now, setNow] = React.useState(null);

  React.useEffect(() => {
    if (!isActive) {
      return;
    }
    // Update now with current time.
    function updateNow() {
      setNow(performance.now());
    }
    // Do that on every animation frame.
    function tick() {
      if (!isActive) {
        return;
      }
      updateNow();
      id = requestAnimationFrame(tick);
    }
    // And when we start the animation.
    updateNow();
    // Let the magic go.
    let id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [isActive]);

  return isActive ? now : null;
}

function Stopwatch() {
  // Previous accumulated lapse
  const [pastLapse, setPastLapse] = React.useState(0);
  // When we started the last one (or null)
  const [startTime, setStartTime] = React.useState(null);

  // Calculate the number to show
  const isRunning = startTime !== null;
  const frameNow = useFrameNow(isRunning);
  const currentLapse = isRunning ? Math.max(0, frameNow - startTime) : 0;
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
      <label style={labelStyles}>{Math.round(totalLapse)}ms</label>
      <button onClick={handleRunClick} style={buttonStyles}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button onClick={handleClearClick} style={buttonStyles}>
        Clear
      </button>
    </div>
  );
}

function App() {
  const [show, setShow] = React.useState(true);
  return (
    <div style={{ textAlign: 'center' }}>
      <label>
        <input
          checked={show}
          type="checkbox"
          onChange={e => setShow(e.target.checked)}
        />{' '}
        Show stopwatch
      </label>
      {show ? <Stopwatch /> : null}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
