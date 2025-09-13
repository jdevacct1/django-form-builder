# Django Form Builder

A full-stack form builder application built with Django and React using FormEngine (React Form Builder). This application allows users to create dynamic forms using a visual form builder interface, save them to a database, and render them for end users.

## Features

- **Visual Form Builder**: Drag-and-drop interface powered by FormEngine
- **Inline Form Naming**: Click-to-edit form names with real-time updates
- **Form Management**: Save, update, and manage form schemas with ID-based storage
- **Form Viewer**: Built-in form renderer for displaying forms to end users
- **RESTful API**: Complete API for form CRUD operations
- **Admin Interface**: Django admin interface for managing forms
- **URL-based Form Loading**: Load forms by ID through URL parameters
- **Schema Compatibility**: Handles both legacy and modern form schemas

## Key Technologies

- **Backend**: Django 4.2+ with Django REST Framework
- **Frontend**: React 18+ with FormEngine (React Form Builder)
- **Form Engine**: Professional form builder with drag-and-drop interface
- **Storage**: ID-based form storage with real-time name updates
- **Styling**: Custom CSS with responsive design
- **Database**: SQLite (development) / PostgreSQL (production ready)

## Recent Improvements

- ✅ **Inline Form Naming**: Click-to-edit form names with auto-save
- ✅ **Form Viewer**: Built-in form renderer for end users
- ✅ **URL-based Loading**: Load forms by ID through URL parameters
- ✅ **Schema Migration**: Automatic handling of legacy form schemas
- ✅ **Clean Interface**: Removed unnecessary statistics cards
- ✅ **FormEngine Integration**: Full integration with professional form builder
- ✅ **Real-time Updates**: Form names sync with form saves automatically

## Project Structure

```
django_form_builder/
├── django_form_builder/          # Django project settings
│   ├── settings/                 # Environment-specific settings
│   └── urls.py                   # Main URL configuration
├── formbuilder/                  # Main Django app
│   ├── models.py                 # Form model (FormSubmission removed)
│   ├── views.py                  # Views for forms, builder, and viewer
│   ├── urls.py                   # App URL configuration
│   ├── admin.py                  # Django admin configuration
│   ├── templates/                # HTML templates
│   │   ├── form_builder.html     # Form builder interface
│   │   ├── form_view.html        # Form viewer interface
│   │   ├── forms_list.html       # Forms list page
│   │   └── form_detail.html      # Form detail page
│   └── static/css/               # CSS stylesheets
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── App.jsx              # Main React component with routing
│   │   ├── components/
│   │   │   ├── FormBuilder.jsx   # Form builder component
│   │   │   ├── FormViewer.jsx    # Form viewer component
│   │   │   └── FormNameEditor.jsx # Inline form name editor
│   │   ├── services/
│   │   │   ├── api.js            # API service layer
│   │   │   └── formStorage.js    # FormEngine storage implementation
│   │   ├── config.js            # Configuration settings
│   │   └── constants/styles.js   # Style constants
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

The frontend is automatically built and served by Django's `runserver` command, so no additional setup is required for basic usage.

**For development and debugging:**

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server (optional):**
   ```bash
   npm run dev
   ```

   This will start the Vite development server at `http://localhost:5173` with hot reloading for debugging and development work.

**Note:** The Django server (`python manage.py runserver`) automatically handles the frontend build files, so the React app is accessible through Django at `http://localhost:8000`. Use `npm run dev` only if you need the development server features like hot reloading.

## URL Routes

### Main Views

- `GET /formbuilder/` - Form builder interface (new form)
- `GET /formbuilder/{id}/` - Form builder interface (edit existing form)
- `GET /formbuilder/{id}/view/` - Form viewer interface (render form)
- `GET /formbuilder/forms/` - Forms list page
- `GET /formbuilder/forms/{id}/` - Form detail page

### API Endpoints

- `GET /formbuilder/api/forms/` - Get all forms
- `GET /formbuilder/api/forms/{id}/` - Get specific form
- `POST /formbuilder/api/forms/` - Create new form
- `PUT /formbuilder/api/forms/{id}/` - Update form
- `DELETE /formbuilder/api/forms/{id}/` - Delete form

## Usage

### Creating a Form

1. Navigate to `http://localhost:8000/formbuilder/` (new form) or `http://localhost:8000/formbuilder/{id}/` (edit existing)
2. Click on the form name at the top to edit it inline
3. Drag and drop form components from the left panel
4. Configure component properties in the right panel
5. The form automatically saves as you work

### Viewing Forms

1. Navigate to `http://localhost:8000/formbuilder/{id}/view/` to see the rendered form
2. The form displays exactly as end users would see it
3. Form validation and submission handling are built-in

### Managing Forms

- Access the forms list at `http://localhost:8000/formbuilder/forms/`
- View form details, edit, or delete forms
- Access the Django admin interface at `http://localhost:8000/admin/` for advanced management

## Testing

### API Testing

Run the included test script to verify API functionality:

```bash
python test_api.py
```

This script will test all API endpoints and verify that forms can be created, retrieved, updated, and deleted.

### Manual Testing

1. Start the Django server: `python manage.py runserver`
2. Navigate to `http://localhost:8000/formbuilder/` to create a new form
3. Edit the form name by clicking on it
4. Add form components using the drag-and-drop interface
5. Navigate to `http://localhost:8000/formbuilder/forms/` to see your forms
6. Click "View Form" to see the rendered form
7. Click "Edit" to modify the form
8. Check the Django admin at `http://localhost:8000/admin/` to verify data

## Data Models

### Form Model

- `name`: Form name (CharField, max_length=255)
- `schema`: Form schema in JSON format (JSONField)
- `created`: Creation timestamp (DateTimeField, auto-created)
- `modified`: Last update timestamp (DateTimeField, auto-updated)
- `is_active`: Whether the form is active (BooleanField, default=True)

### Model Methods

- `get_component_count()`: Returns the number of components in the form
- `get_component_types()`: Returns a list of component types used in the form
- `get_schema()`: Returns the schema as a Python object

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
