# VANTA — AI-Powered ECommerce Platform

A modern, dark-themed ecommerce application built with **Angular 21**, featuring AI-powered product discovery through natural language and visual search, Stripe payments, and Google OAuth authentication.

---

## Features

### Shopping

- **Product Catalog** — Paginated product listing with category filtering (All / Men / Women / Kids)
- **Product Detail** — Size selection, stock display, and add-to-cart
- **Shopping Cart** — Slide-out panel with quantity management, persisted to localStorage
- **Checkout** — Stripe Elements integration with Payment Intents via an ASP.NET Core backend
- **Order History** — Orders saved locally with payment intent tracking

### AI-Powered Discovery

- **AI Stylist** (`/stylist`) — Describe an occasion or style in natural language; Mistral AI returns the top 3 matching products from the catalog
- **Visual Search** (`/visual-search`) — Upload an image; Mistral's multimodal API analyzes it and returns the top 3 visually similar products with client-side image compression

### Authentication

- **Email Signup/Login** — Registration with strong password validation, SHA-256 hashed passwords stored in Supabase
- **Google OAuth** — One-click sign-in via Supabase OAuth with redirect callback
- **Password Reset** — 3-step flow: email → 6-digit PIN (delivered via EmailJS) → new password

### UI/UX

- Dark luxe streetwear theme with acid green (`#39ff14`) accents
- Fully responsive with Bootstrap 5 grid
- Lazy-loaded routes for code splitting
- Standalone Angular components (no NgModules)

---

## Tech Stack

| Layer                | Technology                                                                    |
| -------------------- | ----------------------------------------------------------------------------- |
| **Framework**        | Angular 21 (standalone components, Signals)                                   |
| **UI**               | Bootstrap 5 + Bootstrap Icons + custom CSS                                    |
| **State Management** | Angular Signals (`signal()`, `computed()`)                                    |
| **Product API**      | FakeStore REST API                                                            |
| **Database / Auth**  | Supabase (PostgreSQL + Google OAuth)                                          |
| **AI**               | Mistral AI (text & vision models)                                             |
| **Payments**         | Stripe Elements + ASP.NET Core PaymentApi backend                             |
| **Email**            | EmailJS (password reset PINs)                                                 |
| **Encryption**       | CryptoJS (SHA-256 password hashing)                                           |
| **Testing**          | Vitest + jsdom                                                                |
| **Formatting**       | Prettier                                                                      |

---

## Project Structure

```
src/
├── app/
│   ├── app.ts / app.html / app.css          # Root component
│   ├── app.config.ts                        # Application providers
│   ├── app.routes.ts                        # Lazy-loaded routes
│   ├── Components/                          # Auth components
│   │   ├── auth-callback/                   # Google OAuth handler
│   │   ├── login/ / signup/                 # Auth forms
│   │   └── forget-password/ / pin-form/ / reset-password/
│   ├── core/features/products/
│   │   ├── components/
│   │   │   ├── home/                        # Landing page
│   │   │   ├── shop/                        # Product catalog
│   │   │   ├── card/                        # Product card
│   │   │   ├── cart/                        # Slide-out cart
│   │   │   ├── tabs/                        # Category filter tabs
│   │   │   ├── checkout/                    # Stripe checkout
│   │   │   ├── payment-success/             # Post-payment confirmation
│   │   │   ├── product-detail/              # Single product view
│   │   │   └── ai/
│   │   │       ├── stylist-search/          # AI text stylist
│   │   │       └── visual-search/           # AI image search
│   │   ├── services/
│   │   │   ├── productService.ts            # Product fetching & filtering
│   │   │   ├── cart-service.ts              # Cart CRUD + localStorage
│   │   │   ├── order-service.ts             # Order persistence
│   │   │   └── stylist-search-service.ts    # Mistral AI integration
│   │   └── utils.ts                         # Image compression, response parser
│   ├── Guard/                               # Route guards (auth, pin)
│   ├── Services/Auth/                       # Supabase auth service
│   └── shared/components/                   # Header, footer
├── environments/                            # Dev & prod config
├── Types/                                   # Product, CartItem, Order, User
└── styles.css                               # Global dark theme CSS variables
```

---

## Prerequisites

- **Node.js** >= 18
- **Angular CLI** >= 21 (`npm install -g @angular/cli`)
- **.NETCore v10.0 SDK** (to run the PaymentApi backend)
- **Stripe account** (test mode)
- **Supabase project** (with a `Users` table)
- **Mistral AI API key**
- **EmailJS account** (for password reset emails)

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ECommerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

### 4. Set up the PaymentApi backend

Clone the backend API repository:

```bash
git clone https://github.com/bassantadel71/backend-ecommerce-final
```

Follow the instructions in that repository's README to configure and run the server.

The payment server runs on `http://localhost:5000`. Make sure to update `appsettings.json` with your Stripe secret key before starting.

### 5. Set up Supabase

Create a `Users` table in your Supabase project with the following columns:

| Column     | Type                 |
| ---------- | -------------------- |
| `id`       | `uuid` (primary key) |
| `username` | `text`               |
| `email`    | `text`               |
| `password` | `text`               |

Enable Google OAuth in Supabase → Authentication → Providers.

### 6. Set up EmailJS

Create an EmailJS account and configure:

- A service connected to your email provider
- A template for the password reset PIN
- Update the service ID, template ID, and public key in the `ForgetPassword` component

### 7. Run the development server

```bash
npm start
```

Navigate to `http://localhost:4200`.

---

## Build

```bash
npm run build
```

Output is in `dist/ecommerce/`. Environment variables are injected at build time via `.env`.

---

## Routes

| Path               | Description                                | Auth Required |
| ------------------ | ------------------------------------------ | ------------- |
| `/home`            | Landing page with hero & featured products | No            |
| `/shop`            | Full product catalog with filters          | No            |
| `/product/:id`     | Product detail view                        | No            |
| `/stylist`         | AI text-based stylist search               | No            |
| `/visual-search`   | AI image-based visual search               | No            |
| `/login`           | Login form + Google OAuth                  | No            |
| `/signup`          | Registration form                          | No            |
| `/forgetpassword`  | Password reset: email entry                | No            |
| `/pinform`         | Password reset: PIN verification           | No            |
| `/resetpassword`   | Password reset: new password               | No            |
| `/auth/callback`   | Google OAuth redirect handler              | No            |
| `/checkout`        | Stripe payment checkout                    | Yes           |
| `/payment-success` | Payment confirmation                       | Yes           |

---
