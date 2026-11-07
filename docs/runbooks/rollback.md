# Rollback Runbook

This runbook covers rolling back the Quini6 Frontend to a previous stable version.

## ⚡ Quick Rollback (Vercel)

**Time: ~1-2 minutes**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → Project → Deployments
2. Find the previous **successful** deployment (green checkmark)
3. Click the three dots (⋯) → **Rollback**
4. Confirm rollback
5. Verify the rollback deployment completes successfully

## 🐳 Docker Rollback

**Time: ~2-3 minutes**

```bash
# List available tags
docker images quini6-frontend

# Tag previous stable version as latest
docker tag quini6-frontend:v1.2.3 quini6-frontend:latest

# Push to registry
docker push registry.example.com/quini6-frontend:latest

# Update deployment (Kubernetes example)
kubectl set image deployment/quini6-frontend quini6-frontend=registry.example.com/quini6-frontend:latest
kubectl rollout status deployment/quini6-frontend
```

## 📦 Static Hosting Rollback (Netlify, Cloudflare Pages, S3)

**Time: ~2-5 minutes**

### Netlify
1. Go to Netlify Dashboard → Site → Deploys
2. Find previous successful deploy
3. Click **Publish deploy**

### Cloudflare Pages
1. Go to Cloudflare Dashboard → Pages → Project → Deployments
2. Find previous successful deployment
3. Click **Rollback to this deployment**

### AWS S3 + CloudFront
```bash
# Sync previous build from backup bucket
aws s3 sync s3://quini6-backups/v1.2.3/ s3://quini6-prod/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E123456789 --paths "/*"
```

## 🔧 Git-Based Rollback (Last Resort)

**Time: ~5-10 minutes**

If platform rollback isn't available:

```bash
# 1. Find the last known good commit
git log --oneline -20

# 2. Create a rollback branch from that commit
git checkout -b rollback/v1.2.3 <good-commit-sha>

# 3. Force push to main (requires admin permissions)
git push origin rollback/v1.2.3:main --force

# 4. Trigger new deployment
# Vercel: Auto-triggers on push to main
# Other: Manual trigger or webhook
```

⚠️ **Warning**: Force-pushing to main rewrites history. Only use if platform rollback fails.

## 🎯 Post-Rollback Verification

After any rollback:

- [ ] Site loads without errors
- [ ] Admin panel accessible (`/admin`)
- [ ] Health page functional (`/admin/health`)
- [ ] No console errors in browser
- [ ] Sentry shows rollback release (if configured)
- [ ] Key user flows work (search, login, import)
- [ ] Lighthouse score maintained

## 📋 Rollback Decision Matrix

| Scenario | Action | Time |
| :------- | :----- | :--- |
| Build fails | Fix forward (don't rollback) | N/A |
| Critical bug in production | Platform rollback | 1-2 min |
| Performance regression | Platform rollback | 1-2 min |
| Security vulnerability | Platform rollback + patch | 2-5 min |
| Platform rollback unavailable | Docker/Git rollback | 5-10 min |
| Database migration issue | Coordinate with backend rollback | Varies |

## 🚨 Emergency Contacts

| Role | Contact | Escalation |
| :--- | :------ | :--------- |
| On-call Engineer | [Slack/PagerDuty] | Immediate |
| DevOps Lead | [Slack] | 5 min |
| Engineering Manager | [Slack/Email] | 15 min |

## 📝 Rollback Log Template

Record every rollback:

```
Date: YYYY-MM-DD HH:MM UTC
Triggered by: [name/alert]
Reason: [bug description / performance / security]
Method: [Vercel / Docker / Git / Static hosting]
Previous version: [commit sha / tag / deployment URL]
Rolled back to: [commit sha / tag / deployment URL]
Duration: [X minutes]
Verification: ✅ Passed / ❌ Failed
Follow-up: [ticket number / action items]
```

## 🔄 Rollback Prevention

To minimize rollbacks:

1. **Feature flags** for risky changes
2. **Canary deployments** (10% → 50% → 100%)
3. **Automated smoke tests** in deployment pipeline
4. **Pre-deployment checklist** (this runbook)
5. **Small, frequent deployments** over large batches

## 📚 Related Runbooks

- [Deploy Runbook](./deploy.md)
- [Debugging Runbook](./debugging.md)
- [Monitoring Runbook](./monitoring.md)