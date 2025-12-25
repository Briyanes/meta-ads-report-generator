# Security Measures

This application implements multiple layers of security to protect against common web vulnerabilities and malware attacks.

## Security Features

### 1. HTTP Security Headers
The application includes the following security headers:

- **X-Frame-Options: SAMEORIGIN** - Prevents clickjacking attacks
- **X-Content-Type-Options: nosniff** - Prevents MIME-sniffing attacks
- **X-XSS-Protection: 1; mode=block** - Enables XSS protection
- **Strict-Transport-Security** - Enforces HTTPS connections
- **Content-Security-Policy** - Restricts resources that can be loaded
- **Referrer-Policy** - Controls referrer information
- **Permissions-Policy** - Restricts browser features

### 2. API Security

#### Origin Validation
- All API routes validate the origin of incoming requests
- Only allowed origins can access the API
- Configure via `ALLOWED_ORIGINS` environment variable

#### Input Validation
- File type validation (CSV only)
- File size limits (50MB max)
- Retention type validation (wow, mom)
- Objective type validation (ctwa, cpas, ctlptowa)
- Report name sanitization (XSS prevention)

#### File Upload Security
- Extension validation (.csv only)
- MIME type checking
- File size limits
- Content validation

### 3. Rate Limiting
- API routes are rate-limited to prevent abuse
- 100 requests per 5 minutes per IP
- Implemented via middleware
- Automatic cleanup of expired entries

### 4. CORS Protection
- Cross-Origin Resource Sharing is controlled
- Only whitelisted origins can access APIs
- Prevents unauthorized domain access

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Best Practices

### For Production

1. **Always use HTTPS** - Ensure SSL/TLS certificates are properly configured
2. **Update allowed origins** - Only include your production domains
3. **Monitor logs** - Keep an eye on security-related logs
4. **Keep dependencies updated** - Regularly update npm packages
5. **Use strong passwords** - For any admin or database access

### Regular Maintenance

1. Review and update security headers periodically
2. Monitor for suspicious activity
3. Keep Next.js and dependencies updated
4. Regular security audits
5. Test with security scanners

## Troubleshooting

### Malware Detection

If your domain gets flagged for malware:

1. **Scan your deployment** - Use tools like Sucuri, VirusTotal
2. **Check files** - Look for suspicious file modifications
3. **Review access logs** - Check for unusual traffic patterns
4. **Update credentials** - Change all passwords and API keys
5. **Clean environment** - Re-deploy from a clean state

### Getting Unflagged

1. Submit your site to Google Search Console for review
2. Request malware review through Google Webmaster Tools
3. Ensure all security measures are in place
4. Monitor for any future compromises

## Security Checklist

- [x] Security headers implemented
- [x] API origin validation
- [x] Input validation and sanitization
- [x] File upload security
- [x] Rate limiting
- [x] CORS protection
- [x] CSP headers
- [x] Environment variable configuration
- [ ] Regular security audits (recommended)
- [ ] Dependency scanning (recommended)

## Additional Resources

- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)

## Reporting Security Issues

If you discover a security vulnerability, please report it immediately to:
- Email: security@hadona.id
- GitHub Issues: Create a private security issue

Do not disclose publicly until a fix has been deployed.
