# RideTahoe Agent Directives

## 1. Project Identity

RideTahoe is a community-driven rideshare platform connecting the Bay Area to Lake Tahoe.

- Mission: Cost-sharing, community building, and reducing carbon footprint.
- Current Phase: Migration from "ShareSkippy" legacy codebase.
- Vibe: Trust, Safety, Community (Green/Blue/White palette).

## 2. Tech Stack & Standards

- Framework: Next.js 16 (App Router). Use Server Components by default; add 'use client' only when interaction is required.
- Database: Supabase (PostgreSQL). RLS (Row Level Security) is mandatory on all tables.
- Styling: Tailwind CSS. Mobile-first approach (<div class="block md:flex">).
- Language: TypeScript. Strict mode. No any.

## 3. Critical Domain Rules (Non-Negotiable)

### Privacy & Safety

- Location: NEVER expose exact user coordinates to the frontend.
- Write: Store exact address in street_address (private).
- Read: Only fetch display_lat/display_lng (randomized 800-1200m offset).
- Contact Info: Phone numbers and emails are private. Communication happens via in-app conversations.

### Data Model Logic

- Round Trips: A round trip is NOT a single database record. It is TWO records in the rides table (one trip_direction: 'departure', one trip_direction: 'return') linked by a shared round_trip_group_id.

- Posting Types:
  - driver: Has capacity, car details, price.
  - passenger: Has only start/end/time.
  - flexible: Has driver details but indicates willingness to ride.

## 4. Migration Strategy (The "Donor" Protocol)

- Legacy Code: "ShareSkippy" is a donor.
  - Keep: Generic auth, mapping components, basic UI layouts.
  - Destroy: Ski resort snow reports, lift ticket integrations, "Skippy" branding.
- Refactoring: When touching a file, immediately update imports to @/components/... aliases and convert class components to functional hooks.

## 5. UI/UX Guidelines

- Mobile First: 70% of users are on mobile. Touch targets must be 44px+.
- Trust Signals: Always display User Avatar + Verified Badge next to names.
- Empty States: Never leave a blank page. Provide a specific CTA (e.g., "No rides yet? Be the first to post one!").

## 6. Testing Instructions

- Smoke Test: User A posts -> User B sees post -> User B messages User A.
- Privacy Check: Inspect network requests to ensure no street_address fields are returned in public JSON payloads.
