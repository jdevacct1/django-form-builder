from django.shortcuts import render, get_object_or_404
from django.views.generic import TemplateView, ListView, DetailView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from django.urls import reverse
import json
from .models import Form, FormSubmission


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

        # Add submission counts
        for form in queryset:
            form.submission_count = form.submissions.count()
            form.component_count = form.get_component_count()
            form.component_types = form.get_component_types()

        return queryset

    def get_context_data(self, **kwargs):
        """
        Add additional context data
        """
        context = super().get_context_data(**kwargs)
        context['total_forms'] = Form.objects.count()
        context['active_forms'] = Form.objects.filter(is_active=True).count()
        context['total_submissions'] = FormSubmission.objects.count()
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

        # Get recent submissions
        context['recent_submissions'] = form.submissions.all()[:10]
        context['submission_count'] = form.submissions.count()
        context['component_count'] = form.get_component_count()
        context['component_types'] = form.get_component_types()

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
            print(f"Received data: {data}")

            # Validate required fields
            if 'name' not in data:
                return JsonResponse({'error': 'Name is required'}, status=400)

            if 'schema' not in data:
                return JsonResponse({'error': 'Schema is required'}, status=400)

            # Create the form
            print(f"Creating form with name: {data['name']}, schema: {data['schema']}")
            form = Form.objects.create(
                name=data['name'],
                schema=data['schema']
            )
            print(f"Form created successfully with ID: {form.id}")

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


@method_decorator(csrf_exempt, name='dispatch')
class FormSubmissionsAPIView(View):
    """
    API view to handle form submissions
    """

    def get(self, request, form_id=None):
        """Get submissions for a specific form or all submissions"""
        if form_id:
            try:
                form = Form.objects.get(id=form_id)
                submissions = form.submissions.all()
            except Form.DoesNotExist:
                return JsonResponse({'error': 'Form not found'}, status=404)
        else:
            submissions = FormSubmission.objects.all()

        submissions_data = []
        for submission in submissions:
            submissions_data.append({
                'id': submission.id,
                'form_id': submission.form.id,
                'form_name': submission.form.name,
                'data': submission.data,
                'submitted_at': submission.submitted_at.isoformat(),
                'ip_address': submission.ip_address,
                'user_agent': submission.user_agent
            })

        return JsonResponse({'submissions': submissions_data})

    def post(self, request):
        """Create a new form submission"""
        try:
            data = json.loads(request.body)

            # Validate required fields
            if 'form_id' not in data:
                return JsonResponse({'error': 'form_id is required'}, status=400)

            if 'data' not in data:
                return JsonResponse({'error': 'data is required'}, status=400)

            # Get the form
            try:
                form = Form.objects.get(id=data['form_id'])
            except Form.DoesNotExist:
                return JsonResponse({'error': 'Form not found'}, status=404)

            # Create the submission
            submission = FormSubmission.objects.create(
                form=form,
                data=data['data'],
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )

            return JsonResponse({
                'id': submission.id,
                'form_id': submission.form.id,
                'form_name': submission.form.name,
                'data': submission.data,
                'submitted_at': submission.submitted_at.isoformat(),
                'ip_address': submission.ip_address,
                'user_agent': submission.user_agent
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def get_client_ip(self, request):
        """Get the client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
