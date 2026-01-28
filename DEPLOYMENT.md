# Deployment Guide - Strategic Planner Pro

This guide covers various deployment options for Strategic Planner Pro.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Build for Production](#build-for-production)
3. [Deployment Options](#deployment-options)
4. [Environment Configuration](#environment-configuration)
5. [Post-Deployment](#post-deployment)

## Prerequisites

- Node.js 18+ installed
- npm/yarn/pnpm package manager
- Production Supabase project (if using authentication)
- Domain name (optional but recommended)

## Build for Production

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set Environment Variables

Create a `.env.production` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Build the Application

```bash
npm run build
# or
yarn build
# or
pnpm build
```

This creates an optimized production build in the `dist` directory.

### 4. Test the Production Build Locally

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel offers zero-config deployment with excellent performance.

#### Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Configure Environment Variables**
   - Go to your project settings on Vercel dashboard
   - Add environment variables under Settings → Environment Variables

4. **Set Up Custom Domain** (optional)
   - Go to Settings → Domains
   - Add your custom domain

#### Alternative: GitHub Integration

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy automatically on push

### Option 2: Netlify

#### Steps:

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build and Deploy**
```bash
npm run build
netlify deploy --prod
```

3. **Configure Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add your variables

#### Netlify Configuration File

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Option 3: AWS S3 + CloudFront

#### Steps:

1. **Build the Application**
```bash
npm run build
```

2. **Create S3 Bucket**
   - Enable static website hosting
   - Set index.html as index document

3. **Upload Files**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

4. **Configure CloudFront**
   - Create distribution pointing to S3 bucket
   - Set up SSL certificate
   - Configure custom domain

5. **Invalidate Cache After Deploy**
```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 4: Docker

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Build and Run

```bash
# Build image
docker build -t strategic-planner-pro .

# Run container
docker run -p 80:80 strategic-planner-pro
```

### Option 5: Traditional VPS (DigitalOcean, Linode, etc.)

#### Steps:

1. **Set Up Server**
   - Ubuntu 22.04 LTS recommended
   - Install Node.js and nginx

2. **Clone Repository**
```bash
git clone your-repo-url
cd strategic-planner-pro
```

3. **Install Dependencies and Build**
```bash
npm install
npm run build
```

4. **Configure Nginx**

Create `/etc/nginx/sites-available/strategic-planner-pro`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/strategic-planner-pro/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

5. **Enable Site and Restart Nginx**
```bash
sudo ln -s /etc/nginx/sites-available/strategic-planner-pro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Set Up SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Configuration

### Development
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=dev-key
```

### Staging
```env
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging-key
```

### Production
```env
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-key
```

## Post-Deployment

### 1. Verify Deployment

- [ ] Test all major features
- [ ] Check mobile responsiveness
- [ ] Verify authentication flow
- [ ] Test SWOT analysis functionality
- [ ] Verify BSC objectives and KPIs
- [ ] Test strategic options creation
- [ ] Check action plans functionality

### 2. Performance Optimization

- [ ] Enable gzip compression
- [ ] Set up CDN (CloudFront, Cloudflare)
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Monitor bundle size

### 3. Monitoring

Set up monitoring with:
- Google Analytics
- Sentry for error tracking
- Uptime monitoring (UptimeRobot, Pingdom)
- Performance monitoring (Lighthouse CI)

### 4. Security

- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set security headers
- [ ] Regular dependency updates
- [ ] Implement rate limiting (API level)

### 5. Backup Strategy

- Regular database backups (Supabase automatic)
- Export strategic plans periodically
- Version control for code

## CI/CD Pipeline Example (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting

### Build Fails

- Check Node.js version (18+ required)
- Clear node_modules and reinstall
- Check for TypeScript errors

### 404 on Refresh

- Configure server to serve index.html for all routes
- Check nginx/server configuration

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Rebuild after changing environment variables
- Check deployment platform environment settings

### Slow Performance

- Enable gzip compression
- Optimize images
- Use CDN for static assets
- Check bundle size

## Support

For deployment issues:
- Check documentation
- Open an issue on GitHub
- Contact support@strategicplannerpro.com

---

Last updated: January 2025
