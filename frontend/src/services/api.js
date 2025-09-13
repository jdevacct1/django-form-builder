/**
 * API Service
 * Centralized API service for making HTTP requests
 */

import { getApiEndpoint, defaultFetchConfig, logApiCall, config } from '../config';

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Fetch response
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = getApiEndpoint(endpoint);
  const config = {
    ...defaultFetchConfig,
    ...options,
  };

  logApiCall(url, config.method || 'GET', config.body);

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Forms API service
 */
export const formsApi = {
  /**
   * Get all forms
   * @returns {Promise} List of forms
   */
  getAll: async () => {
    const response = await apiRequest(config.API_ENDPOINTS.FORMS.LIST);
    return response.json();
  },

  /**
   * Get a specific form by ID
   * @param {string|number} id - Form ID
   * @returns {Promise} Form data
   */
  getById: async (id) => {
    const response = await apiRequest(config.API_ENDPOINTS.FORMS.DETAIL(id));
    return response.json();
  },

  /**
   * Create a new form
   * @param {object} formData - Form data
   * @returns {Promise} Created form
   */
  create: async (formData) => {
    const response = await apiRequest(config.API_ENDPOINTS.FORMS.CREATE, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    return response.json();
  },

  /**
   * Update an existing form
   * @param {string|number} id - Form ID
   * @param {object} formData - Updated form data
   * @returns {Promise} Updated form
   */
  update: async (id, formData) => {
    const response = await apiRequest(config.API_ENDPOINTS.FORMS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
    return response.json();
  },

  /**
   * Delete a form
   * @param {string|number} id - Form ID
   * @returns {Promise} Deletion response
   */
  delete: async (id) => {
    const response = await apiRequest(config.API_ENDPOINTS.FORMS.DELETE(id), {
      method: 'DELETE',
    });
    return response;
  },
};


/**
 * Generic API service for custom endpoints
 */
export const api = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} Response data
   */
  get: async (endpoint) => {
    const response = await apiRequest(endpoint);
    return response.json();
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request data
   * @returns {Promise} Response data
   */
  post: async (endpoint, data) => {
    const response = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request data
   * @returns {Promise} Response data
   */
  put: async (endpoint, data) => {
    const response = await apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} Response
   */
  delete: async (endpoint) => {
    const response = await apiRequest(endpoint, {
      method: 'DELETE',
    });
    return response;
  },
};

export default api;
