// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Countries from "./Countries";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/countries" element={<Countries />} />
      </Routes>
    </Router>
  );
}

export default App;
