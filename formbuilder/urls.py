from django.urls import path
from .views import (
    FormBuilderView,
    FormsListView,
    FormDetailView,
    FormsAPIView,
    FormSubmissionsAPIView
)

urlpatterns = [
    # Main views
    path("", FormBuilderView.as_view(), name="form_builder"),
    path("<int:form_id>/", FormBuilderView.as_view(), name="form_builder_with_id"),
    path("forms/", FormsListView.as_view(), name="forms_list"),
    path("forms/<int:pk>/", FormDetailView.as_view(), name="form_detail"),

    # API endpoints
    path("api/forms/", FormsAPIView.as_view(), name="forms_api"),
    path("api/forms/<int:form_id>/", FormsAPIView.as_view(), name="forms_api_detail"),
    path("api/submissions/", FormSubmissionsAPIView.as_view(), name="submissions_api"),
    path("api/forms/<int:form_id>/submissions/", FormSubmissionsAPIView.as_view(), name="form_submissions_api"),
]
