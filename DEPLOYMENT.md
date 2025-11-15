# Deployment Guide

Deploy CMU Fuel Planner to production using Vercel (recommended) or other platforms.

## Option 1: Deploy to Vercel (Recommended)

Vercel is made by the creators of Next.js and provides the best experience.

### Prerequisites
- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))
- Anthropic API key

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Complete CMU Fuel Planner"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings

3. **Add Environment Variable**
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `ANTHROPIC_API_KEY` = your API key
   - Deploy to all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes
   - Your app is live! 🎉

### Custom Domain (Optional)
- Settings → Domains
- Add your domain (e.g., cmufuel.com)
- Update DNS records as instructed

### Automatic Deployments
- Every push to `main` = production deployment
- Every pull request = preview deployment

## Option 2: Deploy to Netlify

### Steps

1. **Create `netlify.toml`**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Deploy**
   - Go to [netlify.com](https://netlify.com)
   - Import from GitHub
   - Add `ANTHROPIC_API_KEY` in Environment Variables
   - Deploy

## Option 3: Self-Host with Docker

### Create Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Run

```bash
docker build -t cmu-fuel-planner .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=your_key cmu-fuel-planner
```

## Option 4: Traditional VPS (Ubuntu)

### Setup on Ubuntu Server

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/yourusername/cmuclaudehackathon2025.git
cd cmuclaudehackathon2025
npm install
npm run build

# Create .env.local
echo "ANTHROPIC_API_KEY=your_key" > .env.local

# Start with PM2
sudo npm install -g pm2
pm2 start npm --name "cmu-fuel-planner" -- start
pm2 save
pm2 startup
```

### Setup Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

Ensure these are set in production:

```env
ANTHROPIC_API_KEY=sk-ant-...
NODE_ENV=production
```

## Production Checklist

Before deploying:

- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linter errors (`npm run lint`)
- [ ] Environment variables configured
- [ ] Test with sample data
- [ ] Verify ICS export works
- [ ] Check mobile responsiveness
- [ ] Test API error handling

## Performance Optimization

### 1. Enable Caching

In `next.config.js`:

```javascript
module.exports = {
  // Existing config...
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 2. Optimize Images

Use Next.js Image component for any images you add.

### 3. Reduce Bundle Size

```bash
# Analyze bundle
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard → Analytics (free tier available)

### Error Tracking

Add Sentry or similar:

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## Security Best Practices

1. **API Key Protection**
   - Never commit `.env.local`
   - Use platform environment variables
   - Rotate keys periodically

2. **Rate Limiting**
   Consider adding rate limiting to API routes:

   ```typescript
   // In route.ts
   const rateLimiter = new Map();
   
   function checkRateLimit(ip: string): boolean {
     const now = Date.now();
     const userRequests = rateLimiter.get(ip) || [];
     const recentRequests = userRequests.filter(time => now - time < 60000);
     
     if (recentRequests.length >= 10) {
       return false;
     }
     
     rateLimiter.set(ip, [...recentRequests, now]);
     return true;
   }
   ```

3. **HTTPS**
   - Always use HTTPS in production
   - Vercel/Netlify provide this automatically
   - For self-hosting, use Let's Encrypt

## Troubleshooting Production Issues

### Build Fails

```bash
# Check locally first
npm run build

# Clear cache
rm -rf .next
npm run build
```

### API Errors

- Verify `ANTHROPIC_API_KEY` is set
- Check API usage limits
- Review server logs

### Performance Issues

- Enable Next.js analytics
- Check bundle size with analyzer
- Review Claude API response times

## Scaling Considerations

### API Rate Limits

Anthropic has rate limits. For high usage:
- Implement request queuing
- Add caching for similar requests
- Consider usage-based access tiers

### Database (Future)

When adding user accounts:
- Use Vercel Postgres
- Or connect to external database
- Implement connection pooling

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security issues
npm audit
npm audit fix
```

### Backup Strategy

- Code: Version controlled in GitHub
- Environment variables: Document in secure location
- User data: Regular database backups (when implemented)

## Support & Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Anthropic API Status](https://status.anthropic.com)

## Cost Estimates

### Vercel (Recommended)
- Hobby: Free (limited to 100GB bandwidth/month)
- Pro: $20/month (unlimited bandwidth)

### Anthropic API
- Pay per token usage
- Sonnet 4: ~$3 per million input tokens
- Estimate: ~$0.01-0.05 per schedule generation
- Budget: Start with $10/month, scale as needed

### Custom Domain
- $10-15/year (optional)

## Going Live Checklist

- [ ] Production build tested
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Error tracking setup
- [ ] README updated with live URL
- [ ] Share with CMU community!

---

**Ready to launch?** Follow the Vercel deployment steps above for the quickest path to production! 🚀

