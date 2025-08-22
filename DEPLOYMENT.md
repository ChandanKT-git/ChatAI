# Netlify Deployment Guide

This guide will walk you through deploying your AI Chatbot application to Netlify.

## 🚀 Prerequisites

- GitHub repository with your code
- Netlify account
- Nhost project configured
- n8n workflow set up
- OpenRouter API key

## 📋 Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your repository contains:
- All source code files
- `package.json` with build scripts
- `netlify.toml` configuration
- `.env.example` file

### 2. Connect to Netlify

1. **Sign in to Netlify** at [netlify.com](https://netlify.com)
2. **Click "New site from Git"**
3. **Choose your Git provider** (GitHub, GitLab, or Bitbucket)
4. **Select your repository** containing the AI Chatbot code

### 3. Configure Build Settings

Set the following build settings:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18` (or higher)

### 4. Set Environment Variables

In the Netlify dashboard, go to **Site settings > Environment variables** and add:

```
VITE_NHOST_BACKEND_URL=https://hledgkxkscluffuwrsxw.ap-south-1.nhost.run
VITE_NHOST_SUBDOMAIN=hledgkxkscluffuwrsxw
VITE_NHOST_REGION=ap-south-1
VITE_GRAPHQL_HTTP=https://hledgkxkscluffuwrsxw.graphql.ap-south-1.nhost.run/v1/
VITE_GRAPHQL_WS=wss://hledgkxkscluffuwrsxw.graphql.ap-south-1.nhost.run/v1/
```

### 5. Deploy

1. **Click "Deploy site"**
2. **Wait for build to complete** (usually 2-5 minutes)
3. **Check for build errors** in the build log

### 6. Configure Custom Domain (Optional)

1. Go to **Site settings > Domain management**
2. **Click "Add custom domain"**
3. **Enter your domain** (e.g., `chatbot.yourdomain.com`)
4. **Follow DNS configuration instructions**

## 🔧 Post-Deployment Configuration

### 1. Update n8n Webhook URL

After deployment, update your n8n workflow with the new webhook URL:

```
https://your-site-name.netlify.app/.netlify/functions/webhook
```

### 2. Test the Application

1. **Visit your deployed site**
2. **Test authentication** (sign up/sign in)
3. **Create a new chat**
4. **Send a message** and verify AI response
5. **Check real-time updates**

### 3. Monitor Performance

Use Netlify's built-in analytics:
- **Site overview** for traffic and performance
- **Build logs** for deployment issues
- **Function logs** for serverless function debugging

## 🚨 Troubleshooting

### Build Failures

**Common Issues:**
- Missing dependencies in `package.json`
- Incorrect build command
- Environment variable issues

**Solutions:**
1. Check build logs for specific errors
2. Verify all dependencies are installed
3. Ensure environment variables are set correctly

### Runtime Errors

**Common Issues:**
- GraphQL connection failures
- Authentication errors
- AI response failures

**Solutions:**
1. Verify Nhost configuration
2. Check n8n workflow status
3. Validate OpenRouter API key

### Environment Variables

**Issue**: Variables not accessible in frontend
**Solution**: Ensure all variables start with `VITE_`

## 📊 Monitoring and Maintenance

### 1. Regular Checks

- **Weekly**: Review build logs and performance
- **Monthly**: Update dependencies
- **Quarterly**: Review security settings

### 2. Performance Optimization

- **Enable Netlify Analytics**
- **Use CDN caching**
- **Optimize images and assets**

### 3. Security Updates

- **Keep dependencies updated**
- **Monitor for security vulnerabilities**
- **Regular security audits**

## 🔄 Continuous Deployment

### 1. Automatic Deploys

Netlify automatically deploys when you:
- Push to main branch
- Create pull requests
- Merge pull requests

### 2. Branch Deploys

- **Preview deployments** for pull requests
- **Branch-specific builds** for testing
- **Staging environments** for pre-production

### 3. Rollback

If issues occur:
1. Go to **Deploys** tab
2. **Find a working deployment**
3. **Click "Publish deploy"**

## 📱 Mobile Optimization

### 1. PWA Features

- **Add manifest.json** for app-like experience
- **Configure service worker** for offline support
- **Optimize for mobile** devices

### 2. Performance

- **Lazy load** components
- **Optimize images** for mobile
- **Minimize bundle size**

## 🌐 Internationalization

### 1. Multi-language Support

- **Add language detection**
- **Implement translations**
- **Support RTL languages**

### 2. Localization

- **Date/time formatting**
- **Number formatting**
- **Currency support**

## 🔐 Security Considerations

### 1. HTTPS

- **Netlify provides automatic HTTPS**
- **Force HTTPS redirects**
- **Secure cookie settings**

### 2. Headers

Configure security headers in `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### 3. Environment Variables

- **Never commit sensitive data**
- **Use Netlify's encrypted variables**
- **Rotate API keys regularly**

## 📈 Scaling

### 1. Performance

- **Enable Netlify Edge Functions**
- **Use CDN for static assets**
- **Implement caching strategies**

### 2. Monitoring

- **Set up alerts** for downtime
- **Monitor response times**
- **Track user engagement**

## 🎯 Success Metrics

Track these key performance indicators:

- **Deployment success rate**: >95%
- **Build time**: <5 minutes
- **Page load time**: <3 seconds
- **Uptime**: >99.9%

## 📞 Support

### 1. Netlify Support

- **Documentation**: [docs.netlify.com](https://docs.netlify.com)
- **Community**: [community.netlify.com](https://community.netlify.com)
- **Support tickets**: Available on paid plans

### 2. Application Support

- **Check application logs**
- **Review error monitoring**
- **Test in different environments**

## 🎉 Congratulations!

Your AI Chatbot is now deployed and accessible worldwide! 

**Next steps:**
1. Share your deployment URL
2. Monitor performance
3. Gather user feedback
4. Iterate and improve

---

**Deployment URL**: `https://your-site-name.netlify.app`

**Support**: Check the main README.md for troubleshooting and maintenance tips.
