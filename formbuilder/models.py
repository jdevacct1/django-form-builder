from django.db import models
from django.utils import timezone
from django_extensions.db.models import TimeStampedModel
import json


class Form(TimeStampedModel):
    """
    Model to store form schemas created by the form builder
    """
    name = models.CharField(max_length=255, help_text="Name of the form")
    schema = models.JSONField(help_text="Form schema in JSON format")
    is_active = models.BooleanField(default=True, help_text="Whether the form is active")

    class Meta:
        ordering = ['-created']
        verbose_name = "Form"
        verbose_name_plural = "Forms"

    def __str__(self):
        return self.name

    def get_schema(self):
        """
        Return the schema as a Python object
        """
        if isinstance(self.schema, str):
            return json.loads(self.schema)
        return self.schema

    def set_schema(self, schema_data):
        """
        Set the schema from a Python object
        """
        if isinstance(schema_data, str):
            self.schema = schema_data
        else:
            self.schema = json.dumps(schema_data)

    def get_component_count(self):
        """
        Get the number of components in the form schema
        Supports both old format (components directly in schema) and new format (components in form.children)
        """
        schema = self.get_schema()
        if not schema:
            return 0

        # New format: components are in form.children
        if 'form' in schema and 'children' in schema['form']:
            return len(schema['form']['children'])

        # Old format: components are directly in schema
        if 'components' in schema:
            return len(schema['components'])

        return 0

    def get_component_types(self):
        """
        Get a list of component types used in the form
        Supports both old format (components directly in schema) and new format (components in form.children)
        """
        schema = self.get_schema()
        if not schema:
            return []

        # New format: components are in form.children
        if 'form' in schema and 'children' in schema['form']:
            return list(set(component.get('type', 'unknown') for component in schema['form']['children']))

        # Old format: components are directly in schema
        if 'components' in schema:
            return list(set(component.get('type', 'unknown') for component in schema['components']))

        return []


class FormSubmission(TimeStampedModel):
    """
    Model to store form submissions
    """
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='submissions')
    data = models.JSONField(help_text="Submitted form data")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-created']
        verbose_name = "Form Submission"
        verbose_name_plural = "Form Submissions"

    def __str__(self):
        return f"Submission for {self.form.name} at {self.created}"

    @property
    def submitted_at(self):
        """
        Alias for created to maintain backward compatibility
        """
        return self.created
