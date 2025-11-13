# Design Guidelines: Salon Booking & AI Assistant Platform

## Design Approach

**Reference-Based Approach** drawing from premium beauty/booking platforms:
- **Primary inspiration**: Airbnb (booking UX), Glossier (beauty aesthetic), Treatwell (salon booking flow)
- **Key principles**: Visual sophistication, trust-building through imagery, effortless booking experience, professional polish

## Typography System

**Font Stack:**
- Primary: Inter or DM Sans (clean, modern sans-serif via Google Fonts)
- Accent: Playfair Display or Cormorant (elegant serif for headlines and hero text)

**Hierarchy:**
- Hero headlines: 4xl-6xl, serif accent font, font-medium
- Section titles: 3xl-4xl, sans-serif, font-semibold
- Service/stylist names: xl-2xl, sans-serif, font-medium
- Body text: base-lg, sans-serif, font-normal
- Small labels/metadata: sm-xs, sans-serif, font-medium

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Card padding: p-6 to p-8
- Section padding: py-16 to py-24 (desktop), py-12 (mobile)
- Grid gaps: gap-6 to gap-8
- Element spacing: space-y-4, space-y-6

**Container Strategy:**
- Full-width sections: w-full with inner max-w-7xl mx-auto px-4
- Content sections: max-w-6xl
- Text-focused areas: max-w-4xl

## Component Library

### Landing Page Structure

**Hero Section (80vh):**
- Full-width background image showing salon interior or styled hair
- Semi-transparent overlay with subtle gradient
- Centered headline + subheadline + CTA button with blur backdrop
- Floating "Book with AI Assistant" badge/indicator
- NO generic centered layout - asymmetric text placement (left-aligned) with image showcasing salon atmosphere

**Services Grid (3-column desktop, 2-column tablet, 1-column mobile):**
- Service cards with large image thumbnails
- Hover effect: subtle scale + shadow increase
- Each card: image, service name, duration/price, "Book Now" CTA
- Category filtering tabs above grid

**Stylist Profiles (2-3 column masonry-style grid):**
- Portrait photos with professional headshots
- Name, specialization, years of experience
- Star rating + number of reviews
- "View Profile" + "Book with [Name]" CTAs
- Profile modal/page: full bio, expertise badges, gallery carousel of work

**Testimonials Section:**
- 3-column testimonial cards with customer photos
- Quote + name + service received
- Star ratings prominently displayed
- Trust indicators: "500+ Happy Clients", "4.9 Average Rating"

**Footer (multi-column):**
- Newsletter signup with email input + decorative element
- Quick links (Services, Stylists, About, Contact)
- Business hours, phone, email, social icons
- Trust badges ("Licensed Professionals", "Sanitized Tools")

### Booking Flow Components

**AI Chatbot Widget:**
- Fixed bottom-right position, circular trigger button (w-16 h-16)
- Expands to chat panel (400px width, 600px height)
- Message bubbles: customer (right-aligned), AI (left-aligned)
- Input field at bottom with send button
- Quick action chips: "Check Availability", "View Services", "Reschedule"
- Typing indicator with animated dots
- Minimize/close controls

**Calendar Booking View:**
- Month view calendar with available dates highlighted
- Time slot grid showing stylist availability
- Selected service/stylist summary sidebar
- Confirmation panel with booking details + "Confirm Appointment" CTA
- Progress indicator: Select Service → Choose Stylist → Pick Time → Confirm

**Service Cards (Booking Context):**
- Horizontal layout: thumbnail (left) + details (right)
- Service name, description (2 lines max), duration, price
- "Select" button that changes to "Selected" with checkmark

### Admin Dashboard Components

**Dashboard Overview:**
- 4-column stat cards (Today's Bookings, Revenue, Active Stylists, Customer Satisfaction)
- Revenue chart (line graph, 7-day view)
- Upcoming appointments list (5 most recent)
- Quick actions: "Add Booking", "New Service", "Manage Stylists"

**Data Tables:**
- Zebra striping for row differentiation
- Action column (right): Edit, Delete, View icons
- Sortable column headers with sort indicators
- Search + filter controls above table
- Pagination controls below

**CRUD Forms:**
- Two-column layout for input fields
- Clear field labels (top-aligned)
- Image upload with preview (for services/stylists)
- Rich text editor for descriptions
- Time picker for scheduling
- Form actions: Save, Cancel (bottom-right)

**Stylist Schedule Manager:**
- Weekly calendar grid showing shift blocks
- Drag-to-create availability slots
- Visual distinction between booked/available/blocked times
- Quick toggle: "Mark Unavailable"

## Navigation

**Main Navigation (Landing Pages):**
- Transparent header on hero, becomes solid on scroll
- Logo (left), nav links (center): Services, Stylists, Contact
- "Book Now" CTA button (right)
- Mobile: hamburger menu with slide-in drawer

**Admin Navigation:**
- Sidebar (left, 240px width)
- Logo at top
- Menu items with icons (Dashboard, Bookings, Services, Stylists, Customers, Settings)
- User profile dropdown (bottom)
- Collapsible on tablet/mobile

## Images

**Required Images:**
- **Hero**: Large, high-quality salon interior or stylist working (1920x1080), warm lighting, professional composition
- **Services**: 8-10 images showing haircuts, coloring, styling (square format, 600x600)
- **Stylists**: 5-6 professional headshots (portrait orientation, 400x500)
- **Testimonials**: 3-6 customer photos (circular crop, 120x120)
- **Work Gallery**: 15-20 before/after or finished style photos for stylist portfolios (square, 800x800)
- **About/Contact**: Team photo or salon exterior (landscape, 1200x800)

## Interaction Patterns

- Button hover: slight lift (shadow increase, -translate-y-1)
- Card hover: subtle scale (scale-105) + shadow enhancement
- Form focus: border highlight + subtle glow
- Loading states: skeleton screens for data-heavy sections
- Success confirmations: toast notifications (top-right)
- Modal overlays: backdrop blur + scale-in animation
- Chatbot messages: slide-in from appropriate side

## Accessibility

- Icon library: Heroicons (via CDN)
- All interactive elements: min height 44px
- Form inputs: clear labels, proper aria-labels
- Keyboard navigation: visible focus states
- Alt text for all images
- Sufficient contrast ratios throughout

**Icons specifically needed:** Calendar, Clock, User, Star, Check, X, Menu, Search, ChevronDown, Plus, Pencil, Trash, MessageCircle

This design creates a premium, trustworthy salon experience that balances visual appeal with booking efficiency.