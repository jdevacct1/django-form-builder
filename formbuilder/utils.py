"""
Utility functions for the formbuilder app.
"""
import os
import re
from pathlib import Path
from django.conf import settings


def get_vite_assets():
    """
    Parse the Vite-generated index.html to extract the correct asset filenames.
    Returns a dict with 'js' and 'css' keys containing the asset URLs.
    """
    # Path to the Vite-generated index.html
    vite_index_path = Path(settings.BASE_DIR) / "frontend" / "dist" / "index.html"

    if not vite_index_path.exists():
        return {'js': '', 'css': ''}

    try:
        with open(vite_index_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract JS file
        js_match = re.search(r'<script[^>]*src="([^"]*\.js)"', content)
        js_file = js_match.group(1) if js_match else ''

        # Extract CSS file
        css_match = re.search(r'<link[^>]*href="([^"]*\.css)"', content)
        css_file = css_match.group(1) if css_match else ''

        return {
            'js': js_file,
            'css': css_file
        }
    except Exception as e:
        # Log the error but don't crash
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error parsing Vite assets: {e}")
        return {'js': '', 'css': ''}


def get_vite_asset_url(asset_type):
    """
    Get the URL for a specific asset type (js or css).
    """
    assets = get_vite_assets()
    asset_path = assets.get(asset_type, '')

    if asset_path:
        # Remove leading slash if present and add static URL prefix
        asset_path = asset_path.lstrip('/')
        return f"{settings.STATIC_URL}{asset_path}"

    return ''
