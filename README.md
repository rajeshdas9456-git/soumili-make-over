# 🌸 Aura Bridal Studio - Luxury Bridal Makeup Artist & Executive Admin Portal

A full-stack, responsive, luxury bridal makeup artist website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase PostgreSQL / Storage**.

---

## ✨ Features

- **Luxury Aesthetic**: Soft beige, champagne, ivory, and rose gold palette with Cormorant Garamond & Playfair Display typography.
- **11 Public Pages**:
  1. `Home` (`/`) - Hero banner, services, packages, gallery preview, reviews, Instagram reel section, WhatsApp CTA.
  2. `About Elena Vance` (`/about`) - Biography, 12+ years experience, 850+ brides styled, hygiene & couture standards.
  3. `Bridal Makeup` (`/bridal-makeup`) - Signature HD & Airbrush bridal service breakdown.
  4. `Party Makeup` (`/party-makeup`) - Sangeet, cocktail, and bridesmaid styling.
  5. `Engagement Makeup` (`/engagement-makeup`) - Dewy pastel looks for ring ceremonies.
  6. `Reception Makeup` (`/reception-makeup`) - Evening red-carpet glam and 3D contouring.
  7. `Makeup Services` (`/services`) - Master list of all beauty services.
  8. `Pricing & Packages` (`/pricing`) - Live database pricing cards in INR (₹) with features and duration.
  9. `Photo Gallery` (`/gallery`) - Masonry grid with category filter and full-screen HD Lightbox.
  10. `Testimonials` (`/testimonials`) - Verified 5-star bride reviews and love stories.
  11. `Contact Us & Booking` (`/contact`) - Interactive booking form, Google Maps, and direct WhatsApp booking.

- **Executive Admin Portal**:
  - URL: `/admin/login`
  - Dashboard: `/admin/dashboard`
  - Manage Pricing Packages (Add, edit prices in INR, features, images, publish/unpublish, delete).
  - Manage HD Photo Gallery (Upload photos, add titles, category tag, set featured, delete).
  - Manage Services (Update titles, images, descriptions, bullet features).
  - Manage Site Content & Branding (Update brand name, hero headlines, phone, WhatsApp number, studio address).
  - Manage Testimonials (Add, edit, publish/unpublish client reviews).
  - Booking Inquiries Manager (Review leads, event dates, guest counts, and WhatsApp client directly).

---

## 🚀 Quick Setup & Local Launch

### 1. Requirements
- Node.js LTS (v18+ or v20+)
- Standalone Node.js is already configured in `./nodejs`

### 2. Start the Development Server
```powershell
# Set Node PATH and launch Next.js
$env:PATH = "$PWD\nodejs;$env:PATH"
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔐 Admin Login Credentials

- **Admin Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@aurabridal.com`
- **Password**: `AuraBridalMaster2026!`

*(You can customize these credentials in `.env.local`)*

---

## 🗄️ Database & Supabase Integration

1. The site is equipped with an integrated database persistence layer located in `./data/*.json` that works out-of-the-box without needing external cloud configuration.
2. For hosted Supabase deployment:
   - Run the complete migration schema located in [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL Editor.
   - Configure your `.env.local` with your Supabase keys from [Supabase Dashboard](https://supabase.com).
