from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile

def create_fake_image(size_mb=1, name="avatar.png", image_size=(100, 100), format="PNG"):
    """
    Creates an image in memory and returns a SimpleUploadedFile ready for upload
    """

    target_bytes = int(size_mb * 1024 * 1024)

    image = Image.new("RGB", image_size, color=(255, 0, 0))
    buffer = BytesIO()
    image.save(buffer, format=format)
    image_bytes = buffer.getvalue()

    if len(image_bytes) > target_bytes:
        raise ValueError("Target size smaller than image header")

    padding = b"\x00" * (target_bytes - len(image_bytes))
    final_bytes = image_bytes + padding

    fake_image = SimpleUploadedFile(
        name=name,
        content=final_bytes,
        content_type=f"image/{format.lower()}",
    )
    return fake_image
