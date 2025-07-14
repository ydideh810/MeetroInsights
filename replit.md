# MEETRO - Meeting Recovery System

## Overview

MEETRO is a cyberpunk-themed meeting recovery system that helps users extract actionable insights from meeting transcripts. The application allows users to upload meeting files (text, DOCX, or SRT), analyze them using OpenAI's GPT-4 API, and generate structured meeting summaries with key decisions, action items, and follow-ups.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### January 14, 2025
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
- **Typography**: Doto font for display text, Tourney for headings, Tektur for monospace
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
- **Home Page**: Main interface with three-column layout (upload, processing, output)
- **UploadPanel**: File upload and form inputs for meeting context
- **ProcessingCenter**: Analysis controls and status display with interactive MAGI selection
- **OutputPanel**: Structured display of meeting insights
- **ExportButton**: Individual export buttons for copy, download, and Notion integration
- **FileUpload**: Drag-and-drop file upload component with validation
- **MagiGuide**: Interactive guide explaining MAGI system metaphors and usage

### Backend Services
- **File Parser**: Handles .txt, .docx, and .srt file processing
- **OpenAI Service**: Interfaces with GPT-4 API for meeting analysis
- **Storage**: In-memory storage implementation (prepared for database integration)

### Database Schema
- **meetings**: Stores meeting transcripts, metadata, and analysis results
- **users**: User management (prepared but not implemented)

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