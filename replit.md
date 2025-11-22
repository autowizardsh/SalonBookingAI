# Salon Booking & AI Assistant Platform

## Overview

A full-stack web application for salon appointment booking featuring an AI-powered chatbot assistant. The platform enables customers to discover services and stylists, book appointments through conversational AI, and provides administrators with comprehensive management tools for services, stylists, schedules, and bookings.

**Core Features:**
- AI chatbot-based booking system with natural language processing
- Public landing pages showcasing services, stylists, and testimonials
- Admin dashboard for managing all salon operations
- User authentication via Replit Auth with role-based access control
- Real-time availability checking and appointment scheduling

## User Preferences

Preferred communication style: Simple, everyday language.

## Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin`
- Access: Full admin dashboard at `/admin`

**Stylist Accounts:**
- Username: `emma` | Password: `emma` | Linked to: Emma Rodriguez
- Username: `sophia` | Password: `sophia` | Linked to: Sophia Chen  
- Username: `isabella` | Password: `isabella` | Linked to: Isabella Martinez
- Access: Stylist portal at `/stylist` to view appointments, schedules, and profile

**Login Pages:**
- Universal login at `/login` for all staff (admin + stylists) using username/password
- Admin-specific login at `/admin/login` (legacy, redirects to /login)
- Customers use Replit Auth (OIDC) for bookings - no username/password

**Authentication Design:**
- Staff (admin + stylists): Local username/password authentication via Passport-local
- Customers: OIDC authentication via Replit Auth
- All endpoints support both auth types using `getRequestUserId()` helper function
- Role-based auto-redirect after login: admin → /admin, stylist → /stylist

## System Architecture

### Frontend Architecture

**Framework:** React 18+ with TypeScript, using Vite as the build tool and development server.

**UI Component System:**
- **Design System:** shadcn/ui components built on Radix UI primitives
- **Styling:** Tailwind CSS with custom design tokens defined in CSS variables
- **Typography:** Inter/DM Sans for body text, Playfair Display for elegant headlines
- **Theme:** Custom color system with HSL-based tokens supporting light/dark modes
- **Responsive Design:** Mobile-first approach with breakpoints managed via Tailwind

**State Management:**
- **Data Fetching:** TanStack Query (React Query) for server state management
- **Form Handling:** React Hook Form with Zod validation via @hookform/resolvers
- **Router:** Wouter for lightweight client-side routing

**Key Pages:**
- Landing page (public) - Service showcases, stylist profiles, testimonials
- Home page (authenticated) - User dashboard with upcoming bookings
- Booking page - Calendar-based and AI chatbot booking interfaces
- Admin panel - Multi-section dashboard for salon management

**Design Philosophy:**
Draws inspiration from premium booking platforms (Airbnb UX, Treatwell flows, Glossier aesthetics) with emphasis on visual sophistication, trust-building imagery, and effortless booking experience.

### Backend Architecture

**Runtime:** Node.js with Express.js framework, using ESM modules.

**Database Layer:**
- **ORM:** Drizzle ORM for type-safe database operations
- **Schema Location:** Shared schema definitions in `/shared/schema.ts`
- **Connection:** Neon serverless PostgreSQL via WebSocket connection

**Authentication:**
- **Provider:** Replit Auth using OpenID Connect (OIDC)
- **Session Management:** Express sessions stored in PostgreSQL via connect-pg-simple
- **Authorization:** Role-based access control (admin/customer roles)
- **Middleware:** Custom middleware for authenticated and admin-only routes

**API Structure:**
- RESTful endpoints under `/api` prefix
- CRUD operations for services, stylists, schedules, bookings, customers
- Specialized endpoints for AI chat integration and user-specific bookings
- Status updates and relationship management (stylist-service associations)

**AI Integration:**
- OpenAI-compatible API through Replit AI Integrations (gpt-4o-mini)
- Function calling enabled with two specialized tools:
  - `check_availability`: Real-time availability validation against stylist schedules and bookings
  - `create_booking`: Guest booking creation without authentication required
- Conversational booking assistant guides users through multi-step flow:
  1. Service/stylist selection
  2. Date and time collection
  3. Availability verification
  4. Contact information gathering (name, email, phone)
  5. Booking confirmation and creation
- Comprehensive validation chain:
  - Stylist-service relationship verification (junction table)
  - Schedule day-of-week and working hours validation
  - Booking conflict detection (duration-aware overlaps)
  - UTC-based timezone-stable date handling
- Guest user management via upsert pattern (automatic creation)
- Public endpoint at `/api/chat` accessible from landing page
- Server-side logging for debugging AI function calls

**Email Notification System:**
- **Service:** Resend integration for transactional emails (3,000 emails/month free tier)
- **Confirmation Emails:** Sent immediately after successful booking creation
  - Professional HTML templates with salon branding
  - Includes booking details: service, stylist, date, time, price, duration
  - Customer name and contact information
  - Sent to `customerEmail` provided during booking
- **Reminder Emails:** Sent 24 hours before appointments
  - Daily scheduler runs at 9:00 AM (America/New_York timezone)
  - Checks for next-day appointments with `status: 'pending'`
  - Same template structure as confirmation emails
  - Timezone-aware using Luxon library to prevent drift
- **Implementation:**
  - Email utilities in `server/email.ts`
  - Scheduler logic in `server/scheduler.ts`
  - Reminder endpoint at `POST /api/send-reminders`
  - Graceful error handling (bookings succeed even if email fails)
  - Console logging for debugging email sends
- **Configuration:**
  - Timezone: `SALON_TIMEZONE = "America/New_York"` (configurable)
  - Reminder time: 9:00 AM salon local time
  - Environment variable: `RESEND_API_KEY` (managed via Resend connector)

### Data Models

**Core Entities:**
- **Users:** Authentication data, role assignment (admin/customer), profile information
- **Services:** Name, description, category, duration, price, images
- **Stylists:** Profile, bio, specialization, experience, ratings, images
- **Schedules:** Stylist availability by day of week with time ranges
- **Bookings:** Customer appointments with service, stylist, date, time, status tracking
- **Stylist-Services:** Many-to-many relationship between stylists and services

**Relationships:**
- Users → Bookings (one-to-many)
- Stylists → Schedules (one-to-many)
- Stylists ↔ Services (many-to-many via junction table)
- Services → Bookings (one-to-many)
- Stylists → Bookings (one-to-many)

**Database State:**
- **Stylist Schedules (populated):**
  - Emma Rodriguez: Monday-Saturday, 9am-5pm
  - Sophia Chen: Monday-Saturday, 9am-7pm
  - Isabella Martinez: Tuesday-Saturday, 10am-6pm
  - Olivia Thompson: Monday-Friday, 9am-5pm
- **Stylist-Service Relationships (populated):**
  - Each stylist mapped to their offered services via `stylist_services` junction table
  - Enables validation during booking to ensure stylist offers requested service
- **Services:** Classic Haircut, Color & Highlights, Balayage, Bridal Updo, Keratin Treatment, Blowout, Hair Extensions (with pricing, duration, descriptions)
- **Test Users:** Maria Garcia (guest user created via AI booking flow)

### Build & Deployment

**Development:**
- Concurrent Vite dev server with Express API server
- HMR (Hot Module Replacement) for frontend changes
- TypeScript compilation with path aliases for clean imports

**Production Build:**
- Vite builds optimized frontend bundle to `dist/public`
- esbuild bundles backend code with external packages
- Static file serving from built frontend directory

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `ISSUER_URL` - OIDC provider URL for Replit Auth
- `AI_INTEGRATIONS_OPENAI_*` - AI service credentials

## External Dependencies

### Third-Party Services

**Database:**
- Neon PostgreSQL (serverless, WebSocket-based connection via `@neondatabase/serverless`)

**Authentication:**
- Replit Auth (OIDC-based authentication, no external API keys required)

**AI Services:**
- Replit AI Integrations (OpenAI-compatible API for chatbot functionality)

**Session Storage:**
- PostgreSQL-backed sessions via `connect-pg-simple`

### Key NPM Packages

**UI Components:**
- `@radix-ui/*` - Headless accessible UI primitives (20+ component packages)
- `cmdk` - Command palette component
- `lucide-react` - Icon library
- `react-day-picker` - Calendar component for date selection

**Data & Forms:**
- `@tanstack/react-query` - Server state management and caching
- `react-hook-form` - Form state and validation
- `zod` - Schema validation
- `drizzle-zod` - Drizzle-to-Zod schema conversion

**Styling:**
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant management
- `tailwind-merge` & `clsx` - Dynamic className composition

**Backend:**
- `express` - Web application framework
- `drizzle-orm` - Type-safe ORM
- `passport` & `openid-client` - Authentication middleware
- `ws` - WebSocket client for Neon connection

**Development:**
- `tsx` - TypeScript execution for development
- `vite` - Frontend build tool and dev server
- `@replit/vite-plugin-*` - Replit-specific development enhancements