from django.db import models
from django.contrib.auth.models import User
from PIL import Image, ImageDraw, ImageFont
import os
from io import BytesIO
from django.core.files.base import ContentFile

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    image = models.ImageField(upload_to='profile_pics', blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    def save(self, *args, **kwargs):
        # Check if this is a new profile (no pk yet) and no image is provided
        is_new = self.pk is None
        
        if is_new and not self.image:
            # Auto-generate avatar before first save
            initials = self.user.username[:2].upper()
            img = Image.new('RGB', (300, 300), color=(100, 100, 255))  # Background color

            draw = ImageDraw.Draw(img)
            try:
                font = ImageFont.truetype("arial.ttf", 120)
            except IOError:
                font = ImageFont.load_default()

            bbox = draw.textbbox((0, 0), initials, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]

            # Center the text
            x = (300 - text_width) / 2
            y = (300 - text_height) / 2

            draw.text((x, y), initials, fill='white', font=font)

            # Save to in-memory file
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            image_name = f"{self.user.username}_avatar.png"
            self.image.save(image_name, ContentFile(buffer.getvalue()), save=False)
            buffer.close()
        
        # Save the profile (only once)
        super().save(*args, **kwargs)
        
        # Handle image resizing for existing images (if user uploads later)
        if self.image and hasattr(self.image, 'path'):
            try:
                img = Image.open(self.image.path)
                if img.height > 300 or img.width > 300:
                    output_size = (300, 300)
                    img.thumbnail(output_size)
                    img.save(self.image.path)
            except (IOError, OSError):
                # Handle cases where image file doesn't exist or is corrupted
                pass