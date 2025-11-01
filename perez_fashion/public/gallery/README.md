# Gallery Images Directory

This directory stores the before/after images for the gallery page.

## How to Add Images

1. **Upload your images to this directory** (`/public/gallery/`)
   - Recommended format: JPG or PNG
   - Recommended size: 600x800px for optimal display
   - Name files descriptively: e.g., `wedding-dress-before.jpg`, `wedding-dress-after.jpg`

2. **Reference images in the admin dashboard** (`/admin`)
   - Login with admin password
   - In the "Before Image URL" field, enter: `/gallery/wedding-dress-before.jpg`
   - In the "After Image URL" field, enter: `/gallery/wedding-dress-after.jpg`

3. **Image Optimization Tips**:
   - Keep file sizes under 500KB for fast loading
   - Use consistent aspect ratio (3:4 recommended)
   - Consider using tools like TinyPNG to compress images before upload

## Example File Structure

```
public/gallery/
├── wedding-dress-before.jpg
├── wedding-dress-after.jpg
├── suit-alteration-before.jpg
├── suit-alteration-after.jpg
├── aso-ebi-design-before.jpg
└── aso-ebi-design-after.jpg
```

## External URLs

You can also use external image URLs (e.g., from Cloudinary, Imgur, or cloud storage):
- Example: `https://res.cloudinary.com/your-account/image/upload/v1234567890/before.jpg`

## Future: Automatic Upload

The current admin dashboard requires manual file placement here. For production, consider implementing:
- File upload widget in admin dashboard
- Integration with Cloudinary, Uploadthing, or Supabase Storage
- Automatic image resizing and optimization
