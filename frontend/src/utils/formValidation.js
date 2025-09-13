/**
 * Form validation utilities
 * Centralized validation logic for form builder
 */

/**
 * Validates a form name
 * @param {string} formName - The form name to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateFormName = (formName) => {
  if (!formName || typeof formName !== 'string') {
    return {
      isValid: false,
      error: 'Form name is required'
    };
  }

  const trimmedName = formName.trim();

  if (trimmedName.length === 0) {
    return {
      isValid: false,
      error: 'Form name cannot be empty'
    };
  }

  if (trimmedName.length < 3) {
    return {
      isValid: false,
      error: 'Form name must be at least 3 characters long'
    };
  }

  if (trimmedName.length > 255) {
    return {
      isValid: false,
      error: 'Form name cannot exceed 255 characters'
    };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Form name contains invalid characters'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates a form schema
 * @param {Object} schema - The form schema to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateFormSchema = (schema) => {
  if (!schema || typeof schema !== 'object') {
    return {
      isValid: false,
      error: 'Form schema is required'
    };
  }

  if (!schema.components || !Array.isArray(schema.components)) {
    return {
      isValid: false,
      error: 'Form schema must have a components array'
    };
  }

  if (schema.components.length === 0) {
    return {
      isValid: false,
      error: 'Please add at least one form component'
    };
  }

  // Validate each component
  for (let i = 0; i < schema.components.length; i++) {
    const component = schema.components[i];

    if (!component || typeof component !== 'object') {
      return {
        isValid: false,
        error: `Component ${i + 1} is invalid`
      };
    }

    if (!component.key || typeof component.key !== 'string') {
      return {
        isValid: false,
        error: `Component ${i + 1} must have a valid key`
      };
    }

    if (!component.type || typeof component.type !== 'string') {
      return {
        isValid: false,
        error: `Component ${i + 1} must have a valid type`
      };
    }
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates the complete form data before saving
 * @param {string} formName - The form name
 * @param {Object} schema - The form schema
 * @returns {Object} Validation result with isValid and errors array
 */
export const validateFormData = (formName, schema) => {
  const errors = [];

  const nameValidation = validateFormName(formName);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.error);
  }

  const schemaValidation = validateFormSchema(schema);
  if (!schemaValidation.isValid) {
    errors.push(schemaValidation.error);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizes a form name for display
 * @param {string} formName - The form name to sanitize
 * @returns {string} Sanitized form name
 */
export const sanitizeFormName = (formName) => {
  if (!formName || typeof formName !== 'string') {
    return 'New form';
  }

  return formName.trim() || 'New form';
};

/**
 * Checks if a form schema has any required fields
 * @param {Object} schema - The form schema to check
 * @returns {boolean} True if schema has required fields
 */
export const hasRequiredFields = (schema) => {
  if (!schema || !schema.components || !Array.isArray(schema.components)) {
    return false;
  }

  return schema.components.some(component =>
    component.validate && component.validate.required === true
  );
};

/**
 * Gets a summary of the form schema
 * @param {Object} schema - The form schema to summarize
 * @returns {Object} Schema summary with component count and types
 */
export const getSchemaSummary = (schema) => {
  if (!schema || !schema.components || !Array.isArray(schema.components)) {
    return {
      componentCount: 0,
      componentTypes: [],
      hasRequiredFields: false
    };
  }

  const componentTypes = [...new Set(schema.components.map(c => c.type))];

  return {
    componentCount: schema.components.length,
    componentTypes,
    hasRequiredFields: hasRequiredFields(schema)
  };
};
