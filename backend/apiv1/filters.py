import django_filters
from django.contrib.auth import get_user_model

User = get_user_model()


class UserFilter(django_filters.FilterSet):
    id__not = django_filters.BaseInFilter(field_name='id', exclude=True)

    class Meta:
        model = User
        fields = {
            'id': ['exact', 'in'],
            'username': ['exact']
        }
