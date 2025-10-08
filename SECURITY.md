# Security Policy

## Reporting Security Vulnerabilities

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: security@flowstate.app

You should receive a response within 48 hours.

Please include:
- Type of issue (e.g., SQL injection, XSS, etc.)
- Full paths of source files related to the issue
- Step-by-step instructions to reproduce
- Proof-of-concept or exploit code (if possible)
- Impact of the issue

## Security Best Practices

### Authentication
- Magic link authentication via NextAuth.js
- Short-lived session tokens
- CSRF protection enabled
- No password storage

### API Security
- All API routes require authentication
- Input validation with Zod schemas
- SQL injection prevention via Prisma ORM

### Extension Security
- Content Security Policy enforced
- Extension ↔ Web app communication via signed tokens
- No execution of arbitrary code from web pages
- Minimal permissions requested

### Data Storage
- Sensitive data encrypted at rest
- No localStorage for authentication tokens
- Server-side session management

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | ✅                 |

## Compliance

FlowState follows:
- OWASP Top 10 guidelines
- Chrome Extension security guidelines
- Privacy-by-design principles
