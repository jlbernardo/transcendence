import mimetypes
from django.http import FileResponse, Http404
from django.conf import settings
from pathlib import Path

def media_serve(request, path):
    file_path = Path(settings.MEDIA_ROOT) / path

    if not file_path.exists():
        raise Http404()

    mime_type, _ = mimetypes.guess_type(str(file_path))
    mime_type = mime_type or "application/octet-stream"

    response = FileResponse(
        open(file_path, "rb"),
        content_type=mime_type
    )

    # ngrok respects explicit headers
    response["Content-Disposition"] = "inline"
    response["X-Content-Type-Options"] = "nosniff"

    return response