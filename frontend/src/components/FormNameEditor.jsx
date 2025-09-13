import React, { useState, useEffect } from 'react';
import { formsApi } from '../services/api';

/**
 * Inline Form Name Editor Component
 * Allows users to edit the form name with inline editing functionality
 */
const FormNameEditor = ({ formId, initialName, onNameChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState(initialName || 'Untitled Form');
  const [tempName, setTempName] = useState(formName);
  const [isLoading, setIsLoading] = useState(false);

  // Update local state when initialName changes
  useEffect(() => {
    setFormName(initialName || 'Untitled Form');
    setTempName(initialName || 'Untitled Form');
  }, [initialName]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempName(formName);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempName(formName);
  };

  const handleSave = async () => {
    if (tempName.trim() === '') {
      setTempName('Untitled Form');
      return;
    }

    setIsLoading(true);
    try {
      if (formId) {
        // Update existing form name
        await formsApi.update(formId, { name: tempName.trim() });
      } else {
        // For new forms, we'll handle this when the form is saved
        // For now, just update the local state
      }

      setFormName(tempName.trim());
      setIsEditing(false);

      // Notify parent component of name change
      if (onNameChange) {
        onNameChange(tempName.trim());
      }
    } catch (error) {
      console.error('Error updating form name:', error);
      // Revert on error
      setTempName(formName);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    // Auto-save on blur
    if (tempName.trim() !== formName) {
      handleSave();
    } else {
      setIsEditing(false);
    }
  };

  const containerStyle = {
    padding: '20px 20px 10px 20px',
    borderBottom: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px 8px 0 0',
  };

  const displayStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#213547',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '2px solid transparent',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '40px',
  };

  const inputStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#213547',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '2px solid #007bff',
    outline: 'none',
    backgroundColor: 'white',
    width: '100%',
    boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
  };

  const editIconStyle = {
    fontSize: '0.9rem',
    color: '#6c757d',
    marginLeft: '8px',
    opacity: 0.7,
  };

  const loadingStyle = {
    fontSize: '0.9rem',
    color: '#6c757d',
    marginLeft: '8px',
  };

  return (
    <div style={containerStyle}>
      {isEditing ? (
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={inputStyle}
          autoFocus
          disabled={isLoading}
        />
      ) : (
        <div style={displayStyle} onClick={handleEdit}>
          <span>{formName}</span>
          {isLoading ? (
            <span style={loadingStyle}>Saving...</span>
          ) : (
            <span style={editIconStyle}>✏️ Click to edit</span>
          )}
        </div>
      )}
    </div>
  );
};

export default FormNameEditor;
