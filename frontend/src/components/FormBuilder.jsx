import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FormBuilder as ReactFormBuilder } from "@react-form-builder/designer";
import { builderViewWithCss } from "@react-form-builder/components-rsuite";
import { LAYOUT } from '../constants/styles';
import { DjangoFormStorage } from '../services/formStorage';
import FormNameEditor from './FormNameEditor';

/**
 * Form Builder Component
 * Wraps the React Form Builder with built-in actions extended for our backend
 */
const FormBuilder = () => {
  // Get form ID from URL configuration passed by Django template
  const formId = window.FORM_BUILDER_CONFIG?.formId || null;
  const initialFormName = window.FORM_BUILDER_CONFIG?.formName || null;

  // State for form name
  const [currentFormName, setCurrentFormName] = useState(initialFormName);

  // Ref to store the current form name for the getter function
  const currentFormNameRef = useRef(initialFormName);

  // Update the ref whenever the form name changes
  useEffect(() => {
    currentFormNameRef.current = currentFormName;
  }, [currentFormName]);

  // Handle form name changes
  const handleFormNameChange = (newName) => {
    setCurrentFormName(newName);
  };

  // Create an instance of our Django form storage with the form ID and name getter
  // Use useMemo to ensure the formStorage gets the latest form name
  const formStorage = useMemo(() => {
    return new DjangoFormStorage(formId, () => {
      return currentFormNameRef.current;
    });
  }, [formId]);

  // Error boundary for form builder
  const handleError = (error) => {
    console.error('FormBuilder error:', error);
  };

  try {
    return (
      <div style={LAYOUT.formBuilder}>
        <FormNameEditor
          formId={formId}
          initialName={initialFormName}
          onNameChange={handleFormNameChange}
        />
        <ReactFormBuilder
          view={builderViewWithCss}
          formStorage={formStorage}
          formName={currentFormName} // Pass current form name to trigger form loading
        />
      </div>
    );
  } catch (error) {
    handleError(error);
    return (
      <div style={LAYOUT.formBuilder}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Form Builder Error</h3>
          <p>There was an error initializing the form builder.</p>
          <p>Please refresh the page and try again.</p>
        </div>
      </div>
    );
  }
};

export default FormBuilder;
