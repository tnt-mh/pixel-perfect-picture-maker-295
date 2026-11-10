# Waslni — Phase 1 build plan

The brief covers a full startup product (roughly 15 major areas). We build it in phases so each one works for real. Phase 1 delivers the core carpooling loop as a mobile-first web app.

## Phase 1 scope
- **Brand and design**: navy #000080 identity, Plus Jakarta Sans, rounded cards, soft shadows, smooth page transitions, skeleton loading, empty states. A Waslni logo built from road, pin and motion shapes.
- **Languages**: French by default, plus Arabic (full right-to-left) and English, switched in settings. Prices shown in DA, phone numbers in +213 format, a list of the 58 wilayas.
- **Welcome and onboarding**: logo, slogan, "Commencer" / "Se connecter" buttons, language picker, 3 animated intro slides.
- **Accounts**: email and password sign-in now. A profile with photo, name, phone, date of birth and language. One account works as driver and passenger.
- **Driver**: upload documents (ID card, licence, carte grise, plate, photo) to private storage, with a status (not submitted / pending / verified / rejected + reason / resubmit). Unverified drivers cannot publish rides. Dashboard. A 10-step publish-ride flow with the legal cost-sharing warning. Accept or reject bookings, see the passenger list, mark passengers on board, finish the ride.
- **Passenger**: home with search (departure, destination, date, seats), recent searches, popular destinations. Results show ride cards with a verified badge and filters. Ride details, booking request, my reservations, cancel.
- **Basic admin**: a page to review driver documents and approve or reject them.
- **Bottom navigation**: Accueil, Rechercher, Publier, Trajets, Profil.

## Later phases (not in Phase 1)
- Phase 2: in-app chat, notifications, ratings and reviews, a ride PIN at boarding, reporting.
- Phase 3: live location sharing, emergency button, recurring rides, women-only preference, favorite drivers, ride requests, savings and CO2 calculator.
- Phase 4: payments (cash first, online later), full admin and moderation.
- SMS code sign-in needs an SMS provider account. We add it once you have one.

## Technical details
- Lovable Cloud for the database, sign-in and private document storage.
- Tables: profiles, user_roles (admin), vehicles, driver_documents, driver_verification, rides, ride_stops, bookings, recent_searches. Row-level security on every table. Documents go in a private bucket that only the owner and admins can read.
- A server-side check blocks unverified drivers from publishing rides, and a test covers it.
- A lightweight translation dictionary for fr/ar/en, with `dir="rtl"` on the page for Arabic.
- Separate routes for each screen, plus a signed-in-only layout for the app area.
