# Hotel QR Guest Hub

> Working title only. The product name can change without changing the architecture.

## 1. Product in one sentence

A mobile-first, no-install guest web app opened from a QR code in each hotel/lodge room, giving the guest one place for Wi-Fi, food ordering, hotel information, service requests, support, feedback, and optional payments, while giving hotel staff a real-time operations dashboard.

---

## 2. What problem this solves

Typical hotels currently split guest information across:

- printed menus
- reception phone calls
- WhatsApp
- Wi-Fi cards
- printed hotel directories
- housekeeping calls
- verbal instructions at check-in
- separate payment links
- handwritten service requests

The QR Guest Hub replaces most of that with a room-aware web experience.

The guest should **not need to install an app or create an account**.

---

## 3. Core experience

### Guest

1. Guest enters room.
2. Guest scans the room QR.
3. Browser opens a branded guest home screen.
4. Guest can immediately see:
   - Wi-Fi
   - food & drinks
   - request a service
   - hotel information
   - facilities & timings
   - contact reception
   - local guide
5. Guest can order/request from the same page.
6. Guest sees live status:
   - Received
   - Accepted
   - Preparing / In progress
   - On the way
   - Completed
7. Hotel staff receives the request in the staff dashboard.
8. Staff updates the status.
9. Guest receives the updated status without calling reception.

### Hotel staff

1. Staff signs in.
2. Dashboard shows new orders and service requests.
3. Staff can filter by room, status, department, and time.
4. Staff accepts/assigns/completes a task.
5. Manager controls menus, Wi-Fi details, facilities, rooms, QR codes, staff and content.

---

## 4. Important product boundary

This project should start as a **QR Guest Experience + Hotel Operations system**, not as a complete Property Management System (PMS).

Do NOT build these in the first MVP:

- reservation engine
- channel manager
- OTA synchronization
- accounting
- payroll
- full inventory ERP
- complex room pricing engine
- complete front-office PMS replacement

Later, this product can integrate with an existing PMS.

---

## 5. MVP features

### Guest-facing MVP

- room QR landing page
- hotel branding
- Wi-Fi information with copy button
- digital food menu
- cart
- place room-service order
- food order status
- service request categories
- request status
- call reception
- WhatsApp/reception chat link
- hotel information
- facilities and timings
- emergency/contact information
- feedback form
- language selector
- responsive mobile UI

### Staff/admin MVP

- staff authentication
- multi-hotel-ready roles
- live order queue
- live service request queue
- status updates
- rooms management
- QR generation/download
- menu category management
- menu item management
- item availability toggle
- service category management
- Wi-Fi configuration
- hotel information/content editor
- staff/role management
- basic analytics
- hotel settings and branding

---

## 6. Recommended build strategy

The architecture should be multi-tenant from day one even if the first launch is for one hotel.

Every tenant-owned database row must carry a `hotel_id`.

Recommended first production architecture:

- **Frontend/full-stack:** Next.js App Router + TypeScript
- **Styling:** Tailwind CSS with a custom design system
- **Accessible primitives:** Radix UI/headless components where useful
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth for staff
- **Realtime:** Supabase Realtime for order/request updates
- **Storage:** Supabase Storage for hotel/menu images
- **Validation:** Zod
- **Hosting:** Vercel for the Next.js app
- **Database/backend services:** Supabase
- **Payments in India (Phase 2):** Razorpay
- **Error monitoring:** Sentry or equivalent
- **Analytics:** first-party event table initially; product analytics can be added later

Pin exact dependency versions in `package.json` and lockfile when the repository is initialized.

As of 2026-09-23, Next.js 16.3.6 is an Active LTS security-patched release; use the currently supported patched LTS at implementation time rather than copying an old version blindly.

---

## 7. QR and access model

### Never encode this directly in a room QR

- raw database room ID
- Wi-Fi password
- admin credentials
- guest name
- booking number
- payment information

### QR should contain only an opaque public URL

Example:

```text
https://guest.example.com/q/k7Jv9qW4nBX2
```

The token resolves server-side to:

```text
hotel -> room -> enabled guest experience
```

### Static QR + secure stay session

A QR sticker should not need replacement after every checkout.

Use two levels of access:

#### Level A — public room portal

Available immediately after scan:

- hotel information
- food menu
- facilities
- reception contact
- local guide
- optionally Wi-Fi, based on hotel policy

#### Level B — verified stay actions

Optional hotel setting. Required for:

- posting charges to the room
- showing sensitive stay information
- checkout request
- payment
- viewing personal order history

Verification options:

- 4-digit stay PIN issued at check-in
- OTP to guest phone if PMS data is available
- PMS-generated guest session
- front-desk activation

The hotel may run in `frictionless` mode for lower-security properties.

---

## 8. Suggested repository

```text
hotel-qr/
├─ app/
│  ├─ (guest)/
│  │  └─ q/[token]/
│  ├─ (staff)/
│  │  └─ admin/
│  ├─ api/
│  └─ auth/
├─ components/
│  ├─ guest/
│  ├─ admin/
│  ├─ shared/
│  └─ ui/
├─ features/
│  ├─ guest-portal/
│  ├─ menu/
│  ├─ orders/
│  ├─ service-requests/
│  ├─ rooms/
│  ├─ qr/
│  ├─ hotel-content/
│  ├─ staff/
│  └─ analytics/
├─ lib/
│  ├─ auth/
│  ├─ db/
│  ├─ permissions/
│  ├─ validation/
│  ├─ realtime/
│  └─ utils/
├─ supabase/
│  ├─ migrations/
│  ├─ seed.sql
│  └─ tests/
├─ public/
├─ tests/
├─ PRODUCT_SPEC.md
├─ ARCHITECTURE.md
├─ UI_UX_MAP.md
├─ AI_AGENT_HANDOFF.md
└─ README.md
```

Prefer feature-oriented code over one giant `components` or `utils` directory.

---

## 9. Build order

### Milestone 0 — foundation

- initialize Next.js + TypeScript
- configure linting/formatting
- configure environment variables
- create Supabase project
- create database migrations
- establish auth and hotel membership
- establish custom UI tokens
- seed demo hotel

### Milestone 1 — guest shell

- resolve QR token
- guest homepage
- hotel branding
- Wi-Fi screen
- hotel information
- facilities
- support

### Milestone 2 — menu and ordering

- menu/categories/items
- item availability
- cart
- order creation
- guest order tracking
- staff order queue
- realtime updates

### Milestone 3 — service requests

- configurable request types
- request creation
- staff assignment/status
- guest status tracking

### Milestone 4 — hotel admin

- rooms
- QR management
- menu editor
- content editor
- Wi-Fi
- staff
- settings

### Milestone 5 — production hardening

- RLS tests
- rate limiting
- anti-spam controls
- audit log
- observability
- backups
- accessibility pass
- performance pass
- PWA/offline shell if useful

### Milestone 6 — revenue features

- payments
- paid upsells
- late checkout
- laundry pricing
- airport transfer
- spa/activity booking
- promotional modules

---

## 10. Definition of MVP success

A real hotel can:

1. create a hotel
2. add rooms
3. print one QR per room
4. configure Wi-Fi and hotel information
5. publish a menu
6. receive a room-service order
7. receive a housekeeping/service request
8. update status from a phone/tablet
9. have the guest see that status without installing an app

If all nine work reliably, the MVP is useful.

---

## 11. Read order for any AI agent

Before writing code, every AI coding agent must read:

1. `README.md`
2. `PRODUCT_SPEC.md`
3. `ARCHITECTURE.md`
4. `UI_UX_MAP.md`
5. `AI_AGENT_HANDOFF.md`

The existing `frontend-design` skill/instruction supplied by the project owner is additional design guidance. It does not replace these project files.

---

## 12. First command to give a new AI agent

Use this prompt:

```text
Read README.md, PRODUCT_SPEC.md, ARCHITECTURE.md, UI_UX_MAP.md and
AI_AGENT_HANDOFF.md completely before changing code.

Treat those files as the project source of truth. Then inspect the existing
repository and tell me:
1. what is already implemented,
2. what conflicts with the docs,
3. the next smallest milestone,
4. which files you will change.

Do not redesign the architecture silently. Update AI_AGENT_HANDOFF.md after
finishing the task.
```
