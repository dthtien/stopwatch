import React, { FC, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useNow } from './hooks';

const Duration: FC<{ durationMs: number }> = ({ durationMs }) => {
  const hours = String(Math.floor(durationMs/1000/60/60)).padStart(2, '0');
  const minutes = String(Math.floor(durationMs/1000/60) % 60).padStart(2, '0');
  const seconds = String(Math.floor(durationMs/1000) % 60).padStart(2, '0');
  const milliseconds = String(durationMs % 1000).padStart(3, '0');
  return (
    <span>
      { hours }:{ minutes }:{ seconds }:{ milliseconds }
    </span>
  );
};

const StopWatchInital: FC<{ requestStart: () => void }> = ({ requestStart }) => (
  <div>
    <h4 style={{ color: '#6b50fe' }}>Initial</h4>
    <Duration durationMs={0} />
    <div>
      <button onClick={requestStart}>Start</button>
    </div>
  </div>
);

const StopWatchRunning: FC<{
  requestStop: () => void;
  requestLap: (durationMs: number) => void;
  startTimeMs: number;
}> = ({ requestStop, startTimeMs, requestLap }) => {
  const durationMs = useNow() - startTimeMs;

  return(
    <div>
      <h4 style={{ color: '#34c0b0' }}>Running...</h4>
      <Duration durationMs={durationMs} />
      <div>
        <button onClick={requestStop}>Stop</button>
        <button onClick={() => requestLap(durationMs)}>Lap</button>
      </div>
    </div>
  );
};

const StopWatchPaused: FC<{
  durationMs: number;
  requestResume: () => void;
  requestReset: () => void;
}> = ({ durationMs, requestResume, requestReset }) => (
  <div>
    <h4 style={{ color: '#ec6980' }}>Stopped</h4>
    <Duration durationMs={durationMs} />
    <div>
      <button onClick={requestReset}>Reset</button>
      <button onClick={requestResume}>Resume</button>
    </div>
  </div>
);

function App() {
  const [ isStarted, setIsStarted ] = useState(false);
  const [ isPausing, setIsPausing ] = useState(false);
  const [lapTimeMs, setLapTimeMs] = useState<number[]>([]);
  const currentTimeMs = useNow();

  const [ startTimeMs, setStartTimeMs ] = React.useState(currentTimeMs);

  const requestStart = () => {
    setStartTimeMs(currentTimeMs);
    setIsStarted(true);
  };

  const requestStop = () => {
    setStartTimeMs( currentTimeMs - startTimeMs );
    setIsPausing(true);
  };

  const requestResume = () => {
    setStartTimeMs( currentTimeMs - startTimeMs );
    setIsPausing(false);
  };

  const requestReset = () => {
    setStartTimeMs(currentTimeMs);
    setIsStarted(false);
    setIsPausing(false);
    setLapTimeMs([]);
  };

  const requestLap = (durationMs: number) => {
    setLapTimeMs([...lapTimeMs, durationMs]);
  };

  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <code>Stopwatch</code>
        </p>
        {
          !isStarted && (
            <StopWatchInital requestStart={requestStart} />
          )
        }
        {
          isStarted && !isPausing && (
            <StopWatchRunning
              requestStop={requestStop}
              startTimeMs={startTimeMs}
              requestLap={requestLap}
            />
          )
        }

        {
          isPausing && isStarted && (
            <StopWatchPaused
              durationMs={startTimeMs}
              requestResume={requestResume}
              requestReset={requestReset}
            />
          )
        }
        {
         lapTimeMs.length > 0 && (
            <ul data-testid="laps">
              <p className="laps">Laps:</p>
              {
                lapTimeMs.map((lapTime, index) => (
                  <li key={index} data-testid={`lap-${index + 1}`}>
                    <Duration durationMs={lapTime} />
                  </li>
                ))
              }
            </ul>
          )
        }
      </div>
    </div>
  );
}

export default App;
