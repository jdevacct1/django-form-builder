import React from 'react';
import { FormBuilder as ReactFormBuilder } from "@react-form-builder/designer";
import { builderViewWithCss } from "@react-form-builder/components-rsuite";
import { LAYOUT } from '../constants/styles';
import { DjangoFormStorage } from '../services/formStorage';

/**
 * Form Builder Component
 * Wraps the React Form Builder with built-in actions extended for our backend
 */
const FormBuilder = () => {
  // Get form ID from URL configuration passed by Django template
  const formId = window.FORM_BUILDER_CONFIG?.formId || null;
  const formName = window.FORM_BUILDER_CONFIG?.formName || null;

  // Create an instance of our Django form storage with the form ID
  const formStorage = new DjangoFormStorage(formId);

  // Error boundary for form builder
  const handleError = (error) => {
    console.error('FormBuilder error:', error);
  };

  try {
    return (
      <div style={LAYOUT.formBuilder}>
        <ReactFormBuilder
          view={builderViewWithCss}
          formStorage={formStorage}
          formName={formName} // Pass form name to trigger form loading
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
