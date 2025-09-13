import React, { useState, useEffect } from 'react';
import { FormViewer } from "@react-form-builder/core";
import { viewWithCss } from "@react-form-builder/components-rsuite";
import { LAYOUT } from '../constants/styles';
import { DjangoFormStorage } from '../services/formStorage';

/**
 * Form Viewer Component
 * Renders a form for viewing and submission using FormEngine's FormViewer
 */
const FormViewerComponent = () => {
  // Get form ID from URL configuration passed by Django template
  const formId = window.FORM_VIEW_CONFIG?.formId || null;
  const formName = window.FORM_VIEW_CONFIG?.formName || null;

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create an instance of our Django form storage with the form ID
  const formStorage = new DjangoFormStorage(formId);

  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true);
        if (formId) {
          // Load the form data
          const formJson = await formStorage.getForm(formName);
          const parsedForm = JSON.parse(formJson);
          setFormData(parsedForm);
        }
      } catch (err) {
        console.error('Error loading form:', err);
        setError('Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId, formName]);

  const handleFormDataChange = (data) => {
    console.log('Form data changed:', data);
  };

  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
    // TODO: Handle form submission
    alert('Form submitted! (This is a demo - submission handling not implemented yet)');
  };

  if (loading) {
    return (
      <div style={LAYOUT.formBuilder}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Loading Form...</h3>
          <p>Please wait while we load the form.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={LAYOUT.formBuilder}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Error Loading Form</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div style={LAYOUT.formBuilder}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Form Not Found</h3>
          <p>The requested form could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={LAYOUT.formBuilder}>
      <div style={{ padding: '20px' }}>
        <h1 style={{ marginBottom: '20px', color: '#213547' }}>
          {formName || 'Form'}
        </h1>
        <FormViewer
          view={viewWithCss}
          getForm={() => JSON.stringify(formData)}
          formName={formName}
          onFormDataChange={handleFormDataChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default FormViewerComponent;
