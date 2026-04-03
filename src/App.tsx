import React from 'react';
import TimeTracker from './components/TimeTracker';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <main className="App__main">
        <TimeTracker />
      </main>
      <footer className="App__footer">
        <a href="https://www.slackersoftware.com/" target="_blank" rel="noreferrer">Slacker Software</a>
        |
        <a href="https://www.slackersoftware.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
      </footer>
    </div>
  );
}

export default App;
