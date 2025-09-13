/**
 * Django Form Storage Service
 * Provides form storage using Django backend APIs
 */

import { formsApi } from './api';

/**
 * Django form storage class that implements IFormStorage interface
 * Uses Django backend APIs for form operations
 * Works directly with form IDs from URL parameters
 */
export class DjangoFormStorage {
  constructor(formId = null, getFormName = null) {
    this.formId = formId;
    this.getFormName = getFormName; // Function to get current form name
  }

  async getFormNames() {
    try {
      const response = await formsApi.getAll();
      // Django API returns {forms: [...]}, so we need to access the forms array
      const forms = response.forms || [];

      // Return array of strings as expected by React Form Builder
      return forms.map(form => form.name);
    } catch (error) {
      console.error('Error fetching form names:', error);
      return [];
    }
  }

  async removeForm(formName) {
    try {
      // For now, we'll need to find the form by name since the library expects names
      const response = await formsApi.getAll();
      const forms = response.forms || [];
      const form = forms.find(f => f.name === formName);

      if (!form) {
        console.error('Form not found:', formName);
        return false;
      }

      await formsApi.delete(form.id);
      return true;
    } catch (error) {
      console.error('Error removing form:', error);
      return false;
    }
  }

  async getForm(formName, options) {
    const emptyForm = {
      "version": "1",
      "tooltipType": "RsTooltip",
      "modalType": "RsModal",
      "form": {
        "key": "Screen",
        "type": "Screen",
        "props": {},
        "children": []
      },
      "localization": {},
      "languages": [
        {
          "code": "en",
          "dialect": "US",
          "name": "English",
          "description": "American English",
          "bidi": "ltr"
        }
      ],
      "defaultLanguage": "en-US"
    };

    // If we have a formId from URL, use it directly
    if (this.formId) {
      try {
        const formData = await formsApi.getById(this.formId);
        if (formData && formData.schema) {
          // Check if this is the old format and transform it
          const schema = formData.schema;
          if (schema.components && !schema.form) {
            // Old format: transform to React Form Builder format
            const transformedSchema = {
              "version": "1",
              "tooltipType": "RsTooltip",
              "modalType": "RsModal",
              "form": {
                "key": "Screen",
                "type": "Screen",
                "props": {},
                "children": schema.components || []
              },
              "localization": schema.localization || {},
              "languages": [
                {
                  "code": "en",
                  "dialect": "US",
                  "name": "English",
                  "description": "American English",
                  "bidi": "ltr"
                }
              ],
              "defaultLanguage": "en-US"
            };
            return JSON.stringify(transformedSchema);
          } else {
            // New format: return as-is
            return JSON.stringify(schema);
          }
        }
      } catch (error) {
        console.error('Error fetching form by ID:', error);
      }
    }

    // If no formId or formName is provided, return empty form
    if (!formName) {
      return JSON.stringify(emptyForm);
    }

    // Fallback: find form by name (for compatibility with library's form management)
    try {
      const response = await formsApi.getAll();
      const forms = response.forms || [];
      const form = forms.find(f => f.name === formName);

      if (form) {
        const formData = await formsApi.getById(form.id);
        if (formData && formData.schema) {
          return JSON.stringify(formData.schema);
        }
      }
    } catch (error) {
      console.error('Error fetching form by name:', error);
    }

    return JSON.stringify(emptyForm);
  }

  async saveForm(formName, formValue) {
    try {
      const formBuilderSchema = JSON.parse(formValue);

      // Always prioritize the getter function if available, otherwise use the passed formName
      const currentFormName = this.getFormName ? this.getFormName() : formName;

      const formData = {
        schema: formBuilderSchema,
        name: currentFormName || 'Untitled Form'
      };

      if (this.formId) {
        // Update existing form using ID from URL
        await formsApi.update(this.formId, formData);
      } else {
        // Create new form
        await formsApi.create(formData);
      }

      return true;
    } catch (error) {
      console.error('Error saving form:', error);
      return false;
    }
  }
}

export default DjangoFormStorage;
