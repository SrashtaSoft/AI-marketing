# Image Upload Fix - Complete Solution

## Problem
Images were being saved to `apps/backend/uploads/` instead of `./uploads/`, causing 404 errors when the frontend tried to serve them.

## Root Cause
The `UPLOAD_DIRECTORY` was set to a relative path `./uploads`, which resolved differently depending on where the backend process was running from.

## Solution Applied

### 1. Updated Environment Variable
Changed `UPLOAD_DIRECTORY` from relative to absolute path:
```bash
# Before
UPLOAD_DIRECTORY="./uploads"

# After  
UPLOAD_DIRECTORY="/Users/mamini10/Desktop/app/postiz-app/uploads"
```

### 2. Moved Existing Files
Moved all files from `apps/backend/uploads/` to `uploads/` directory.

### 3. Updated API Route
Enhanced the frontend API route (`apps/frontend/src/app/(app)/api/uploads/[[...path]]/route.ts`) with:
- Proper error handling (404 for missing files, 500 for server errors)
- Absolute path resolution
- File existence checks

## Required Actions

### Restart Services
Both backend and frontend need to be restarted to pick up the new configuration:

```bash
# Stop current processes
lsof -ti :3000 | xargs kill -9 2>/dev/null
lsof -ti :4200 | xargs kill -9 2>/dev/null

# Restart backend
pnpm run dev:backend

# Restart frontend (in a new terminal)
pnpm run dev:frontend
```

### Clear Browser Cache
After restarting:
1. Hard refresh the browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
2. Or clear browser cache and reload

## Verification

### Check File Location
```bash
ls -la uploads/2025/12/19/
```

### Test Image Access
```bash
curl -I http://localhost:4200/uploads/2025/12/19/889102473f6a78be03ae10ae9101b93e4f7.png
```

Should return `200 OK` instead of `404 Not Found`.

## Configuration Summary

- **Storage Provider**: `local`
- **Upload Directory**: `/Users/mamini10/Desktop/app/postiz-app/uploads` (absolute path)
- **Static Directory**: `uploads` (for frontend)
- **File Structure**: `uploads/YYYY/MM/DD/filename.ext`

## Future Uploads

All new uploads will now be saved to the correct location:
- Backend saves to: `/Users/mamini10/Desktop/app/postiz-app/uploads/YYYY/MM/DD/`
- Frontend serves from: `http://localhost:4200/uploads/YYYY/MM/DD/`

## Troubleshooting

If images still don't load:

1. **Verify environment variable**:
   ```bash
   grep UPLOAD_DIRECTORY .env
   ```

2. **Check file exists**:
   ```bash
   ls -la uploads/2025/12/19/
   ```

3. **Check backend logs** for upload errors

4. **Check frontend console** (F12) for network errors

5. **Verify both services restarted**:
   ```bash
   lsof -i :3000  # Backend
   lsof -i :4200  # Frontend
   ```

