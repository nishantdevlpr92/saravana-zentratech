import django_filters
from django.contrib.auth import get_user_model

User = get_user_model()

class UserFilter(django_filters.FilterSet):
    exclude_ids = django_filters.ModelMultipleChoiceFilter(
        field_name='id',
        queryset=User.objects.all(),
        exclude=True
    )

    class Meta:
        model = User
        fields = ['exclude_ids']
