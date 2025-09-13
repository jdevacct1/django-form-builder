import React from "react";
import { FormBuilder } from "./components";
import { LAYOUT } from "./constants/styles";

/**
 * Main App Component
 * Simplified to work with FormBuilder's built-in storage
 */
function App() {
  return (
    <div style={LAYOUT.container}>
      <FormBuilder />
    </div>
  );
}

export default App;
