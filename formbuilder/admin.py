from django.contrib import admin
from .models import Form


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
