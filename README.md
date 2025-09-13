# Django Form Builder

A full-stack form builder application built with Django and React. This application allows users to create dynamic forms using a visual form builder interface and save them to a database.

## Features

- **Visual Form Builder**: Drag-and-drop interface for creating forms
- **Form Management**: Save, update, and manage form schemas
- **Form Submissions**: Collect and store form submissions
- **RESTful API**: Complete API for form and submission management
- **Admin Interface**: Django admin interface for managing forms and submissions

## Project Structure

```
django_form_builder/
├── django_form_builder/          # Django project settings
│   ├── settings/                 # Environment-specific settings
│   └── urls.py                   # Main URL configuration
├── formbuilder/                  # Main Django app
│   ├── models.py                 # Form and FormSubmission models
│   ├── views.py                  # API views for forms and submissions
│   ├── urls.py                   # App URL configuration
│   ├── admin.py                  # Django admin configuration
│   └── templates/                # HTML templates
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   ├── services/api.js       # API service layer
│   │   └── config.js             # Configuration settings
│   └── package.json              # Frontend dependencies
└── requirements.txt              # Python dependencies
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup (Django)

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

4. **Start the Django development server:**
   ```bash
   python manage.py runserver
   ```

The Django server will be available at `http://localhost:8000`

### Frontend Setup (React)

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The React app will be available at `http://localhost:5173`

## API Endpoints

### Forms API

- `GET /formbuilder/api/forms/` - Get all forms
- `GET /formbuilder/api/forms/{id}/` - Get specific form
- `POST /formbuilder/api/forms/` - Create new form
- `PUT /formbuilder/api/forms/{id}/` - Update form
- `DELETE /formbuilder/api/forms/{id}/` - Delete form

### Submissions API

- `GET /formbuilder/api/submissions/` - Get all submissions
- `GET /formbuilder/api/forms/{id}/submissions/` - Get submissions for a form
- `POST /formbuilder/api/submissions/` - Create new submission

## Usage

### Creating a Form

1. Open the form builder interface at `http://localhost:5173`
2. Enter a form name in the input field
3. Drag and drop form components from the left panel
4. Configure component properties in the right panel
5. Click "Save form" to save the form schema to the database

### Managing Forms

- Access the Django admin interface at `http://localhost:8000/admin/`
- View, edit, and delete forms and submissions
- Monitor form usage and submission data

## Testing

### API Testing

Run the included test script to verify API functionality:

```bash
python test_api.py
```

This script will test all API endpoints and verify that forms can be created, retrieved, updated, and that submissions can be created and retrieved.

### Manual Testing

1. Start both Django and React servers
2. Open the form builder interface
3. Create a form with some components
4. Save the form
5. Check the Django admin to verify the form was saved
6. Test form submissions using the API

## Data Models

### Form Model

- `name`: Form name (CharField)
- `schema`: Form schema in JSON format (JSONField)
- `created_at`: Creation timestamp (DateTimeField)
- `updated_at`: Last update timestamp (DateTimeField)
- `is_active`: Whether the form is active (BooleanField)

### FormSubmission Model

- `form`: Reference to the form (ForeignKey)
- `data`: Submitted form data (JSONField)
- `submitted_at`: Submission timestamp (DateTimeField)
- `ip_address`: Submitter's IP address (GenericIPAddressField)
- `user_agent`: Submitter's user agent (TextField)

## Configuration

### Frontend Configuration

The frontend configuration is managed in `frontend/src/config.js`:

- `API_BASE_URL`: Base URL for API requests (default: http://localhost:8000)
- `API_ENDPOINTS`: Endpoint definitions for all API calls
- `DEFAULT_HEADERS`: Default HTTP headers for API requests

### Environment Variables

You can override the API base URL using environment variables:

```bash
VITE_API_BASE_URL=http://your-api-server.com npm run dev
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure `django-cors-headers` is installed and configured
2. **API Connection Issues**: Verify the API_BASE_URL in frontend config
3. **Database Issues**: Run migrations if you see database-related errors
4. **Port Conflicts**: Make sure ports 8000 (Django) and 5173 (React) are available

### Debug Mode

Enable debug logging in the frontend by setting:

```bash
VITE_DEBUG=true npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
