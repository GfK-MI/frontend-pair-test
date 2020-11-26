import React from "react";

import "./App.css";

import LaunchList from "../LaunchList";

function App(): React.ReactElement {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SpaceX Launch Xplorer</h1>
      </header>
      <main className="App-main">
        <h1>Past Launches</h1>
        <p>List of past SpaceX launches</p>
        <LaunchList />
      </main>
    </div>
  );
}

export default App;
