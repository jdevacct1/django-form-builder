"""
Template tags for handling Vite assets.
"""
from django import template
from ..utils import get_vite_asset_url

register = template.Library()


@register.simple_tag
def vite_asset(asset_type):
    """
    Template tag to get the URL for a Vite asset.

    Usage:
        {% load vite_assets %}
        <script src="{% vite_asset 'js' %}"></script>
        <link rel="stylesheet" href="{% vite_asset 'css' %}">
    """
    return get_vite_asset_url(asset_type)


@register.inclusion_tag('formbuilder/vite_assets.html')
def vite_assets():
    """
    Inclusion tag that renders both JS and CSS assets.

    Usage:
        {% load vite_assets %}
        {% vite_assets %}
    """
    return {
        'js_url': get_vite_asset_url('js'),
        'css_url': get_vite_asset_url('css'),
    }
