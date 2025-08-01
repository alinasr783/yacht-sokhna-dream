#!/bin/bash

# Build script for Vercel deployment
echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building the project..."
vite build

# Check if dist/public exists
if [ -d "dist/public" ]; then
    echo "✅ Build successful! Output directory: dist/public"
    ls -la dist/public
else
    echo "❌ Build failed - no output directory found"
    exit 1
fi

echo "🎉 Build complete!"