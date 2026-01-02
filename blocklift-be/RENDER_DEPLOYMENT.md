# BlockLift Backend - Render Deployment Guide

## Why Render?

✅ **Persistent disk storage** - Uploaded files are saved permanently
✅ Free tier available with 750 hours/month
✅ Automatic SSL certificates
✅ Easy deployment from GitHub

---

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push
```

### 2. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 3. Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your repository: `blocklift`
3. Configure the service:

**Basic Settings:**

- **Name:** `blocklift-backend` (or your choice)
- **Region:** Choose closest to your users
- **Root Directory:** `blocklift-be`
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Advanced Settings:**

- **Auto-Deploy:** `Yes` (deploys on every push)

### 4. Add Environment Variables

In the Render dashboard, go to **Environment** tab and add:

```
UPLOAD_SECRET_TOKEN=123456
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://www.blocklift.org
```

**Note:** `RENDER_EXTERNAL_URL` is automatically set by Render.

### 5. Add Persistent Disk

This is crucial for file uploads!

1. Go to **Disks** tab
2. Click **"Add Disk"**
3. Configure:
   - **Name:** `uploads`
   - **Mount Path:** `/var/data/uploads`
   - **Size:** 1 GB (free tier, can upgrade later)
4. Click **"Create Disk"**

**If you stay on the free tier without a disk:** uploads are written to Render's tmp path (`/opt/render/project/tmp/uploads`) and are not persistent. To use a disk later, attach it and set `UPLOADS_BASE_PATH=/var/data/uploads` in the service env, then redeploy.

### 6. Deploy

1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait for build to complete (3-5 minutes)
3. Your backend will be live at: `https://blocklift-backend.onrender.com`

### 7. Update Frontend Environment

Update `web/.env`:

```env
VITE_BACKEND_URL=https://your-app-name.onrender.com
VITE_GALLERY_UPLOAD_CODE=123456
```

Replace `your-app-name` with your actual Render app name.

### 8. Update Backend CORS (If Needed)

If your frontend is on a different domain:

1. Go to Render dashboard → Environment
2. Update `FRONTEND_URL` to your frontend URL
3. Click **"Save Changes"** (will auto-redeploy)

---

## Testing Your Deployment

### Test Health Endpoint:

```bash
curl https://your-app-name.onrender.com/api/health
```

Should return:

```json
{ "status": "ok", "service": "BlockLift Backend" }
```

### Test Upload (from your frontend):

1. Go to your gallery page
2. Click "Upload Impact Image(s)"
3. Select an image
4. Enter code: `123456`
5. Upload!

---

## Important Notes

### Free Tier Limitations:

- Service spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month free (enough for hobby projects)

### Upgrading:

- **Starter Plan ($7/month):** No sleep, better performance
- **Plus more storage** if needed

### Monitoring:

- View logs: Dashboard → Logs tab
- Monitor disk usage: Dashboard → Disks tab
- Set up alerts: Dashboard → Settings → Notifications

---

## File Storage Structure

Files are stored at:

```
/var/data/uploads/gallery/[filename]
```

Accessible via:

```
https://your-app-name.onrender.com/uploads/gallery/[filename]
```

---

## Troubleshooting

### "No such file or directory" errors:

- Ensure disk is mounted at `/var/data/uploads`
- Check disk is attached in Render dashboard

### CORS errors:

- Verify `FRONTEND_URL` environment variable
- Check browser console for the blocked origin
- Make sure it matches exactly (with/without trailing slash)

### Slow first load:

- This is normal on free tier (service wakes up)
- Consider upgrading to paid tier for always-on

### Upload fails:

- Check `UPLOAD_SECRET_TOKEN` matches on both frontend and backend
- Verify token is exactly 6 digits
- Check Render logs for specific error

---

## Custom Domain (Optional)

1. Go to **Settings** → **Custom Domains**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `api.blocklift.org`)
4. Add CNAME record to your DNS:
   ```
   CNAME api your-app-name.onrender.com
   ```
5. Wait for DNS propagation (5-30 minutes)

---

## Backup Strategy

**Important:** Even with persistent disk, implement backups!

1. **Option 1:** Periodically download files via FTP
2. **Option 2:** Sync to AWS S3 using a cron job
3. **Option 3:** Use Render's disk snapshot feature (paid plans)

---

## Need Help?

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- Check Render logs for detailed error messages
