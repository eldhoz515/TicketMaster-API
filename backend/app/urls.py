from django.urls import path

from . import views

urlpatterns = [
    path("suggest", views.Suggest.as_view(), name="suggest"),
    path("search", views.Search.as_view(), name="search"),
    path("eventDetails", views.EventDetails.as_view(), name="eventDetails"),
]
