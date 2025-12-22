# Image Upload Fix

## Issue
Image upload was not working when creating posts because the upload directory configuration was missing.

## What Was Fixed

### 1. Upload Directory Configuration
Updated `.env` file with:
```bash
UPLOAD_DIRECTORY="./uploads"
NEXT_PUBLIC_UPLOAD_STATIC_DIRECTORY="uploads"
```

### 2. Created Upload Directory
Created the `./uploads` directory in the project root.

## Configuration Details

- **Storage Provider**: `local` (files stored on local filesystem)
- **Upload Directory**: `./uploads` (relative to project root)
- **Static Directory**: `uploads` (for frontend serving)

## How It Works

1. **Backend Upload** (`/media/upload-server`):
   - Receives files via POST request
   - Saves to `./uploads/YYYY/MM/DD/` directory structure
   - Returns file path

2. **Frontend Serving**:
   - Files are served via `/uploads/...` route
   - Next.js rewrites `/uploads/*` to `/api/uploads/*`
   - API route reads from `UPLOAD_DIRECTORY` and streams files

## Testing

1. Try uploading an image in the Media Library
2. Check if files appear in `./uploads/` directory
3. Verify images display correctly after upload

## Troubleshooting

If uploads still don't work:

1. **Check Backend Logs**:
   ```bash
   tail -f /tmp/backend-upload-fix.log
   ```

2. **Verify Directory Permissions**:
   ```bash
   ls -la ./uploads
   chmod -R 755 ./uploads
   ```

3. **Check Environment Variables**:
   ```bash
   grep -E "UPLOAD_DIRECTORY|STORAGE_PROVIDER" .env
   ```

4. **Restart Backend**:
   ```bash
   pnpm run dev:backend
   ```

5. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

## Alternative: Use Cloudflare Storage

If you prefer cloud storage instead of local:

1. Update `.env`:
   ```bash
   STORAGE_PROVIDER="cloudflare"
   CLOUDFLARE_ACCOUNT_ID="your-account-id"
   CLOUDFLARE_ACCESS_KEY="your-access-key"
   CLOUDFLARE_SECRET_ACCESS_KEY="your-secret-access-key"
   CLOUDFLARE_BUCKETNAME="your-bucket-name"
   CLOUDFLARE_BUCKET_URL="https://your-bucket-url.r2.cloudflarestorage.com/"
   CLOUDFLARE_REGION="auto"
   ```

2. Restart backend

