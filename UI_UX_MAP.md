# UI / UX Map & Design Direction

## 1. Design objective

The guest UI should feel like a premium extension of the hotel room, not a software dashboard.

The admin UI should feel operational, fast and calm.

The existing project `frontend-design` guidance remains active:

- avoid generic AI-generated SaaS styling
- choose typography deliberately
- do not overuse identical rounded cards
- use motion only where it clarifies change
- keep language plain and action-oriented
- review the design visually during implementation

---

## 2. Two different visual modes

### Guest portal

Character:
- hospitality
- calm
- tactile
- welcoming
- lightweight
- brand-specific

Optimize for:
- phone
- one hand
- low cognitive load
- large tap targets
- quick first action

### Admin/staff

Character:
- operational
- high signal
- quick scanning
- status clarity
- dense enough to work quickly

Optimize for:
- phone/tablet at operations desk
- desktop for configuration
- rapid queue handling

Do not force the same card system onto guest and admin surfaces.

---

## 3. Initial design token proposal

These are starting tokens, not immutable brand colors.

For a neutral hotel demo tenant:

```text
Ink          #171717
Paper        #F7F5F1
Warm Surface #EFEAE2
Brass        #8B6A3E
Forest       #254C3A
Critical     #A33A2B
```

Reasoning:

- hotel environments often contain stone, timber, linen, metal and printed wayfinding
- avoid default blue SaaS styling
- avoid the cream + terracotta + editorial-serif cliché described in the design skill
- use brass/forest sparingly for hotel-specific character

When a real hotel is onboarded, its brand can override tokens.

---

## 4. Typography

Recommended starting direction:

### Guest

Use a highly legible humanist sans or refined hospitality-appropriate typeface with strong mobile numerals.

Possible direction:
- `Manrope`, `DM Sans`, or another licensed/web-safe contemporary family
- real hotel brand font when provided

### Admin

Prefer the same family for consistency.
Use tabular numerals for money/timers/status metrics when supported.

Do NOT:
- use monospace simply because content is "technical"
- put ALL CAPS labels everywhere
- make headings enormous when the task is operational

---

## 5. Guest home wireframe

```text
┌──────────────────────────────────┐
│ Hotel mark                 EN ▾  │
│                                  │
│ Good evening                     │
│ Room 204                         │
│ What can we help with?           │
│                                  │
│ ┌──────────────┐ ┌─────────────┐ │
│ │ Wi-Fi        │ │ Food &      │ │
│ │ password     │ │ drinks      │ │
│ └──────────────┘ └─────────────┘ │
│                                  │
│ Request something                │
│ Towels   Water   Cleaning   More │
│                                  │
│ Active                           │
│ ┌──────────────────────────────┐ │
│ │ Dinner order · Preparing    │ │
│ │ 18 min ago                  │ │
│ └──────────────────────────────┘ │
│                                  │
│ Hotel guide                      │
│ Breakfast · Pool · Checkout      │
│                                  │
│ Call reception      WhatsApp     │
└──────────────────────────────────┘
```

Home should expose the highest-frequency actions without making the guest first choose from a long menu.

---

## 6. Guest navigation model

Prefer:

- contextual back navigation
- optional compact bottom bar only if testing shows it helps

Possible bottom nav:

```text
Home | Menu | Requests | Stay
```

Do not add five tabs just because mobile apps often have them.

---

## 7. Guest page map

```text
QR
└─ Guest Home
   ├─ Wi-Fi
   ├─ Food & drinks
   │  ├─ Category/filter/search
   │  ├─ Item detail/add-ons
   │  ├─ Cart
   │  ├─ Confirm order
   │  └─ Order tracking
   ├─ Request a service
   │  ├─ Service picker
   │  ├─ Request form
   │  └─ Request tracking
   ├─ Hotel guide
   │  ├─ Facilities
   │  ├─ Timings
   │  ├─ Policies
   │  ├─ FAQ
   │  └─ Local guide
   ├─ Support
   ├─ Feedback
   └─ Stay verification when required
```

---

## 8. Wi-Fi screen

Primary job: get the guest connected quickly.

```text
Wi-Fi

Hotel_Guest

Password
••••••••••••          [Reveal]

[ Copy password ]

1. Open Wi-Fi settings
2. Choose Hotel_Guest
3. Paste the password
```

If protected:

```text
Wi-Fi details are available to checked-in guests.
[ Unlock with stay PIN ]
```

---

## 9. Menu screen

Recommended structure:

```text
Food & drinks

[ Search dishes ]

Breakfast  All day  Drinks  Dessert

Popular
-------------------------------
Image  Club sandwich       ₹420
       Chicken, lettuce...
       [ Add ]

Image  Masala chai          ₹90
       [ Add ]
```

Important behavior:

- sticky compact cart summary after first item
- disabled/unavailable items clearly marked
- filters must not hide food unexpectedly
- prices always visible before add
- allergens/dietary labels readable, not icon-only

---

## 10. Cart / checkout

```text
Your order

2 × Club sandwich      ₹840
1 × Masala chai         ₹90

Room                    204
Note            [ Add a note ]

Subtotal                ₹930
Taxes/fees               ₹__
Total                   ₹___

Settlement
(•) Charge to room
( ) Pay online
( ) Pay on delivery

[ Place order ]
```

After tap:

- disable duplicate submission
- show progress
- create with idempotency key
- replace CTA with success/tracking state

---

## 11. Order tracking

Do not use fake minute-by-minute delivery estimates unless the hotel can support them.

Better:

```text
Dinner order

✓ Received       8:12 PM
✓ Accepted       8:14 PM
● Preparing
○ On the way
○ Delivered
```

Show:
- items
- total
- contact reception if something is wrong

---

## 12. Service request flow

Make common requests one-tap or two-tap.

```text
What do you need?

[ Water ]
[ Towels ]
[ Cleaning ]
[ Toiletries ]
[ Extra pillow ]
[ Maintenance ]
```

Example:

```text
Towels

Quantity
[ − ]  2  [ + ]

Anything we should know?
[ Optional note ]

[ Request towels ]
```

Success:

```text
Request received
Housekeeping has your request.

Status: Acknowledged
```

---

## 13. Stay verification

Use only when necessary.

```text
Unlock room services

Enter the 4-digit stay PIN provided at check-in.

[ _ ] [ _ ] [ _ ] [ _ ]

[ Continue ]

Need help? Call reception
```

Do not make every guest create a password.

---

## 14. Staff dashboard wireframe

Mobile/tablet:

```text
┌──────────────────────────────────┐
│ Hotel Name              Staff ▾  │
│                                  │
│ 4 new   7 active   3 overdue     │
│                                  │
│ Orders  Requests  All            │
│                                  │
│ NEW                              │
│ Room 204 · Food · 2 min          │
│ 3 items · ₹930                   │
│ [ Accept ]                       │
│                                  │
│ Room 118 · Towels · 4 min        │
│ Qty 2 · Housekeeping             │
│ [ Acknowledge ]                  │
│                                  │
│ IN PROGRESS                      │
│ Room 305 · Maintenance · 11 min  │
└──────────────────────────────────┘
```

The live queue is the admin product's most important screen.

Do not open the dashboard with vanity charts.

---

## 15. Desktop admin information architecture

```text
Overview
Operations
  Orders
  Service requests
Guest experience
  Menu
  Services
  Hotel guide
  Wi-Fi
Property
  Rooms & QR codes
  Staff
Insights
  Analytics
Settings
```

Role/department may hide irrelevant sections.

---

## 16. Orders admin

Table/list should prioritize:

- status
- room
- elapsed time
- order summary
- total
- settlement
- assigned/owner if used

Filters:

- status
- room
- time
- settlement
- department when appropriate

Bulk operations only when operationally safe.

---

## 17. Menu editor

Desktop:

```text
Categories                 Items
-------------------        ----------------------------
Breakfast                  Masala omelette     Available
All day              ->    Club sandwich       Available
Drinks                     Cappuccino          Sold out

[ Add category ]           [ Add item ]
```

Item edit drawer/page:

- name
- description
- category
- price
- image
- food/dietary labels
- availability
- schedule
- variants/add-ons later

"Sold out" must be extremely quick to toggle.

---

## 18. Rooms & QR

```text
Room   QR status   Portal   Last scan      Actions
101    Active      Live     12 min ago     Download
102    Active      Live     2 hr ago       Download
103    Revoked     Hidden   —              Regenerate
```

Actions:

- add room
- edit room label/floor
- enable/disable portal
- download QR
- regenerate token
- preview guest portal

A regeneration action must warn that old printed QR becomes invalid.

---

## 19. Hotel content editor

Do not build a full website CMS.

Use structured sections:

- facilities
- timings
- policies
- contact details
- FAQ
- local recommendations
- emergency information

Provide preview-as-guest.

---

## 20. Empty states

Bad:

```text
No data.
```

Good:

```text
No menu items yet.
Add the first item guests can order from their room.
[ Add menu item ]
```

Operational queue:

```text
No active requests.
New guest requests will appear here automatically.
```

---

## 21. Error copy

Bad:

```text
Something went wrong.
```

Better:

```text
We couldn't send this request.
Your request has not been placed. Try again or call reception.
[ Try again ] [ Call reception ]
```

Never claim an order was submitted unless the server confirms it.

---

## 22. Status language

Guest-facing language:

```text
Received
Accepted
Preparing
On the way
Delivered
```

Avoid internal system terms like:

```text
PROCESSING_STATE_2
FULFILMENT_PENDING
```

Admin may contain more operational detail.

---

## 23. Motion

Use motion mainly for:

- cart item added
- request successfully submitted
- status changed
- drawer/modal open/close
- realtime item entering queue

Avoid:
- every card animating on scroll
- decorative floating gradients
- continuous pulse everywhere
- long page-load choreography

Respect `prefers-reduced-motion`.

---

## 24. Responsive breakpoints

Design guest pages mobile-first.

Test minimum:

- 360 × 800 Android
- 390 × 844 iPhone-like viewport
- 768 tablet
- 1366 desktop admin
- 1440 desktop admin

Do not treat 375px as the only mobile width.

---

## 25. Accessibility checklist

- visible focus
- semantic heading order
- buttons are real buttons
- links are real links
- icon-only actions have labels
- touch targets large enough
- status uses text + visual treatment
- modals trap/restore focus correctly
- contrast checked
- form errors linked to fields
- language attribute set
- images have useful alt text or empty alt when decorative

---

## 26. Localization

Do not hard-code all guest text directly into components.

Prepare locale dictionaries:

```text
en
hi
or
```

Additional languages can be added per hotel market.

Hotel-created content should support translation later without redesigning the schema.

---

## 27. Design review protocol for AI agents

Before declaring a page complete:

1. render it at mobile width
2. render desktop if admin
3. capture a screenshot if tooling supports it
4. check hierarchy
5. remove one unnecessary visual element
6. test loading/empty/error/success states
7. test keyboard/focus
8. confirm real hotel content is used instead of generic lorem ipsum

If the page looks like a default SaaS template, revise it before continuing.
