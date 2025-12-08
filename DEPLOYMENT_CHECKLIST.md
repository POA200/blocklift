# BlockLift Gallery Upload - Production Deployment Checklist

## Pre-Deployment

### Code Setup

- [ ] All files created and integrated
  - [ ] `blocklift-be/src/routes/gallery.ts`
  - [ ] `blocklift-be/src/server.ts` (updated)
  - [ ] `web/src/components/admin/ImageUploadForm.tsx`
  - [ ] `web/src/components/admin/AdminGalleryPanel.tsx`

### Dependencies

- [ ] `@types/multer` installed in blocklift-be
  ```bash
  npm install --save-dev @types/multer
  ```
- [ ] All other dependencies up to date
  ```bash
  npm audit
  ```

### Environment Configuration

- [ ] `.env` file has `UPLOAD_SECRET_TOKEN` set
  - [ ] Token is strong (32+ random characters)
  - [ ] Never commit .env to git
- [ ] Frontend `.env` has `VITE_API_URL` if needed

### Local Testing

- [ ] Backend compiles without errors
  ```bash
  cd blocklift-be && npm run build
  ```
- [ ] Backend starts without errors
  ```bash
  npm start
  ```
- [ ] Frontend starts without errors
  ```bash
  cd web && npm run dev
  ```
- [ ] Upload endpoint works with cURL
  ```bash
  curl -X POST http://localhost:3000/api/gallery/upload-image \
    -H "Authorization: Bearer $UPLOAD_SECRET_TOKEN" \
    -F "imageFile=@./test.jpg" \
    -F "description=test" \
    -F "location=test"
  ```
- [ ] Frontend component works and submits correctly
- [ ] Success/error messages display properly
- [ ] Uploaded files are accessible at `/uploads/gallery/{filename}`

---

## Render Deployment

### Service Configuration

#### 1. Environment Variables

- [ ] Create `UPLOAD_SECRET_TOKEN` in Render Dashboard
  - [ ] Settings → Environment
  - [ ] Add Private Environment Variable
  - [ ] Name: `UPLOAD_SECRET_TOKEN`
  - [ ] Value: [Strong random token]
- [ ] Verify other environment variables are set
  - [ ] `PORT=3000` (or your port)
  - [ ] Any other required env vars

#### 2. Persistent Disk Configuration

- [ ] Mount persistent disk for file storage
  - [ ] Dashboard → Your Service → Disks
  - [ ] Mount path: `/var/data`
  - [ ] Size: 10GB+ recommended
  - [ ] Check "Persist across deploys"

#### 3. Start Command

- [ ] Backend start command is correct
  ```
  npm start
  ```
  Or for TypeScript with ts-node:
  ```
  npm run dev
  ```

#### 4. Build Command

- [ ] Build command installs dependencies and builds
  ```
  npm install && npm run build
  ```

### Code Deployment

#### 1. Code Preparation

- [ ] All code is committed to git
- [ ] `.env` and `.env.local` are in `.gitignore`
- [ ] No sensitive tokens in code
- [ ] No `node_modules` in git
- [ ] No upload directories in git

#### 2. Deploy Backend

- [ ] Push to repository
  ```bash
  git add .
  git commit -m "Add gallery upload feature"
  git push origin main
  ```
- [ ] Verify Render autodeploy triggers
  - [ ] Check Render Dashboard → Deploys tab
  - [ ] Verify build succeeds
  - [ ] Check for any build errors in logs

#### 3. Deploy Frontend

- [ ] Push frontend changes to git
- [ ] If using separate frontend service on Render:
  - [ ] Verify build succeeds
  - [ ] Check logs for errors

#### 4. Verify Deployment

- [ ] Backend is running
  ```bash
  curl https://your-backend-url.onrender.com/api/health
  ```
- [ ] Health check responds
  ```json
  {
    "status": "ok",
    "service": "BlockLift Backend"
  }
  ```
- [ ] Gallery endpoint is accessible
  ```bash
  curl https://your-backend-url.onrender.com/api/gallery
  ```

---

## Post-Deployment Testing

### 1. File Upload Test

- [ ] Upload via cURL with production token
  ```bash
  curl -X POST https://your-backend-url.onrender.com/api/gallery/upload-image \
    -H "Authorization: Bearer $UPLOAD_SECRET_TOKEN" \
    -F "imageFile=@./image.jpg" \
    -F "description=Production test" \
    -F "location=Production"
  ```
- [ ] Response is 201 Created with image metadata
- [ ] Image URL is returned

### 2. File Access Test

- [ ] File is publicly accessible
  ```bash
  curl https://your-backend-url.onrender.com/uploads/gallery/{filename}
  ```
- [ ] File is served correctly (returns image data)
- [ ] File MIME type is correct (image/jpeg, etc.)

### 3. Security Test

- [ ] Invalid token returns 401
  ```bash
  curl -X POST https://your-backend-url.onrender.com/api/gallery/upload-image \
    -H "Authorization: Bearer invalid-token" \
    -F "imageFile=@./image.jpg"
  ```
- [ ] Missing token returns 401
  ```bash
  curl -X POST https://your-backend-url.onrender.com/api/gallery/upload-image \
    -F "imageFile=@./image.jpg"
  ```
- [ ] Invalid file types are rejected

### 4. Frontend Integration Test

- [ ] ImageUploadForm component loads
- [ ] Upload form submits correctly
- [ ] API key is sent in Authorization header
- [ ] Success message displays on success
- [ ] Error message displays on failure
- [ ] Form clears after successful upload

### 5. Load & Performance Test

- [ ] Multiple concurrent uploads work
- [ ] Large files (near 10MB) are handled
- [ ] Very small files upload quickly
- [ ] No memory leaks in logs

---

## Monitoring & Maintenance

### 1. Logging

- [ ] Set up log aggregation (if using Render)
  - [ ] Check Render Logs tab regularly
  - [ ] Look for error patterns
  - [ ] Monitor upload failures

### 2. Disk Space

- [ ] Monitor persistent disk usage
  - [ ] Dashboard → Disks → Usage
  - [ ] Set up alerts if available
  - [ ] Plan for growth/cleanup

### 3. Security Monitoring

- [ ] Check for unauthorized access attempts in logs
- [ ] Rotate `UPLOAD_SECRET_TOKEN` quarterly
  - [ ] Generate new token
  - [ ] Update in Render environment
  - [ ] Redeploy service
  - [ ] Notify users of new token

### 4. Backup Strategy

- [ ] Backup uploaded files regularly
  - [ ] Download from persistent disk
  - [ ] Store in external backup (AWS S3, etc.)
  - [ ] Document backup procedure

### 5. Performance Monitoring

- [ ] Monitor response times
  - [ ] Average upload time
  - [ ] P95/P99 percentiles
- [ ] Monitor error rates
  - [ ] 401 errors (auth failures)
  - [ ] 400 errors (validation)
  - [ ] 500 errors (server issues)

---

## Scaling & Optimization

### 1. Rate Limiting (Important!)

- [ ] Implement rate limiting
  - [ ] Install `express-rate-limit`
  - [ ] Limit uploads: 10 per 15 minutes per IP
  - [ ] Test rate limiting works

### 2. File Storage

- [ ] Consider S3 migration for large scale
  ```bash
  npm install aws-sdk
  ```
  - [ ] Update multer to use S3 instead of disk
  - [ ] Update URL construction for S3
  - [ ] Update environment variables

### 3. Database Integration

- [ ] Implement image metadata storage
  - [ ] Create gallery table
  - [ ] Insert after file upload
  - [ ] Add retrieval endpoints
  - [ ] Index for performance

### 4. Image Processing

- [ ] Consider image optimization (optional)
  ```bash
  npm install sharp
  ```
  - [ ] Compress images on upload
  - [ ] Generate thumbnails
  - [ ] Multiple sizes for responsive images

---

## Rollback Plan

### If Deployment Fails

- [ ] Check Render logs for error details
- [ ] Rollback to previous version
  - [ ] Render Dashboard → Deploys
  - [ ] Select previous successful deploy
  - [ ] Click "Redeploy"
- [ ] Fix issue in code
- [ ] Test locally again
- [ ] Redeploy

### If Production Issues Occur

- [ ] Check logs immediately
  - [ ] Server errors
  - [ ] Authorization failures
  - [ ] File system issues
- [ ] Disable upload feature if critical
  - [ ] Hide UI button
  - [ ] Return 503 from endpoint
- [ ] Fix issue
- [ ] Redeploy
- [ ] Re-enable feature

---

## Database Setup (When Ready)

### Create Gallery Table

```sql
CREATE TABLE gallery (
  id INT PRIMARY KEY AUTO_INCREMENT,
  imageUrl VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_uploadedAt (uploadedAt),
  INDEX idx_location (location)
);
```

### Update gallery.ts

- [ ] Uncomment database insert code
- [ ] Test database connection
- [ ] Verify data persists

### Add Retrieval Endpoint

- [ ] Implement GET /api/gallery/images
- [ ] Test retrieval works
- [ ] Update frontend to fetch images from DB

---

## Documentation Updates

- [ ] Update project README with gallery feature
- [ ] Document API endpoints in wiki/docs
- [ ] Document how to use ImageUploadForm
- [ ] Create troubleshooting guide for admins
- [ ] Document token rotation procedure

---

## Final Checklist

- [ ] All checklist items above are complete
- [ ] Code review completed
- [ ] Tests passed
- [ ] Performance is acceptable
- [ ] Security verified
- [ ] Documentation complete
- [ ] Team trained on feature
- [ ] Monitoring set up
- [ ] Rollback plan documented
- [ ] Go-live approved

---

## Sign-Off

- **Deployed By:** ******\_\_\_\_******
- **Date:** ******\_\_\_\_******
- **Version:** 1.0.0
- **Environment:** Production

---

## Post-Go-Live (Week 1)

- [ ] Monitor uploads closely
- [ ] Check logs for errors
- [ ] Verify file access works
- [ ] Get user feedback
- [ ] Fix any issues
- [ ] Document lessons learned

---

**Last Updated:** December 8, 2024
