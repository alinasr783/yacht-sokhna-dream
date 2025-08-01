# Yacht Rental Website - Replit Project

## Project Overview
A comprehensive yacht rental/charter website with public-facing rental interface and admin dashboard. Built with React frontend and Supabase backend integration.

## User Preferences
- **Database**: Keep using Supabase - user specifically requested to maintain Supabase integration instead of migrating to Replit's database
- **Language**: User communicates in Arabic, indicating preference for RTL support
- **Architecture**: React frontend with Supabase backend for database and storage

## Project Architecture
- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL database + Storage + Auth)
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **Image Storage**: Supabase Storage with separate buckets (yacht-images, location-images, article-images)

## Database Structure (Supabase)
- `yachts` - Yacht listings with multilingual support
- `yacht_images` - Yacht image references
- `locations` - Location listings with multilingual support  
- `articles` - Blog articles with multilingual content
- `contact_info` - Contact information management
- `admin_users` - Admin authentication

## Recent Changes (2025-08-01)
- **Major SEO Enhancement**: Implemented comprehensive bilingual SEO optimization
  - Added dynamic meta tags that adapt based on current language (Arabic/English)
  - Implemented Open Graph and Twitter Cards for better social media sharing
  - Added JSON-LD structured data for local business schema
  - Created SEOHead component for dynamic meta tag management across all pages
  - Enhanced HTML document with language attributes and canonical URLs
  - Added preconnect links for improved performance
  - Included favicon and Apple touch icons
- Fixed critical image upload functionality across admin dashboard
- Corrected AdminArticlesPage to properly save image_url field when uploading images
- Updated AdminYachtsPage to save yacht images to yacht_images table after yacht creation
- Fixed AdminLocationsPage to support image uploads (may need image_url column in locations table)
- Fixed admin login navigation issue - now properly redirects to dashboard after successful login
- Fixed image handling where images were uploading to Supabase Storage but URLs weren't being saved to database
- Added image display in admin dashboard cards for yachts, locations, and articles
- Fixed data type compatibility issues between Supabase null values and TypeScript undefined types
- Enhanced yacht cards to display first uploaded image with proper fallback handling
- Enhanced location cards to display uploaded images with proper error handling

## Key Features
- Multilingual support (English/Arabic)
- Admin dashboard for managing yachts, locations, articles, users, and contact info
- Image upload and management via Supabase Storage
- Responsive design with RTL support
- Public yacht rental interface

## Important Notes
- User explicitly wants to keep Supabase rather than migrate to Replit database
- Focus on maintaining existing Supabase integration and fixing functionality
- Ensure proper image URL storage in database tables after Supabase Storage uploads