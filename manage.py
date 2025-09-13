#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import subprocess
import pathlib


def newest_mtime_in_dir(path: pathlib.Path) -> float:
    """Return the most recent modification time (mtime) of any file in a directory tree."""
    latest = 0
    if not path.exists():
        return 0
    for p in path.rglob("*"):
        if p.is_file():
            mtime = p.stat().st_mtime
            if mtime > latest:
                latest = mtime
    return latest


def maybe_build_frontend():
    """Check if frontend needs rebuilding, and run npm build if so."""
    base_dir = pathlib.Path(__file__).resolve().parent
    frontend_src = base_dir / "frontend" / "src"
    # Support both Vite (dist) and CRA (build)
    frontend_dist = (base_dir / "frontend" / "dist"
                     if (base_dir / "frontend" / "dist").exists()
                     else base_dir / "frontend" / "build")

    src_mtime = newest_mtime_in_dir(frontend_src)
    dist_mtime = newest_mtime_in_dir(frontend_dist)

    if src_mtime > dist_mtime:
        print("⚡ Frontend changes detected — running npm build...")
        try:
            subprocess.run(["npm", "run", "build"], cwd=base_dir / "frontend", check=True)
        except Exception as e:
            print("⚠️ Failed to build frontend:", e)
    else:
        print("✅ Frontend up-to-date — skipping build")


def main():
    """Run administrative tasks."""
    # Set default environment to development if not specified
    environment = os.environ.get('DJANGO_ENV', 'development')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'django_form_builder.settings.{environment}')

    if len(sys.argv) > 1 and sys.argv[1] == "runserver":
        maybe_build_frontend()

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
