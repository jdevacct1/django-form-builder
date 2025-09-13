from django.contrib import admin
from .models import Form, FormSubmission


@admin.register(Form)
class FormAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created', 'modified']
    list_filter = ['is_active', 'created']
    search_fields = ['name']
    readonly_fields = ['created', 'modified']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'is_active')
        }),
        ('Schema', {
            'fields': ('schema',)
        }),
        ('Timestamps', {
            'fields': ('created', 'modified'),
            'classes': ('collapse',)
        }),
    )


@admin.register(FormSubmission)
class FormSubmissionAdmin(admin.ModelAdmin):
    list_display = ['form', 'created', 'ip_address']
    list_filter = ['created', 'form']
    search_fields = ['form__name', 'ip_address']
    readonly_fields = ['created', 'modified']

    fieldsets = (
        ('Submission Details', {
            'fields': ('form', 'data')
        }),
        ('Metadata', {
            'fields': ('created', 'modified', 'ip_address', 'user_agent'),
            'classes': ('collapse',)
        }),
    )
