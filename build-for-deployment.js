#!/usr/bin/env node

/**
 * Build script for deployment preparation
 * This script helps prepare the project for static deployment
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';

console.log('🚀 Preparing project for deployment...\n');

// 1. Clean previous builds
console.log('1. Cleaning previous builds...');
try {
  if (existsSync('dist')) {
    execSync('rm -rf dist', { stdio: 'inherit' });
  }
} catch (error) {
  console.log('   No previous build found');
}

// 2. Build the project
console.log('\n2. Building the project...');
try {
  execSync('vite build', { stdio: 'inherit' });
  console.log('   ✅ Build successful');
} catch (error) {
  console.error('   ❌ Build failed:', error.message);
  process.exit(1);
}

// 3. Create additional deployment files
console.log('\n3. Creating deployment files...');

// Create _redirects for Netlify
const redirectsContent = `/*    /index.html   200`;
writeFileSync('dist/public/_redirects', redirectsContent);

// Create .htaccess for Apache servers
const htaccessContent = `RewriteEngine On
RewriteRule ^.*$ /index.html [QSA,L]`;
writeFileSync('dist/public/.htaccess', htaccessContent);

console.log('   ✅ Created _redirects and .htaccess files');

// 4. Deployment instructions
console.log('\n📋 Deployment Instructions:');
console.log('   • For Vercel: Connect your GitHub repo and deploy');
console.log('   • For Netlify: Upload the dist/public folder');
console.log('   • For GitHub Pages: Push dist/public to gh-pages branch');
console.log('   • For other hosts: Upload contents of dist/public folder');

console.log('\n🎉 Project ready for deployment!');
console.log('📁 Deploy folder: dist/public');