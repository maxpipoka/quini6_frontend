# Deploy Runbook

This runbook covers deploying the Quini6 Frontend to production.

## 📋 Pre-Deployment Checklist

- [ ] All tests pass (`npm run test && npm run test:e2e`)
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Lighthouse CI score >= 0.99 (`npm run lighthouse`)
- [ ] Bundle size within limits (check `npm run build` output)
- [ ] Environment variables configured in deployment platform
- [ ] Sentry release created (if using Sentry)
- [ ] Database migrations applied (if applicable)

## 🚀 Deployment Steps

### Vercel (Recommended)

1. **Connect Repository**
   - Go to Vercel Dashboard → Add New Project
   - Import `quini6-frontend` repository
   - Vercel auto-detects Astro configuration

2. **Configure Environment Variables**
   In Vercel Project Settings → Environment Variables:

   | Variable | Value | Environment |
   | :------- | :---- | :---------- |
   | `VITE_API_BASE_URL` | `https://api.quini6.example.com` | Production |
   | `VITE_SENTRY_DSN` | `https://xxx@sentry.io/xxx` | Production |
   | `VITE_PLAUSIBLE_DOMAIN` | `quini6.example.com` | Production |
   | `VITE_BUNDLE_ANALYZE` | `false` | Production |

3. **Deploy**
   - Push to `main` branch triggers automatic deployment
   - Or manually trigger from Vercel dashboard

4. **Verify Deployment**
   - Check deployment logs for build success
   - Visit deployed URL and verify:
     - Home page loads
     - Admin panel accessible (`/admin`)
     - Health page works (`/admin/health`)
     - No console errors

### Manual Build + Static Hosting

```bash
# Build for production
npm run build

# Output is in ./dist/
# Deploy dist/ to any static host:
# - Netlify: drag and drop dist/
# - Cloudflare Pages: connect repo, build command: npm run build, output: dist
# - AWS S3 + CloudFront: sync dist/ to S3 bucket
# - nginx/Apache: serve dist/ as static files
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

```bash
# Build and run
docker build -t quini6-frontend .
docker run -p 8080:80 quini6-frontend
```

## 🔧 Post-Deployment Verification

### Smoke Tests

```bash
# Health check
curl -f https://quini6.example.com/api/health

# Admin health page
curl -f https://quini6.example.com/admin/health

# Check Sentry (if configured)
# Visit Sentry dashboard → Releases → Verify new release
```

### Monitoring Checks

- [ ] Site accessible via HTTPS
- [ ] No 5xx errors in logs
- [ ] Sentry receiving events (trigger test error)
- [ ] Plausible tracking pageviews (check dashboard)
- [ ] Lighthouse score maintained

## 🔄 Rollback Procedure

If deployment fails or introduces critical issues:

```bash
# Vercel: Click "Rollback" in deployment history
# Or redeploy previous commit:
vercel rollback [deployment-url]

# Static hosting: Re-deploy previous build artifact
# Docker: Re-deploy previous image tag
docker tag quini6-frontend:previous quini6-frontend:latest
docker push registry/quini6-frontend:latest
```

See [Rollback Runbook](./rollback.md) for detailed steps.

## 📞 Escalation

| Issue | Contact |
| :---- | :------ |
| Build failures | DevOps team |
| Runtime errors | On-call engineer (check Sentry) |
| Performance regression | Performance team |
| Security issues | Security team |

## 📝 Deployment Log Template

Record each deployment:

```
Date: YYYY-MM-DD
Deployed by: [name]
Commit: [git sha]
Branch: main
Environment: Production
Vercel Deployment URL: https://quini6-xxx.vercel.app
Status: ✅ Success / ❌ Failed
Notes: [any relevant notes]
```