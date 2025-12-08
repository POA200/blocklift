#!/bin/bash
# BlockLift Gallery Upload - Quick Setup Script
# This script automates the initial setup for the gallery upload feature

set -e

echo "🚀 BlockLift Gallery Upload - Quick Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Install dependencies
echo -e "${BLUE}[1/5]${NC} Installing @types/multer..."
cd blocklift-be
npm install --save-dev @types/multer

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 2: Check .env file
echo -e "${BLUE}[2/5]${NC} Checking environment configuration..."
if ! grep -q "UPLOAD_SECRET_TOKEN" .env 2>/dev/null; then
  echo -e "${YELLOW}⚠ UPLOAD_SECRET_TOKEN not found in .env${NC}"
  echo "Please add the following to blocklift-be/.env:"
  echo ""
  echo -e "${YELLOW}UPLOAD_SECRET_TOKEN=your-super-secret-token-here${NC}"
  echo ""
  echo "Generate a strong token with:"
  echo "  node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
  echo ""
  read -p "Press Enter after adding UPLOAD_SECRET_TOKEN..."
else
  echo -e "${GREEN}✓ UPLOAD_SECRET_TOKEN found in .env${NC}"
fi
echo ""

# Step 3: Create upload directory
echo -e "${BLUE}[3/5]${NC} Creating upload directory..."
mkdir -p /var/data/uploads/gallery 2>/dev/null || {
  echo -e "${YELLOW}⚠ Could not create /var/data/uploads/gallery${NC}"
  echo "Creating local development directory instead..."
  mkdir -p ./uploads/gallery
  echo -e "${YELLOW}Note: You may need to update uploadDir in gallery.ts for production${NC}"
}
echo -e "${GREEN}✓ Upload directory ready${NC}"
echo ""

# Step 4: Build backend
echo -e "${BLUE}[4/5]${NC} Building backend..."
npm run build
echo -e "${GREEN}✓ Backend built successfully${NC}"
echo ""

# Step 5: Summary
echo -e "${BLUE}[5/5]${NC} Setup complete!"
echo ""
echo -e "${GREEN}✅ All setup steps completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Start backend:"
echo -e "   ${YELLOW}cd blocklift-be && npm run dev${NC}"
echo ""
echo "2. In another terminal, start frontend:"
echo -e "   ${YELLOW}cd web && npm run dev${NC}"
echo ""
echo "3. Test the upload:"
echo -e "   ${YELLOW}curl -X POST http://localhost:3000/api/gallery/upload-image \\${NC}"
echo -e "   ${YELLOW}  -H \"Authorization: Bearer YOUR_TOKEN_HERE\" \\${NC}"
echo -e "   ${YELLOW}  -F \"imageFile=@./image.jpg\" \\${NC}"
echo -e "   ${YELLOW}  -F \"description=Test\" \\${NC}"
echo -e "   ${YELLOW}  -F \"location=Test Location\"${NC}"
echo ""
echo "Documentation:"
echo "  - GALLERY_UPLOAD_SETUP.md - Complete setup guide"
echo "  - STATIC_FILE_SERVER_SETUP.md - File serving configuration"
echo "  - IMPLEMENTATION_SUMMARY.md - Feature overview"
echo ""
