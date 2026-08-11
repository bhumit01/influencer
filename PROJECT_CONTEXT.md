# PROJECT_CONTEXT

This document serves as the persistent source of truth for the InfluencerPortal project.

## Product Concept

The InfluencerPortal is a public creator/influencer discovery platform focused on the Indian market. It facilitates connections between brands and influencers for collaboration.

### Hidden Business Logic

Enquiries from brands are *not* sent directly to creators. Instead, they are stored in the platform's admin/backend system. The platform owner/admin manages these enquiries and facilitates campaigns manually. This intermediary role must not be publicly revealed on the website, nor should any internal operating entity (e.g., UIX Solutions, "admin routing", "agency handling"). Public-facing copy should use neutral wording such as: "Tell us about your campaign and we'll help you connect with this creator."

## User Roles

*   **Public Visitor**: Can browse and discover creators without logging in. Can submit creator enquiries without logging in.
*   **Brand**: Can browse and discover creators, and submit enquiries (login *not* required for submission). Existing brand dashboard functionality remains, but is not the primary enquiry flow.
*   **Creator**: Can sign up, create, and manage their public and private profile. Requires login for dashboard access.
*   **Admin**: Platform owner with full access to creator data (including private commercial information) and enquiry management. Admin functionality is entirely backend-driven for now.

## Main User Flows

*   **Public Visitor** (including brand representatives acting as public visitors):
    1.  Lands on Home page (`/`).
    2.  Browses influencers (`/browse`) with search/filters.
    3.  Views individual influencer profiles (`/influencer/:id`).
    4.  Clicks enquiry/collaboration CTA on a creator profile.
    5.  Fills out enquiry form (contact and campaign details) without needing to log in.
    6.  Submits enquiry; enquiry is stored privately in the backend, linked to the creator profile.
    7.  Accesses static pages (About, Contact, Categories).
    8.  Can also initiate login or signup (for full brand dashboard access or influencer profile management).
*   **Brand**:
    1.  Logs in (optional, for dashboard access).
    2.  Accesses Brand Dashboard (`/brand/dashboard`).
    3.  Discovers influencers (`/brand/discover`).
    4.  Views submitted enquiries (`/brand/enquiries`).
*   **Creator**:
    1.  Signs up.
    2.  Logs in.
    3.  Accesses Influencer Dashboard (`/influencer/dashboard`).
    4.  Edits profile (`/influencer/edit-profile`).
    5.  Manages gallery (`/influencer/gallery`).
    6.  Manages collaborations (`/influencer/collaborations`).
*   **Admin**: (Backend only - no frontend UI yet)
    1.  Manages creators (view, search, filter, approve/reject, edit all data).
    2.  Manages enquiries (view, status updates, internal notes).

## Current Technology Stack

*   **Frontend**: React (v19), TypeScript, Vite (v6)
*   **Styling**: Tailwind CSS (v3), PostCSS, Autoprefixer
*   **Routing**: React Router DOM (v7)
*   **State Management**: Zustand (v5)
*   **Animations**: Framer Motion (v11)
*   **Icons**: Lucide React
*   **API Client**: Custom `ApiClient` class (`frontend/src/lib/api.ts`)
*   **Build Tool**: Vite
*   **Backend**: PHP (Custom implementation)
*   **Database**: MySQL

## Current Architecture

The project has a clear frontend separation from a backend API. The frontend is a Single Page Application (SPA) using React. API requests are proxied via Vite to a backend at `http://localhost/influencehub/backend`. Authentication relies on a token stored in `localStorage` for logged-in users, but public actions (like enquiry submission) must not require it. The backend is a custom PHP implementation that interacts directly with a MySQL database.

## Important Files and Folders

*   `/frontend/`: Frontend application root.
*   `/frontend/package.json`: Dependencies and scripts.
*   `/frontend/tsconfig.json`: TypeScript configuration.
*   `/frontend/vite.config.ts`: Vite configuration, including API proxy `/api` -> `http://localhost/influencehub/backend`.
*   `/frontend/tailwind.config.js`: Tailwind CSS customisations.
*   `/frontend/src/main.tsx`: Main React entry point.
*   `/frontend/src/App.tsx`: React Router setup and main layouts.
*   `/frontend/src/components/layout/`: Global layout components (Navbar, Footer, DashboardLayout).
*   `/frontend/src/components/shared/`: Reusable components (InfluencerCard, SearchBar).
*   `/frontend/src/components/ui/`: Basic UI elements (Button, Input, Card, etc.).
*   `/frontend/src/hooks/useAuth.ts`: Zustand store for authentication state.
*   `/frontend/src/lib/api.ts`: Central API client and service-specific API calls (`authApi`, `influencerApi`, `brandApi`, `publicApi`).
*   `/frontend/src/pages/public/`: Public-facing pages.
*   `/frontend/src/pages/influencer/`: Influencer dashboard pages.
*   `/frontend/src/pages/brand/`: Brand dashboard pages.
*   `/frontend/src/types/index.ts`: TypeScript interfaces defining data structures (User, InfluencerProfile, Enquiry, etc.).
*   `/backend/`: Backend application root (custom PHP).
*   `/backend/api/`: Contains PHP files acting as API endpoints for different modules.
*   `/backend/config/database.php`: Database connection configuration.
*   `/backend/middleware/`: PHP middleware for authentication and CORS.
*   `/backend/models/`: PHP classes representing database entities.
*   `/database/schema.sql`: SQL script for database creation and table definitions.

## Database/Backend Status

*   The backend is a custom PHP application located at `/backend/`.
*   A MySQL database named `influencehub` is used for data persistence.
*   Authentication, user registration, and data fetching/updating for profiles and enquiries are handled by custom PHP API scripts.
*   The database schema includes tables for users, brand profiles, categories, influencer profiles (with `pricing_min`, `pricing_max`, `languages` JSON column, `accepts_barter`, `barter_description`, `contact_email`, `contact_phone`), social links, gallery items, past collaborations, enquiries (with `admin_notes`, nullable `brand_id`, `contact_name`, `contact_email`), and contact submissions.
*   The `users` table includes a `role` enum (`brand`, `influencer`, `admin`).

## Current Feature Status

*   **Public Directory (BrowseInfluencers)**: WORKING (Pricing no longer exposed from backend API via `sanitizeForPublic()`)
*   **Public Creator Profile (InfluencerProfilePage)**: WORKING (Pricing removed from display; Contact button visible to ALL visitors)
    *   Contact Influencer CTA / Enquiry Modal: FIXED - Contact button now visible to all visitors, uses `publicApi.sendEnquiry` (anonymous endpoint), neutral wording, contact name/email fields shown for unauthenticated users.
*   **Authentication/Signup/Login**: PARTIALLY WORKING (Core functionality for login/signup/logout is present; advanced features are missing). Backend implements password hashing and JWT.
*   **Creator Dashboard**: WORKING
*   **Creator Profile Management (EditProfile)**: WORKING (All features implemented)
    *   Upload Profile/Cover Photo: WORKING (File upload via `influencerApi.upload` to `/api/influencers/upload`)
    *   Categories selection: WORKING (Multi-select toggle UI)
    *   Social Links management: WORKING (Add/remove/edit social links inline)
    *   Barter preferences: WORKING (Toggle + description textarea)
    *   Contact info: WORKING (Private contact email/phone fields)
*   **Creator Gallery (Gallery)**: WORKING (Functional "Add Photo" modal with file upload via `influencerApi.upload('gallery', ...)`)
*   **Creator Collaborations (Collaborations)**: WORKING (Functional modal form adds collaborations via `/api/influencers/collaborations`)
*   **Brand Dashboard**: WORKING (Optional for brands, not required for enquiry submission.)
*   **Brand Discover**: WORKING (Functionally similar to Public BrowseInfluencers).
*   **Brand Enquiries**: WORKING (For logged-in brands to view their submitted enquiries.)
*   **Admin Functionality**: PARTIALLY BUILT (Backend API endpoints exist at `/admin/*` with role-based auth, but no frontend UI)

### Backend API Endpoints

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/auth/*` | Various | Public/Bearer | Login, signup, logout, me |
| `/public/categories` | GET | Public | List categories with influencer counts |
| `/public/contact` | POST | Public | Submit contact form |
| `/public/enquiries` | POST | Public | Anonymous enquiry submission |
| `/influencers/list` | GET | Public | Paginated list with filters (pricing stripped) |
| `/influencers/{id}` | GET | Public | Single profile (pricing stripped) |
| `/influencers/profile` | GET/PUT | Bearer (influencer) | Full profile with private data |
| `/influencers/upload` | POST | Bearer (influencer) | Upload profile/cover/gallery photos |
| `/influencers/collaborations` | GET/POST/DELETE | Bearer (influencer) | Manage past collaborations |
| `/brands/profile` | GET/PUT | Bearer (brand) | Brand profile management |
| `/brands/enquiries` | GET/POST | Bearer (brand) | Brand enquiries (requires login) |
| `/admin/enquiries` | GET/PUT | Bearer (admin) | View all enquiries, update status/notes |
| `/admin/categories` | GET/POST/PUT/DELETE | Bearer (admin) | Full category CRUD |
| `/admin/creators` | GET/PUT | Bearer (admin) | List/manage all creators |

## Known Problems

*   **Missing Admin UI**: No frontend for admin to manage creators or enquiries (backend API exists at `/admin/*`).
*   **Code Duplication**: `BrowseInfluencers` and `BrandDiscover` have significant overlap.
*   **Static/Broken Links**: Some footer links are placeholders (`#` links for Blog, Careers, Help Center).
*   **Hardcoded Icons**: Category and social platform icons are hardcoded strings, not dynamically linked to `Category.icon` field or Lucide components.
*   **Custom Backend Risks**: The custom PHP backend lacks the established conventions and security features of a framework, potentially leading to more bugs and security vulnerabilities if not meticulously maintained.

## Architectural Decisions

*   **Continue Existing Stack**: Maintain React, TypeScript, Vite, Tailwind CSS, React Router DOM, Zustand, and Framer Motion for the frontend. Continue with the custom PHP backend, but with a strong focus on improving its structure and security.
*   **Strict Data Segregation**: Backend uses `InfluencerProfile::sanitizeForPublic()` to strip private fields (`pricing_min`, `pricing_max`, `pricing_currency`, `accepts_barter`, `barter_description`, `contact_email`, `contact_phone`, `email`) from public endpoints. Full data only returned to authenticated creator/admin.
*   **API-Driven Development**: Ensure all new features are backed by well-defined and secure API endpoints.
*   **Dedicated Admin Interface**: Develop a dedicated Admin UI (either as a separate part of the existing frontend with strong access control or a completely separate application) that consumes admin-specific API endpoints for creator and enquiry management.
*   **Anonymous Enquiry Submission**: The backend supports anonymous (unauthenticated) submission of brand enquiries at `POST /public/enquiries`, with contact_name/contact_email fields for enquirer identification.

## Development Roadmap

1.  **Backend Phase 1: Core Services & Security** ✅ COMPLETED
    *   ✅ **Refine Public/Private Data Handling in API**: `InfluencerProfile::sanitizeForPublic()` strips private fields from `list.php` and `single.php` responses.
    *   ✅ **Anonymous Enquiry Submission API**: `POST /public/enquiries` accepts unauthenticated submissions with contact info.
    *   ✅ **File Upload API**: `POST /influencers/upload` handles `profile_photo`, `cover_photo`, `gallery` uploads.
    *   ✅ **Creator Private Data API**: `/influencers/profile` returns all data (including new barter + contact fields) to authenticated creator only.
    *   ✅ **Enquiry Management API**: Admin endpoints at `/admin/enquiries` for listing, status updates, and internal notes.
    *   ✅ **Category Management API**: Admin CRUD endpoints at `/admin/categories`.
    *   ✅ **Admin Authentication and Authorization**: `requireRole('admin')` used for all `/admin/*` routes.

2.  **Frontend Phase 1: Critical Privacy Fix & Creator Onboarding** ✅ COMPLETED
    *   ✅ **IMMEDIATE FIX**: Removed pricing display from `InfluencerCard.tsx` and `InfluencerProfile.tsx`.
    *   ✅ **IMMEDIATE FIX**: Enquiry modal uses neutral wording, Contact CTA visible to all visitors, anonymous submission with contact name/email.
    *   ✅ **Photo Uploads**: Functional in `EditProfile.tsx` and `Gallery.tsx` via backend upload API.
    *   ✅ **Category Selection UI**: Implemented in `EditProfile.tsx`.
    *   ✅ **Social Links Management UI**: Implemented in `EditProfile.tsx` (add/edit/remove).
    *   ✅ **Barter Preferences UI**: Implemented in `EditProfile.tsx` (toggle + description).
    *   ✅ **Collaborations**: Functional modal form in `Collaborations.tsx` with backend endpoint.

3.  **Backend Phase 2: Admin Functionality & Refinements**:
    *   Develop/refine **Admin API endpoints** for full creator management (approve/reject, edit all fields including private data). *(Partially done - `/admin/creators` exists with basic list/update)*

4.  **Frontend Phase 2: Admin UI Development**:
    *   Build **Admin Dashboard UI** with routes like `/admin/dashboard`, `/admin/creators`, `/admin/enquiries`.
    *   Implement **Creator Management UI** for admin.
    *   Implement **Enquiry Management UI** for admin.

5.  **Frontend Phase 3: UI/UX Improvements & Polish**:
    *   Populate/implement placeholder static pages (About, Contact, legal docs).
    *   Refactor `BrowseInfluencers` and `BrandDiscover` to reuse components/logic more effectively.
    *   Improve dynamic icon handling for categories and social platforms.
    *   Enhance form validations.

6.  **Testing and Deployment (Ongoing)**:
    *   Conduct comprehensive testing across all features and roles.
    *   Performance optimization and security audits.

## Strict Rules for Future AI Agents

Before making any significant code or architecture change, read PROJECT_CONTEXT.md first and update it after completing meaningful development work.
