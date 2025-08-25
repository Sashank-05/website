# Sashank's Portfolio Website

A modern portfolio website built with HTML, CSS, and JavaScript.

## Custom Domain Setup

This repository includes a `CNAME` file for custom domain configuration with GitHub Pages.

### To use your custom domain:

1. Replace the content of the `CNAME` file with your actual domain name (e.g., `yourdomain.com`)
2. Configure your domain's DNS settings to point to GitHub Pages:
   - For apex domain (yourdomain.com): Create A records pointing to:
     - `185.199.108.153`
     - `185.199.109.153` 
     - `185.199.110.153`
     - `185.199.111.153`
   - For subdomain (www.yourdomain.com): Create a CNAME record pointing to `your-username.github.io`
3. GitHub Pages will automatically detect the CNAME file and configure the custom domain

### Features

- Responsive design
- Dark/light theme toggle
- Interactive animations with Three.js
- Portfolio showcase
- Blog section
- Contact form

## Deployment

This site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the main branch.