#!/usr/bin/env node

/**
 * Static build script for Vercel deployment
 * This script builds only the frontend without server dependencies
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync } from 'fs';

console.log('🚀 Building static version for deployment...\n');

// Clean dist folder
if (existsSync('dist')) {
  execSync('rm -rf dist');
}

// Build frontend only
console.log('Building frontend...');
try {
  execSync('vite build', { stdio: 'inherit' });
  console.log('✅ Frontend build complete');
} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  process.exit(1);
}

// Create necessary files for static hosting
if (!existsSync('dist/public')) {
  console.error('❌ dist/public directory not found');
  process.exit(1);
}

// Create _redirects for SPA routing
writeFileSync('dist/public/_redirects', '/*    /index.html   200\n');

// Create robots.txt if it doesn't exist
if (!existsSync('dist/public/robots.txt')) {
  writeFileSync('dist/public/robots.txt', `User-agent: *
Allow: /

Sitemap: https://elsokhnayatchs.com/sitemap.xml`);
}

console.log('✅ Static build ready for deployment');
console.log('📁 Output: dist/public');