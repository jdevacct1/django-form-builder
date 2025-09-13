import React from "react";
import { FormBuilder } from "./components";
import FormViewerComponent from "./components/FormViewer";
import { LAYOUT } from "./constants/styles";

/**
 * Main App Component
 * Renders either FormBuilder or FormViewer based on configuration
 */
function App() {
  // Check if we're in form view mode
  const isFormView = window.FORM_VIEW_CONFIG !== undefined;
  return (
    <div style={LAYOUT.container}>
      {isFormView ? <FormViewerComponent /> : <FormBuilder />}
    </div>
  );
}

export default App;
