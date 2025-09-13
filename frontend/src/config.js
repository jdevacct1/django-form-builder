/**
 * Frontend Configuration
 * Centralized configuration for API endpoints and other settings
 */

// Environment-based configuration
const config = {
  // API Base URL - can be overridden by environment variables
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',

  // API Endpoints
  API_ENDPOINTS: {
    // Forms endpoints
    FORMS: {
      LIST: '/formbuilder/api/forms/',
      CREATE: '/formbuilder/api/forms/',
      DETAIL: (id) => `/formbuilder/api/forms/${id}/`,
      UPDATE: (id) => `/formbuilder/api/forms/${id}/`,
      DELETE: (id) => `/formbuilder/api/forms/${id}/`,
    },

    // Form submissions endpoints
    SUBMISSIONS: {
      LIST: '/formbuilder/api/submissions/',
      CREATE: '/formbuilder/api/submissions/',
      DETAIL: (id) => `/formbuilder/api/submissions/${id}/`,
      UPDATE: (id) => `/formbuilder/api/submissions/${id}/`,
      DELETE: (id) => `/formbuilder/api/submissions/${id}/`,
      BY_FORM: (formId) => `/formbuilder/api/forms/${formId}/submissions/`,
    },

    // Authentication endpoints (if needed in future)
    AUTH: {
      LOGIN: '/api/auth/login/',
      LOGOUT: '/api/auth/logout/',
      REGISTER: '/api/auth/register/',
      PROFILE: '/api/auth/profile/',
    },
  },

  // Default headers for API requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },

  // Request timeout (in milliseconds)
  REQUEST_TIMEOUT: 10000,

  // Development settings
  DEV: {
    ENABLE_LOGGING: import.meta.env.DEV || false,
    MOCK_API: import.meta.env.VITE_MOCK_API === 'true' || false,
  },
};

/**
 * Helper function to build full API URLs
 * @param {string} endpoint - The API endpoint
 * @returns {string} Full URL with base URL
 */
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${config.API_BASE_URL}/${cleanEndpoint}`;
};

/**
 * Helper function to get API endpoint with parameters
 * @param {string|function} endpoint - The endpoint path or function
 * @param {...any} params - Parameters for the endpoint function
 * @returns {string} Full API URL
 */
export const getApiEndpoint = (endpoint, ...params) => {
  const path = typeof endpoint === 'function' ? endpoint(...params) : endpoint;
  return buildApiUrl(path);
};

/**
 * Default fetch configuration
 */
export const defaultFetchConfig = {
  headers: config.DEFAULT_HEADERS,
  timeout: config.REQUEST_TIMEOUT,
};

/**
 * Log API calls in development
 */
export const logApiCall = (url, method, data = null) => {
  if (config.DEV.ENABLE_LOGGING) {
    console.log(`[API] ${method} ${url}`, data ? { data } : '');
  }
};

export { config };
export default config;
