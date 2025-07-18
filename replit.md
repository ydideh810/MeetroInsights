# NEURAKEI - Meeting Recovery System

## Overview

NEURAKEI is a cyberpunk-themed meeting recovery system that helps users extract actionable insights from meeting transcripts. The application allows users to upload meeting files (text, DOCX, or SRT), analyze them using OpenAI's GPT-4 API, and generate structured meeting summaries with key decisions, action items, and follow-ups.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### January 16, 2025
- **Export Options UI Update**: Moved export options (copy, download, notion) from header to user account dropdown menu
  - Added proper styling for menu-based export buttons with full-width layout and icons
  - Created separate "EXPORT OPTIONS" section within user menu that only appears when analysis is available
  - Updated ExportButton component to support both header and menu variants
  - Cleaner header layout focused on core system functions
- **Loading Demo Removal**: Removed loading demo showcase button and overlay from header interface
  - Simplified header layout by removing the "LOADING DEMO" button
  - Removed associated state management and overlay components
  - Maintained core functionality while streamlining the interface
- **User Account Menu Fix**: Improved dropdown menu readability with solid dark background
  - Added proper background contrast (hsl(0, 0%, 8%)) to dropdown menu
  - Enhanced visual separation with borders and shadows
  - Maintained cyberpunk styling while ensuring good readability
- **Deployment Documentation**: Created comprehensive README.md with deployment instructions
  - Added step-by-step guides for Vercel, Netlify, Railway, and Render platforms
  - Included environment variable setup and configuration details
  - Provided troubleshooting section and performance optimization tips
  - Covered Firebase, database, and security configuration requirements
- **Analysis Hanging Issue Resolution**: Fixed critical OpenRouter API model name issue
  - Identified root cause: incorrect model name `deepseek/deepseek-r1-0528:free` should be `deepseek/deepseek-r1-0528`
  - Added comprehensive debugging tools, timeout protection (60s), and error handling
  - Enhanced logging to track analysis progress and identify API issues
  - Created health check endpoint (/api/health) to verify API key and database connection
  - Updated DEPLOYMENT_TROUBLESHOOTING.md with complete debugging guide
  - Analysis now works correctly in both preview and deployed environments
- **File Upload Processing State Fix**: Fixed issue where file upload appeared to trigger automatic analysis
  - Root cause: File upload set `setIsProcessing(true)` but never reset to `false` after completion
  - Fixed by adding `setIsProcessing(false)` to both success and error handlers in upload and emergency recovery mutations
  - File upload now properly shows loading state during upload only, not analysis
  - Emergency recovery system also properly manages processing state
- **Responsive Micro-Interactions Implementation**: Added comprehensive cyberpunk-themed micro-interactions across all UI components
  - Created 15+ CSS animation classes: micro-hover, pulse-glow, slide-in, scale-click, button-glow, card-float, input-focus, cyber-ripple, data-stream, rotate-hover, border-scan, stagger-fade, matrix-text
  - Enhanced ContentModeToggle with smooth hover effects, pulse animations, and scanning borders
  - Added TRI-CORE button micro-interactions with ripple effects, data streams, and enhanced hover states
  - Updated ProcessingCenter with animated hexagonal buttons and enhanced visual feedback
  - Improved UploadPanel with focus animations for all input fields and enhanced panel transitions
  - Added button glow effects and click animations to ExportButton, CreditDisplay, and AuthButton components
  - Enhanced header with matrix text effects and border scanning animations
  - Applied stagger-fade animations to main interface for smooth page transitions
  - All interactions use cubic-bezier easing for smooth, professional animations
  - Maintained cyberpunk aesthetic with red/blue color scheme and sci-fi visual effects
- **DISTRICT-7 Branding Update**: Replaced "Tokyo-3" with "DISTRICT-7" for consistent cyberpunk branding
  - Updated header location text from "TOKYO-3 ZENTRA" to "DISTRICT-7 ZENTRA"
  - Changed CSS class from "tokyo-3-grid" to "district-7-grid" for background styling
  - Maintained cyberpunk aesthetic while updating location branding

### January 15, 2025
- **Complete KAIRO → NEURAKEI Rebranding**: Updated all system references from KAIRO to NEURAKEI throughout the application
  - Updated main logo and branding in header from KAIRO to NEURAKEI
  - Changed all AI service prompts to use NEURAKEI identity
  - Updated all welcome messages and authentication flows to use NEURAKEI
  - Updated mentor system references and guidance text to use NEURAKEI
  - Updated OpenAI service headers and referer URLs to use NEURAKEI
  - Updated localStorage keys to use neurakei prefix
  - Updated all user-facing text and documentation to use NEURAKEI branding
  - Maintained cyberpunk aesthetic and functionality while updating terminology
- **Payment and License Key System Updates**: Updated payment integration and license key format
  - Changed payment link from Lemon Squeezy to Payhip (https://payhip.com/b/dAc53)
  - Updated license key format from UUID to A7THT-4FJYV-2UYKD-ESA6Y structure
  - Updated license key validation regex to match new 5-5-5-5 alphanumeric format
  - Updated all UI components and documentation to reflect new license key format
- **Complete Color Scheme Update**: Changed orange to red (#FF0000) and cyan to bright blue (#3366FF) across all CSS and components
  - Updated all CSS variables and color references in index.css
  - Changed background gradients, animations, and visual effects to use new color palette
  - Updated all component styling to use red and bright blue instead of orange and cyan
  - Maintained cyberpunk aesthetic with new color scheme
  - Updated all hover effects, borders, and glow animations
- **Font Consolidation**: Reduced font mix to only use "doto" and "tourney" fonts throughout the application
  - Removed "tektur" font dependency from Google Fonts import
  - Updated all UI components to use only doto (display) and tourney (headings/monospace)
  - Maintained cyberpunk aesthetic with simplified typography system
  - Updated Tailwind config to remove tektur font references
- **Complete MAGI → SHINRAI Rebranding**: Updated all MAGI system references to SHINRAI throughout the application
  - Changed all frontend components from "MAGI" to "SHINRAI" system branding
  - Updated ProcessingCenter, AIMentor, ContextualGuidance, UploadPanel, OutputPanel, and MemoryBank
  - Renamed MagiGuide.tsx to ShinraiGuide.tsx with updated imports and references
  - Updated prop naming from "magiMode" to "shinraiMode" across all components
  - Updated database schema: renamed "magi_mode" column to "shinrai_mode"
  - Updated backend storage and routes to use new property names
  - Maintained all existing functionality while updating terminology

### January 14, 2025
- **Complete System Rebranding**: Updated all MAGI names and system branding throughout the application
  - Changed MAGI names: Melchior → Synthrax, Balthasar → Vantix, Casper → Lymnia
  - Updated organization name: NERV → ZENTRA
  - Updated system name: MEETRO → NEURAKEI
  - Updated all UI components, guides, prompts, and documentation
  - Maintained cyberpunk aesthetic with new naming convention
  - Updated AI service prompts to use new system identity
- **Personalized AI Mentor Guidance**: Implemented complete AI-powered mentor system for personalized navigation assistance
  - Contextual tips based on user behavior, credit levels, and system usage patterns
  - Six tip categories: welcome, transcript guidance, credit warnings, post-analysis guidance, Memory Bank intro, and advanced features
  - Intelligent dismissal system with one-time and persistent tips stored per user
  - API endpoints for mentor session tracking and user progress management
  - Integration with existing authentication and user data systems
  - Cyberpunk-styled floating guidance cards with actionable buttons
  - Automatic tip generation based on analysis count, Memory Bank usage, and credit levels
- **License Key Redemption System**: Implemented complete license key validation and redemption system
  - PostgreSQL database table for storing license keys with redemption status
  - API endpoint for validating and redeeming license keys
  - React component with form validation and error handling
  - Account dropdown integration for easy access to redemption
  - UUID format validation (e.g., 213473B2-CB4E-484F-914D-376C0510445B)
  - Automatic credit addition (10 credits per key) with transaction safety
  - Prevention of duplicate redemptions with clear error messages
- **AI-Powered Meeting Moment Highlight Reel**: Implemented complete highlight reel system for identifying key meeting moments
  - Six highlight types: Decision, Breakthrough, Conflict, Insight, Emotional, Turning Point
  - Intensity scoring (1-10) for each moment based on impact and significance
  - Interactive playback controls with auto-advance functionality
  - Timeline visualization with color-coded moment types
  - Tabbed interface in output panel for seamless switching between analysis and highlights
- **Enhanced AI Analysis**: Updated all three MAGI modes to generate meeting highlights alongside standard analysis
  - Synthrax: Technical moments and implementation decisions
  - Vantix: Strategic moments and business impact
  - Lymnia: Emotional moments and interpersonal dynamics
- **Retro-Futuristic Loading Screens**: Implemented complete loading screen system with four distinct variants
  - MAGI System: Hexagonal core with synchronized rotation and circuit patterns
  - Neural Network: Neural pathways with node connections and electrical effects
  - Data Processing: Data streams with scan lines and protocol parsing
  - Quantum Field: Quantum particle simulation with field stabilization effects
- **Loading Screen Integration**: Added loading screens to all major processes (file upload, analysis, memory bank)
- **Loading Demo Interface**: Created interactive showcase for all loading screen variants
- **Animation Framework**: Built robust animation system with CSS keyframes and synchronized effects
- **Credit System Implementation**: Added complete credit tracking system with 10 starting credits per user
- **Payment Integration**: Connected Payhip payment link for credit refills
- **Credit Deduction**: Analysis now costs 1 credit per request with automatic deduction
- **Low Credit Warnings**: Credit display shows warnings and buy button when credits are low
- **Credit Error Handling**: Proper error handling for insufficient credits with payment redirection
- **User Database**: Updated user schema with credit tracking and automatic user creation
- **Credit Refunds**: Failed analysis attempts automatically refund credits to user
- **Email Authentication**: Added complete email sign-in/up functionality with password reset alongside Google authentication
- **Enhanced Login UI**: Created tabbed authentication interface with sign-in and sign-up forms
- **Password Management**: Implemented password visibility toggle and password reset functionality
- **Form Validation**: Added comprehensive form validation with error handling and user feedback
- **Firebase Authentication**: Implemented complete Firebase authentication system with Google sign-in
- **User-Specific Data**: Added user authentication to all Memory Bank operations and database schema
- **Database Schema Update**: Added userId fields to meetings and tags tables for user data isolation
- **Protected Routes**: Created authentication middleware and protected route component
- **Authentication Context**: Built React context for managing user authentication state
- **Token Management**: Implemented Firebase token handling for secure API requests
- **Cyberpunk Memory Bank**: Implemented complete Memory Bank feature with PostgreSQL database integration
- **Meeting Storage**: Added ability to save meeting analyses with titles, categories, and custom tags
- **Tag System**: Created color-coded tagging system for organizing meeting insights
- **Search & Filter**: Added search functionality and category/tag filtering for stored meetings
- **Database Integration**: Switched from in-memory storage to PostgreSQL with Drizzle ORM
- **Complete API Layer**: Built comprehensive REST API endpoints for Memory Bank operations
- **PDF File Support**: Added PDF file upload and parsing capability using pdfjs-dist library
- **Enhanced File Processing**: Extended file parser to handle PDF documents alongside existing .txt, .docx, .srt formats
- **Synchronized MAGI Animation**: Implemented unified animation system for all three MAGI buttons with staggered timing
- **Improved Button Stability**: Fixed glitching issues with MAGI button hover effects and transitions
- **Complete Footer Removal**: Removed terminal status bar footer and integrated system status into navbar
- **Navbar Enhancement**: Added system status indicators (SYS, MEM, CPU) to top navigation bar

### January 13, 2025
- **Export UI Redesign**: Moved export options (copy, download, Notion) from footer to top navigation bar
- **Component Refactoring**: Replaced ExportBar component with individual ExportButton components
- **Navbar Enhancement**: Added export functionality to header with compact button design
- **Layout Optimization**: Removed footer export bar to create cleaner interface

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom cyberpunk theme (dark background, orange/cyan accent colors)
- **Typography**: Doto font for display text, Tourney for headings and monospace elements
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **File Processing**: Multer for multipart file uploads with in-memory storage
- **AI Integration**: OpenAI GPT-4 API for meeting analysis
- **Database**: PostgreSQL with Drizzle ORM (configured but not fully implemented)
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and schemas
- `migrations/` - Database migration files (Drizzle)

## Key Components

### Frontend Components
- **Home Page**: Main interface with three-column layout (upload, processing, output/memory bank)
- **UploadPanel**: File upload and form inputs for meeting context
- **ProcessingCenter**: Analysis controls and status display with interactive MAGI selection
- **OutputPanel**: Structured display of meeting insights with save-to-memory functionality
- **MemoryBank**: Complete meeting archive interface with search, filter, and management features
- **SaveMeetingDialog**: Modal dialog for saving meetings with title, category, and tag selection
- **ExportButton**: Individual export buttons for copy, download, and Notion integration
- **FileUpload**: Drag-and-drop file upload component with validation
- **MagiGuide**: Interactive guide explaining MAGI system metaphors and usage
- **AuthButton**: Firebase authentication button with Google sign-in and user profile display
- **ProtectedRoute**: Authentication guard component that shows login screen for unauthenticated users
- **AuthContext**: React context for managing authentication state and user data

### Backend Services
- **File Parser**: Handles .txt, .docx, .srt, and .pdf file processing
- **OpenAI Service**: Interfaces with GPT-4 API for meeting analysis via OpenRouter
- **Database Storage**: PostgreSQL implementation with Drizzle ORM for persistent data
- **Memory Bank API**: Complete REST API for meeting CRUD operations, search, and tag management

### Database Schema
- **meetings**: Stores meeting transcripts, metadata, analysis results, titles, categories, MAGI modes, and user IDs
- **tags**: Custom color-coded tags for organizing meetings, linked to specific users
- **meeting_tags**: Junction table linking meetings to tags for many-to-many relationship
- **users**: User management with Firebase authentication and credit tracking
- **license_keys**: License key management with redemption tracking, credits, and user associations

## Data Flow

1. **File Upload**: Users upload meeting files or paste transcript text
2. **File Processing**: Server extracts text content from various file formats
3. **Analysis Request**: Frontend sends transcript and context to analysis endpoint
4. **AI Processing**: OpenAI GPT-4 analyzes the meeting content
5. **Result Display**: Structured analysis displayed in cyberpunk-themed interface
6. **Export**: Users can export results in text or markdown format

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Database ORM with TypeScript support
- **openrouter**: OpenRouter API for AI model access (using DeepSeek R1)
- **multer**: File upload handling
- **pdf-parse**: PDF document text extraction
- **express**: Web framework for Node.js

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Build Process
- Frontend: Vite builds React app to `dist/public/`
- Backend: esbuild bundles Express server to `dist/`
- Database: Drizzle migrations manage schema changes

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENROUTER_API_KEY`: OpenRouter API authentication for AI model access
- `NODE_ENV`: Environment mode (development/production)
- Firebase configuration (client-side):
  - `VITE_FIREBASE_API_KEY`: Firebase API key for authentication
  - `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
  - `VITE_FIREBASE_APP_ID`: Firebase app ID

### Production Configuration
- Express serves static files from `dist/public/`
- PostgreSQL database with connection pooling
- File upload limits: 10MB maximum size
- Supported file types: .txt, .docx, .srt, .pdf

### Development Setup
- Hot module replacement via Vite
- TypeScript compilation checking
- Real-time API logging with request/response details
- Error overlay for runtime issues

## Technical Decisions

### Database Choice
- **PostgreSQL with Drizzle ORM**: Chosen for type safety, migration management, and SQL flexibility
- **Neon Database**: Serverless PostgreSQL for easy deployment and scaling
- **Alternative considered**: In-memory storage currently used for development simplicity

### AI Integration
- **OpenRouter API with DeepSeek R1**: Cost-effective AI model access with high-quality reasoning
- **Enhanced System Prompts**: Comprehensive Meetro personality with specialized MAGI modes
- **Three Analysis Modes**:
  - MELCHIOR (Analyst): Facts, clarity, structured output
  - BALTHASAR (Strategist): Priorities, execution, foresight
  - CASPER (Human Layer): Emotion, tone, interpersonal dynamics
- **Emergency Recovery Mode**: Plausible reconstruction from limited information
- **Error Handling**: Comprehensive error management for API failures

### File Processing
- **Multiple Format Support**: .txt, .docx, .srt, and .pdf files for maximum compatibility
- **In-Memory Processing**: Files processed in memory for security and performance
- **Size Limits**: 10MB maximum to prevent resource exhaustion

### UI/UX Design
- **Cyberpunk Theme**: Dark background with orange/cyan accents for unique visual identity
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Radix UI components ensure WCAG compliance