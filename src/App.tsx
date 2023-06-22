import React from 'react';

import './App.css';

import RoverList from './RoverList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>NASA Mars Mission Photos</h3>
      </header>
      <main>
        <RoverList/>
      </main>
    </div>
  );
}

export default App;
