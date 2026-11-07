# Monitoring Runbook

This runbook covers monitoring, alerting, and observability for the Quini6 Frontend.

## 📊 Monitoring Stack

| Tool | Purpose | Access |
| :--- | :------ | :----- |
| **Sentry** | Error tracking, performance monitoring | [sentry.io](https://sentry.io) |
| **Plausible** | Privacy-friendly analytics | [plausible.io](https://plausible.io) |
| **Vercel Analytics** | Core Web Vitals, runtime metrics | Vercel Dashboard |
| **Lighthouse CI** | Performance regression detection | CI/CD pipeline |
| **Playwright** | Visual regression, E2E health checks | CI/CD pipeline |

## 🎯 Key Metrics to Monitor

### Error Metrics (Sentry)

| Metric | Threshold | Alert |
| :----- | :-------- | :---- |
| **Error Rate** | > 1% of sessions | 🔴 Critical |
| **New Errors** | Any new issue | 🟡 Warning |
| **Crash-Free Sessions** | < 99% | 🔴 Critical |
| **API Error Rate** | > 5% | 🟡 Warning |

### Performance Metrics

| Metric | Good | Needs Improvement | Poor |
| :----- | :--- | :---------------- | :--- |
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4s | > 4s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200ms - 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **TTFB** (Time to First Byte) | ≤ 800ms | 800ms - 1.8s | > 1.8s |

### Business Metrics (Plausible)

| Metric | Target | Alert |
| :----- | :----- | :---- |
| **Pageviews/day** | Baseline ± 20% | 🟡 Warning |
| **Admin panel usage** | Consistent | 🟡 Warning |
| **Search conversions** | Baseline | 🟡 Warning |
| **Import success rate** | > 95% | 🔴 Critical |

## 🔔 Alerting Rules

### Sentry Alerts (Configure in Sentry → Settings → Alerts)

```yaml
# Critical: Error rate spike
- name: "High Error Rate"
  condition: "error_rate > 1% for 5m"
  frequency: "5m"
  channels: ["pagerduty", "slack"]

# Critical: New error type
- name: "New Error Detected"
  condition: "new_issue_created"
  frequency: "immediate"
  channels: ["slack"]

# Warning: Performance degradation
- name: "Slow Transactions"
  condition: "p95_duration > 2s for 10m"
  frequency: "10m"
  channels: ["slack"]

# Warning: Specific endpoint errors
- name: "Health Check Failures"
  condition: "url:/api/health AND status:error"
  frequency: "1m"
  channels: ["slack"]
```

### Vercel Alerts

- **Build Failures**: Automatic (Slack/Email)
- **Function Errors**: Configure in Vercel → Observability → Alerts
- **Edge Function Errors**: Same as above

### Custom Health Checks

```bash
# Add to cron or uptime monitor (UptimeRobot, Pingdom, etc.)
# Check every 5 minutes:

# 1. Site availability
curl -f -s -o /dev/null -w "%{http_code}" https://quini6.example.com
# Expected: 200

# 2. Admin health endpoint
curl -f -s https://quini6.example.com/api/health | jq -r '.status'
# Expected: "healthy"

# 3. Critical user flow (login)
# Use Playwright script or synthetic monitoring
```

## 📈 Dashboards

### Sentry Dashboard (Create in Sentry → Dashboards)

**Frontend Overview**:
- Error rate over time (24h, 7d, 30d)
- Top errors by frequency
- Crash-free sessions trend
- Release health (adoption, crash rate)
- Performance: p50, p95, p99 transaction duration

**Admin Panel**:
- `/admin/*` route errors
- Health page performance
- Import flow errors
- API latency from frontend perspective

### Vercel Dashboard

- **Analytics** → Web Vitals (LCP, INP, CLS)
- **Analytics** → Top pages by traffic
- **Functions** → Invocation count, duration, errors
- **Logs** → Real-time function logs

### Plausible Dashboard

- **Overview** → Visitors, pageviews, bounce rate
- **Pages** → Top pages, admin panel usage
- **Goals** → Track conversions (search, import, login)
- **Referrers** → Traffic sources

## 🏥 Health Checks

### Automated Health Checks

```typescript
// src/lib/monitoring/health.ts
export async function runHealthChecks(): Promise<HealthReport> {
  const checks = await Promise.allSettled([
    checkApi(),
    checkDatabase(),
    checkSentry(),
    checkPlausible(),
  ]);

  return {
    timestamp: new Date().toISOString(),
    overall: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'degraded',
    checks: checks.map((c, i) => ({
      name: ['api', 'database', 'sentry', 'plausible'][i],
      status: c.status === 'fulfilled' ? 'pass' : 'fail',
      details: c.status === 'fulfilled' ? c.value : c.reason,
    })),
  };
}
```

### Manual Health Check Commands

```bash
# Full health check
npm run test:e2e -- --grep "health"

# API connectivity
curl -v https://api.quini6.example.com/health

# Sentry test event
# In browser console on production:
Sentry.captureMessage('Manual health check', 'info');

# Plausible test event
plausible('health_check', { props: { source: 'manual' } });
```

## 🚨 Incident Response

### Severity Levels

| Level | Description | Response Time | Examples |
| :---- | :---------- | :------------ | :------- |
| **SEV-1** | Critical outage | 15 min | Site down, data loss, security breach |
| **SEV-2** | Major degradation | 1 hour | High error rate, slow performance, key feature broken |
| **SEV-3** | Minor issue | 4 hours | Non-critical bug, cosmetic issue, low-traffic page |
| **SEV-4** | Low priority | Next sprint | Enhancement, tech debt, documentation |

### SEV-1 Response Playbook

1. **Acknowledge** (within 15 min)
   - Page on-call engineer
   - Create incident channel (#incident-YYYY-MM-DD)
   - Post initial status

2. **Assess** (within 30 min)
   - Check Sentry for error spike
   - Check Vercel for deployment issues
   - Check backend status
   - Determine scope (all users / subset)

3. **Mitigate** (within 1 hour)
   - Rollback if recent deployment (see [Rollback Runbook](./rollback.md))
   - Disable feature flag if applicable
   - Scale resources if capacity issue

4. **Communicate**
   - Status page update
   - Stakeholder notification
   - Customer communication if needed

5. **Resolve & Review**
   - Root cause analysis within 48h
   - Action items to prevent recurrence
   - Postmortem document

### SEV-2 Response Playbook

1. **Acknowledge** (within 1 hour)
2. **Investigate** using debugging runbook
3. **Fix or workaround** within 4 hours
4. **Verify** fix in staging → deploy
5. **Document** in incident tracker

## 📋 Monitoring Checklists

### Daily (Automated)

- [ ] Sentry error rate < 1%
- [ ] No new critical issues
- [ ] Lighthouse CI passed
- [ ] E2E tests passed in CI
- [ ] Vercel build successful

### Weekly

- [ ] Review Sentry trends (7d)
- [ ] Check Plausible traffic patterns
- [ ] Review Vercel Web Vitals trends
- [ ] Check bundle size trend
- [ ] Review failed deployments

### Monthly

- [ ] Sentry release health review
- [ ] Performance budget review
- [ ] Alert tuning (reduce noise)
- [ ] Documentation updates
- [ ] Runbook review and drill

## 🔧 Troubleshooting Monitoring

### Sentry Not Receiving Events

```bash
# 1. Check DSN in environment
echo $VITE_SENTRY_DSN

# 2. Verify Sentry init in browser console
Sentry.getCurrentHub().getClient()?.getDsn()

# 3. Check network tab for /api/ envelope requests
# 4. Verify beforeSend not filtering
# 5. Check Sentry project settings → Client Keys (DSN valid?)
```

### Plausible Data Missing

```bash
# 1. Check script loaded
# In browser console:
document.querySelector('script[data-domain]')

# 2. Verify domain matches
plausible.getConfig()

# 3. Check ad blockers
# 4. Verify VITE_PLAUSIBLE_DOMAIN in Vercel
```

### Lighthouse CI Failing

```bash
# Run locally with verbose output
npm run lighthouse -- --verbose

# Check specific metrics
# - LCP: Large images, blocking resources
# - INP: Heavy JS execution, long tasks
# - CLS: Dynamic content injection, font loading
```

## 📝 Monitoring Log Template

```
Date: YYYY-MM-DD
Period: [Daily/Weekly/Monthly]
Reviewer: [name]

Error Rate: [X%] (Target: <1%)
New Issues: [count]
Crash-Free Sessions: [X%] (Target: >99%)

LCP (p75): [Xms] (Target: ≤2500ms)
INP (p75): [Xms] (Target: ≤200ms)
CLS (p75): [X] (Target: ≤0.1)

Pageviews: [X] (vs last week: [+/-]%)
Admin Usage: [X sessions]

Alerts Fired: [list]
Actions Taken: [list]
Follow-up: [tickets created]
```

## 🔗 Related Runbooks

- [Deploy Runbook](./deploy.md)
- [Rollback Runbook](./rollback.md)
- [Debugging Runbook](./debugging.md)