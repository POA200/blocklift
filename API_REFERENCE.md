# BlockLift Gallery API - Complete Reference

## Endpoints

### 1. Health Check

```http
GET /api/gallery
```

**Response (200 OK):**

```json
{
  "ok": true,
  "route": "gallery"
}
```

---

### 2. Upload Image (Main Endpoint)

```http
POST /api/gallery/upload-image
Authorization: Bearer {UPLOAD_SECRET_TOKEN}
Content-Type: multipart/form-data
```

#### Request

**Headers:**

```
Authorization: Bearer your-secret-token-here
```

**Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `imageFile` | File | ✅ Yes | Image file (max 10MB, types: jpeg, png, gif, webp) |
| `description` | String | ✅ Yes | Image title or description (1-500 chars) |
| `location` | String | ✅ Yes | Location where image was taken (1-500 chars) |

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "imageUrl": "http://localhost:3000/uploads/gallery/1702123456789.jpg",
    "filename": "1702123456789.jpg",
    "location": "Ikeja, Lagos",
    "description": "School bag distribution to students",
    "uploadedAt": "2024-12-08T12:34:56.789Z",
    "filePath": "/var/data/uploads/gallery/1702123456789.jpg"
  }
}
```

#### Error Response - Missing Authorization (401 Unauthorized)

```json
{
  "error": "Unauthorized",
  "message": "Missing Authorization header"
}
```

#### Error Response - Invalid Token (401 Unauthorized)

```json
{
  "error": "Unauthorized",
  "message": "Invalid token"
}
```

#### Error Response - Invalid Token Format (401 Unauthorized)

```json
{
  "error": "Unauthorized",
  "message": "Invalid Authorization header format. Use: Bearer <TOKEN>"
}
```

#### Error Response - Missing Fields (400 Bad Request)

```json
{
  "error": "Bad Request",
  "message": "Missing required fields: description and location"
}
```

#### Error Response - No File (400 Bad Request)

```json
{
  "error": "Bad Request",
  "message": "No file uploaded. Expected field: imageFile"
}
```

#### Error Response - Invalid File Type (400 Bad Request)

```json
{
  "error": "Invalid file type. Allowed: image/jpeg, image/png, image/gif, image/webp"
}
```

#### Error Response - File Too Large (400 Bad Request)

```json
{
  "error": "File too large"
}
```

#### Error Response - Server Error (500 Internal Server Error)

```json
{
  "error": "Internal Server Error",
  "message": "Error description here"
}
```

---

## Authentication

### Bearer Token

The API uses Bearer token authentication for the upload endpoint.

**Format:**

```
Authorization: Bearer {TOKEN}
```

**Token Source:**

```
process.env.UPLOAD_SECRET_TOKEN
```

**Token Validation:**

```typescript
// Token must match exactly
const token = authHeader.split(' ')[1];
if (token !== process.env.UPLOAD_SECRET_TOKEN) {
  return 401 Unauthorized;
}
```

### Generating a Secure Token

**Node.js:**

```javascript
const crypto = require("crypto");
const token = crypto.randomBytes(32).toString("hex");
console.log(token);
// Output: a3f9b2c1d4e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0
```

**Bash:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**OpenSSL:**

```bash
openssl rand -hex 32
```

---

## Request Examples

### cURL

#### Basic Upload

```bash
curl -X POST http://localhost:3000/api/gallery/upload-image \
  -H "Authorization: Bearer your-secret-token-here" \
  -F "imageFile=@./image.jpg" \
  -F "description=School bag distribution" \
  -F "location=Ikeja, Lagos"
```

#### With File Path

```bash
curl -X POST https://your-render-url.onrender.com/api/gallery/upload-image \
  -H "Authorization: Bearer $UPLOAD_SECRET_TOKEN" \
  -F "imageFile=@$(pwd)/photos/school.png" \
  -F "description=Students receiving supplies" \
  -F "location=Victoria Island, Lagos"
```

### JavaScript/Fetch

```javascript
const formData = new FormData();
formData.append("imageFile", fileInput.files[0]);
formData.append("description", "Community impact");
formData.append("location", "Lagos, Nigeria");

const response = await fetch("/api/gallery/upload-image", {
  method: "POST",
  headers: {
    Authorization: "Bearer your-secret-token-here",
    // Do NOT set Content-Type; browser handles multipart/form-data
  },
  body: formData,
});

const data = await response.json();
console.log(data);
```

### Python

```python
import requests

url = 'http://localhost:3000/api/gallery/upload-image'
headers = {'Authorization': 'Bearer your-secret-token-here'}

files = {
    'imageFile': open('image.jpg', 'rb'),
}

data = {
    'description': 'Impact snapshot',
    'location': 'Lagos, Nigeria',
}

response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())
```

### Axios

```javascript
const formData = new FormData();
formData.append("imageFile", file);
formData.append("description", "Impact image");
formData.append("location", "Lagos");

const response = await axios.post("/api/gallery/upload-image", formData, {
  headers: {
    Authorization: "Bearer your-secret-token-here",
    // Axios with FormData automatically sets correct content-type
  },
});

console.log(response.data);
```

---

## File Handling

### Supported File Types

- `image/jpeg` (.jpg, .jpeg)
- `image/png` (.png)
- `image/gif` (.gif)
- `image/webp` (.webp)

### File Constraints

- **Maximum Size:** 10 MB
- **Naming:** `[timestamp].[extension]` (e.g., `1702123456789.jpg`)
- **Location:** `/var/data/uploads/gallery/`
- **Public URL:** `{RENDER_URL}/uploads/gallery/{filename}`

### Filename Generation

```typescript
const filename = `${Date.now()}${path.extname(originalName)}`;
// Example: 1702123456789.jpg
```

This ensures:

- ✅ No filename collisions
- ✅ Chronological ordering
- ✅ Safe filename characters
- ✅ Original extension preserved

---

## Response Headers

### Successful Upload (201 Created)

```
HTTP/1.1 201 Created
Content-Type: application/json
Content-Length: 456
Date: Fri, 08 Dec 2024 12:34:56 GMT
```

### Error (401 Unauthorized)

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json
WWW-Authenticate: Bearer
```

---

## Status Codes

| Code | Status                | Description                                       |
| ---- | --------------------- | ------------------------------------------------- |
| 200  | OK                    | Health check successful                           |
| 201  | Created               | Image uploaded successfully                       |
| 400  | Bad Request           | Missing fields, invalid file, or validation error |
| 401  | Unauthorized          | Missing/invalid token                             |
| 413  | Payload Too Large     | File exceeds 10MB limit                           |
| 500  | Internal Server Error | Server error during upload                        |

---

## Rate Limiting

Currently **not implemented**. Add for production using `express-rate-limit`:

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per window
  message: 'Too many uploads, please try again later',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

router.post('/upload-image', uploadLimiter, checkAuth, upload.single(...));
```

---

## Database Schema (TODO)

### Gallery Table

```sql
CREATE TABLE gallery (
  id INT PRIMARY KEY AUTO_INCREMENT,
  imageUrl VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_uploadedAt (uploadedAt),
  INDEX idx_location (location)
);
```

### Retrieve Latest Images

```sql
SELECT * FROM gallery
ORDER BY uploadedAt DESC
LIMIT 20;
```

### Query by Location

```sql
SELECT * FROM gallery
WHERE location LIKE ?
ORDER BY uploadedAt DESC;
```

---

## Monitoring & Debugging

### Server Logs

The endpoint logs errors to console:

```typescript
console.error("Gallery upload error:", err);
```

Monitor these logs in production:

- **Render Dashboard** → Logs tab
- **Local development** → Terminal output

### Test Endpoint Health

```bash
curl http://localhost:3000/api/gallery
```

Expected response:

```json
{
  "ok": true,
  "route": "gallery"
}
```

### Verify File Access

```bash
curl http://localhost:3000/uploads/gallery/1702123456789.jpg
```

Should return the image file.

---

## Best Practices

### Client-Side

✅ **DO:**

- Validate file type before upload
- Show upload progress indicator
- Display clear error messages
- Store token securely (not in localStorage for sensitive apps)
- Use HTTPS in production

❌ **DON'T:**

- Set `Content-Type` header when using FormData
- Expose token in client-side logs
- Trust client-side validation alone
- Upload images larger than 10MB

### Server-Side

✅ **DO:**

- Validate token on every request
- Validate file type server-side
- Use secure filenames
- Log upload events
- Implement rate limiting

❌ **DON'T:**

- Trust client-side file type
- Use user-provided filenames
- Store tokens in code
- Skip error handling

---

## Troubleshooting

### 401 Unauthorized

**Causes:**

- Missing Authorization header
- Wrong token format (should be "Bearer <TOKEN>")
- Token doesn't match UPLOAD_SECRET_TOKEN

**Solution:**

```bash
# Verify token
echo $UPLOAD_SECRET_TOKEN

# Test with correct format
curl -H "Authorization: Bearer $(echo $UPLOAD_SECRET_TOKEN)" ...
```

### 400 Bad Request

**Causes:**

- Missing imageFile in form-data
- Missing description or location
- Invalid file type

**Solution:**

```bash
# Ensure all fields are present
curl -F "imageFile=@image.jpg" \
     -F "description=test" \
     -F "location=test" ...
```

### File Not Found After Upload

**Cause:** Static middleware not configured

**Solution:** Add to server.ts:

```typescript
app.use("/uploads", express.static("/var/data/uploads"));
```

---

## Support

For issues:

1. Check server logs: `npm run dev` terminal output
2. Verify UPLOAD_SECRET_TOKEN in .env
3. Test with cURL directly
4. Review GALLERY_UPLOAD_SETUP.md

---

**API Version:** 1.0.0  
**Last Updated:** December 8, 2024
