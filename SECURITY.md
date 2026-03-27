# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest | :x:                |

## Reporting a Vulnerability

We take the security of Cazza.ai seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do NOT report security vulnerabilities through public GitHub issues.**

### How to Report

1. **Email**: Send an email to security@cazza.ai with details of the vulnerability
2. **Include**:
   - Type of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
   - Your contact information

### What to Expect

- **Acknowledgement**: We will acknowledge receipt of your report within 48 hours
- **Assessment**: Our security team will assess the vulnerability
- **Timeline**: We aim to provide an initial assessment within 5 business days
- **Updates**: We will keep you informed of our progress
- **Fix & Disclosure**: Once fixed, we will disclose the vulnerability in our release notes

### Scope

The following are considered in-scope for security reports:
- The Cazza.ai frontend application code
- Authentication/authorization bypasses
- Data exposure vulnerabilities
- Injection attacks (XSS, SQL injection, etc.)
- CSRF vulnerabilities
- Authentication issues

### Out of Scope

The following are generally considered out of scope:
- Theoretical vulnerabilities without proof of concept
- Social engineering attacks
- Physical security breaches
- Issues related to third-party services we integrate with
- Denial of service attacks

## Security Best Practices

### For Developers
- Always validate and sanitize user input
- Use parameterized queries/prepared statements
- Implement proper authentication and authorization checks
- Keep dependencies up to date
- Follow the principle of least privilege
- Use HTTPS in production
- Implement proper error handling (don't leak stack traces)

### For Users
- Use strong, unique passwords
- Enable two-factor authentication where available
- Keep your browser and operating system updated
- Be cautious of phishing attempts
- Report suspicious activity immediately

## Dependency Security

We regularly:
- Update dependencies to patch security vulnerabilities
- Run security audits on our codebase
- Use automated vulnerability scanning in our CI/CD pipeline
- Monitor security advisories for our dependencies

## Responsible Disclosure

We believe in responsible disclosure and will:
- Credit security researchers who report valid vulnerabilities
- Work with researchers to understand and fix issues
- Disclose vulnerabilities to users in a timely manner
- Not take legal action against researchers acting in good faith

## Contact

For security-related issues: security@cazza.ai

For general support: support@cazza.ai