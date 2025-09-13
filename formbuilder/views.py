from django.shortcuts import render, get_object_or_404
from django.views.generic import TemplateView, ListView, DetailView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from django.urls import reverse
import json
from .models import Form


class FormBuilderView(TemplateView):
    template_name = "formbuilder/form_builder.html"

    def get_context_data(self, **kwargs):
        """
        Add form ID to context if provided in URL
        """
        context = super().get_context_data(**kwargs)

        # Get form_id from URL kwargs if present
        form_id = self.kwargs.get('form_id')

        if form_id:
            try:
                # Verify the form exists
                form = get_object_or_404(Form, id=form_id)
                context['form_id'] = form_id
                context['form_name'] = form.name
            except Exception as e:
                # If form doesn't exist, don't pass form_id
                context['form_id'] = None
        else:
            context['form_id'] = None

        return context


class FormsListView(ListView):
    """
    View to display a list of all saved forms
    """
    model = Form
    template_name = "formbuilder/forms_list.html"
    context_object_name = "forms"
    paginate_by = 20

    def get_queryset(self):
        """
        Get queryset with additional context
        """
        queryset = Form.objects.all()

        # Add component counts
        for form in queryset:
            form.component_count = form.get_component_count()
            form.component_types = form.get_component_types()

        return queryset

    def get_context_data(self, **kwargs):
        """
        Add additional context data
        """
        context = super().get_context_data(**kwargs)
        return context


class FormDetailView(DetailView):
    """
    View to display details of a specific form
    """
    model = Form
    template_name = "formbuilder/form_detail.html"
    context_object_name = "form"

    def get_context_data(self, **kwargs):
        """
        Add additional context data
        """
        context = super().get_context_data(**kwargs)
        form = self.get_object()

        # Get form details
        context['component_count'] = form.get_component_count()
        context['component_types'] = form.get_component_types()

        return context


class FormViewView(TemplateView):
    """
    View to render a form for viewing/submission
    """
    template_name = "formbuilder/form_view.html"

    def get_context_data(self, **kwargs):
        """
        Add form data to context for rendering
        """
        context = super().get_context_data(**kwargs)

        # Get form_id from URL kwargs
        form_id = self.kwargs.get('form_id')

        if form_id:
            try:
                # Get the form
                form = get_object_or_404(Form, id=form_id)
                context['form'] = form
                context['form_id'] = form_id
                context['form_name'] = form.name
            except Exception as e:
                context['form'] = None
                context['form_id'] = None
        else:
            context['form'] = None
            context['form_id'] = None

        return context


@method_decorator(csrf_exempt, name='dispatch')
class FormsAPIView(View):
    """
    API view to handle form CRUD operations
    """

    def get(self, request, form_id=None):
        """Get all forms or a specific form"""
        if form_id:
            try:
                form = Form.objects.get(id=form_id)
                return JsonResponse({
                    'id': form.id,
                    'name': form.name,
                    'schema': form.schema or {},
                    'created_at': form.created.isoformat(),
                    'updated_at': form.modified.isoformat(),
                    'is_active': form.is_active
                })
            except Form.DoesNotExist:
                return JsonResponse({'error': 'Form not found'}, status=404)
        else:
            forms = Form.objects.all()
            forms_data = []
            for form in forms:
                forms_data.append({
                    'id': form.id,
                    'name': form.name,
                    'schema': form.schema or {},
                    'created_at': form.created.isoformat(),
                    'updated_at': form.modified.isoformat(),
                    'is_active': form.is_active
                })
            return JsonResponse({'forms': forms_data})

    def post(self, request):
        """Create a new form"""
        try:
            data = json.loads(request.body)

            # Validate required fields
            if 'name' not in data:
                return JsonResponse({'error': 'Name is required'}, status=400)

            if 'schema' not in data:
                return JsonResponse({'error': 'Schema is required'}, status=400)

            # Create the form
            form = Form.objects.create(
                name=data['name'],
                schema=data['schema']
            )

            return JsonResponse({
                'id': form.id,
                'name': form.name,
                'schema': form.schema or {},
                'created_at': form.created.isoformat(),
                'updated_at': form.modified.isoformat(),
                'is_active': form.is_active
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def put(self, request, form_id):
        """Update an existing form"""
        try:
            form = Form.objects.get(id=form_id)
            data = json.loads(request.body)

            # Update fields if provided
            if 'name' in data:
                form.name = data['name']
            if 'schema' in data:
                form.schema = data['schema']
            if 'is_active' in data:
                form.is_active = data['is_active']

            form.save()

            return JsonResponse({
                'id': form.id,
                'name': form.name,
                'schema': form.schema or {},
                'created_at': form.created.isoformat(),
                'updated_at': form.modified.isoformat(),
                'is_active': form.is_active
            })

        except Form.DoesNotExist:
            return JsonResponse({'error': 'Form not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def delete(self, request, form_id):
        """Delete a form"""
        try:
            form = Form.objects.get(id=form_id)
            form.delete()
            return JsonResponse({'message': 'Form deleted successfully'})
        except Form.DoesNotExist:
            return JsonResponse({'error': 'Form not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


