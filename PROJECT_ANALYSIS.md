# VANTA ECommerce — Complete Project Analysis

> A modern, dark-themed, streetwear-focused ecommerce SPA built with **Angular 21** (standalone components, Signals). Features AI-powered product discovery, Stripe payments, Google OAuth, and Supabase as BaaS.

---

## Table of Contents

1. Project Overview
2. Architecture & Layers
3. Routing & Lazy Loading
4. Angular Concepts — Where They're Used
5. Services & Data Logic
6. Data Flow Diagrams
7. Third-Party Integrations
8. State Management Strategy
9. Component Communication Patterns
10. Testing
11. UI / Design System
12. Docker & Deployment
13. Summary of Key Angular Patterns
14. Appendix: Component Inventory

---

## 1. Project Overview

**VANTA** is a single-page application for an online streetwear store. It supports:

| Feature Area | Capabilities |
|---|---|
| **Shopping** | Product catalog with pagination & category filters, product detail, shopping cart, Stripe checkout, order history |
| **AI Discovery** | Text-based AI stylist (describe an occasion → get top 3 products), image-based visual search (upload photo → get matches) |
| **Authentication** | Email signup/login with SHA-256 hashed passwords, Google OAuth via Supabase, 3-step password reset with PIN email |
| **UI** | Dark luxe theme, acid green accent, responsive Bootstrap grid, lazy-loaded routes |

**Tech Stack**: Angular 21 · Bootstrap 5 · Supabase · Mistral AI · Stripe · EmailJS · CryptoJS · Vitest

---

## 2. Architecture & Layers

### 2.1 High-Level Architecture

The architecture is a browser SPA that communicates with multiple external services:

- **Components (Standalone)** talk to **Services (Signals)** which talk to **External APIs**
- External APIs include: FakeStore REST API, Supabase (DB + Auth), Mistral AI, Stripe Elements, EmailJS
- A separate ASP.NET Core backend handles Stripe Payment Intents with MySQL 8.0

### 2.2 Project Folder Structure

```
src/
├── app/
│   ├── app.ts / app.html / app.css              # Root component
│   ├── app_config.ts                            # Application providers (Router, HttpClient)
│   ├── app_routes.ts                            # Lazy-loaded route definitions
│   │
│   ├── Components/                              # ======= AUTH AREA =======
│   │   ├── login/                               #   Login form + Google OAuth button
│   │   ├── signup/                              #   Registration (Reactive Forms, validators)
│   │   ├── auth-callback/                       #   Google OAuth redirect handler
│   │   ├── forget-password/                     #   Password reset step 1: enter email
│   │   ├── pin-form/                            #   Password reset step 2: verify PIN
│   │   └── reset-password/                      #   Password reset step 3: new password
│   │
│   ├── core/features/products/                  # ==== PRODUCT AREA ====
│   │   ├── components/
│   │   │   ├── home/                            #   Landing page (hero + featured grid)
│   │   │   ├── shop/                            #   Catalog with tabs + load more
│   │   │   ├── card/                            #   Reusable product card
│   │   │   ├── product-detail/                  #   Single product view + add to cart
│   │   │   ├── cart/                            #   Slide-out cart drawer
│   │   │   ├── tabs/                            #   Category filter tabs (All/Men/Women/Kids)
│   │   │   ├── checkout/                        #   Stripe Elements payment form
│   │   │   ├── payment-success/                 #   Post-payment confirmation page
│   │   │   └── ai/
│   │   │       ├── stylist-search/              #   AI text stylist (chat-style UI)
│   │   │       └── visual-search/               #   AI image search (upload + results)
│   │   ├── services/
│   │   │   ├── productService.ts                #   Product fetching, mapping, filtering
│   │   │   ├── cart-service.ts                  #   Cart CRUD + localStorage persistence
│   │   │   ├── order-service.ts                 #   Order creation + localStorage persistence
│   │   │   └── stylist-search-service.ts        #   Mistral AI integration (text + vision)
│   │   └── utils.ts                             #   Image compression, JSON response parser
│   │
│   ├── Guard/                                   # ===== ROUTE GUARDS =====
│   │   ├── auth/auth-guard.ts                   #   Checks localStorage for 'username'
│   │   └── pin/pin-guard.ts                     #   Placeholder (always returns true)
│   │
│   ├── Services/Auth/auth.ts                    #   Supabase auth service (DB + OAuth)
│   │
│   └── shared/components/                       # ====== SHARED UI ======
│       ├── header/header.ts                     #   Site header (nav, cart badge, auth state)
│       └── footer/footer.ts                     #   Site footer
│
├── Types/                                       # ==== TYPE DEFINITIONS ====
│   ├── type.ts                                  #   Product, CartItem, Order, OrderItem interfaces
│   └── User.ts                                  #   User class with UUID generation
│
├── environments/                                # ==== ENVIRONMENT CONFIG ====
│   ├── environment.ts                           #   Dev: all API keys hardcoded
│   └── environment.prod.ts                      #   Prod: placeholder values
│
├── baseUrl.ts                                   #   Supabase URL constant
├── supaBaseKey.ts                               #   Supabase anon key constant
├── styles.css                                   #   Global CSS custom properties (dark theme)
├── main.ts                                      #   Application bootstrap entry point
└── index.html                                   #   SPA shell
```

### 2.3 Type Definitions

**src/Types/type.ts** — Core domain interfaces:

| Interface | Fields |
|---|---|
| **Product** | id, title, category, currentPrice, oldPrice?, description, imageUrl, availableSizes[], tags[], stock, brand, rating, isNew |
| **CartItem** | product: Product, quantity, selectedSize |
| **OrderItem** | productId, title, quantity, selectedSize, unitPrice |
| **Order** | id, paymentIntentId, items[], subtotal, shipping, total, status, createdAt |

**src/Types/User.ts** — User class:

| Field | Type | Notes |
|---|---|---|
| id | string | Auto-generated via uuid.v4() in constructor |
| username | string | |
| email | string | |
| password | string | SHA-256 hashed before storage (in AuthService) |

---

## 3. Routing & Lazy Loading

All routes use `loadComponent` for **code splitting** (each route's component is loaded on demand), except `/auth/callback` which is eagerly loaded.

| Path | Component | Auth Guard | Lazy Loaded | Description |
|---|---|---|---|---|
| `''` | — → redirect | No | — | Redirects to `/home` |
| `/home` | `Home` | No | ✅ | Landing page with hero + 8 featured products |
| `/shop` | `Shop` | No | ✅ | Full catalog with category tabs + pagination |
| `/product/:id` | `ProductDetail` | No | ✅ | Single product view with size selection |
| `/stylist` | `StylistSearch` | No | ✅ | AI text-based stylist (chat UI) |
| `/visual-search` | `VisualSearch` | No | ✅ | AI image-based visual search |
| `/login` | `Login` | No | ✅ | Login form + Google OAuth button |
| `/signup` | `Signup` | No | ✅ | Registration form with validation |
| `/forgetpassword` | `ForgetPassword` | No | ✅ | Password reset: email entry |
| `/pinform` | `PinForm` | No | ✅ | Password reset: PIN verification |
| `/resetpassword` | `ResetPassword` | No | ✅ | Password reset: new password |
| `/auth/callback` | `AuthCallback` | No | ❌ | Google OAuth redirect handler |
| `/checkout` | `Checkout` | ✅ authGuard | ✅ | Stripe payment checkout |
| `/payment-success` | `PaymentSuccess` | ✅ authGuard | ✅ | Payment confirmation + order creation |
| `**` | — → redirect | — | — | Redirects to `/home` |

---

## 4. Angular Concepts — Where They're Used

### 4.1 Signals (`signal()`, `computed()`, `.set()`, `.update()`)

| Location | Signal Declaration | Type | Purpose |
|---|---|---|---|
| `ProductService` | `products = signal<Product[]>([])` | Writable | Holds all fetched products |
| `ProductService` | `category = signal<string>("All")` | Writable | Current category filter |
| `ProductService` | `page = signal<number>(1)` | Writable | Pagination page number |
| `ProductService` | `limit = signal<number>(8)` | Writable | Items per page |
| `ProductService` | `hasMore = signal<boolean>(true)` | Writable | Whether more pages exist |
| `ProductService` | `filteration = computed(...)` | **Computed** | Derived: filters products() by category() |
| `CartService` | `cartOpen = signal(false)` | Writable | Cart drawer open/close state |
| `OrderService` | `orders = signal<Order[]>(...)` | Writable (private) | Order list from localStorage |
| `OrderService` | `ordersList = computed(...)` | **Computed** | Read-only view of orders |
| `AppHeader` | `menuOpen = signal(false)` | Writable | Mobile hamburger menu toggle |
| `ForgetPassword` | `invalidEmail = signal(false)` | Writable | Email validation error state |

**Key pattern** — Services expose writable signals. Components create `computed()` signals to derive view-specific data:

```ts
// Home component — derives first 8 products
homeProducts = computed(() => {
  const products = this.productService.products();
  return products.slice(0, 8);
});

// Shop component — delegates to ProductService computed
products = computed(() => {
  return this.productService.filteration();
});
```

**Signal update methods used**:

| Method | Example | Where |
|---|---|---|
| `.set()` | `this.products.set(mappedProducts)` | ProductService, CartService |
| `.update()` | `this.products.update(prev => [...prev, ...new])` | ProductService (append on load more) |
| `.update()` | `this.menuOpen.update(v => !v)` | AppHeader (toggle mobile menu) |
| `.set()` | `this.cartOpen.set(false)` | CartService |
| `.set()` | `this.category.set(category)` | Shop → ProductService |

### 4.2 Lifecycle Hooks

| Hook | Component | What It Does |
|---|---|---|
| `ngOnInit` | `Home` | Calls `productService.getHomeProducts()` to load first 8 products |
| `ngOnInit` | `Shop` | Calls `productService.getProducts()` to load paginated products |
| `ngOnInit` | `ProductDetail` | Fetches products if signal is empty (handles direct URL access) |
| `ngOnInit` | `VisualSearch` | Preloads full product catalog for AI matching |
| `ngOnInit` | `StylistSearch` | Preloads full product catalog for AI matching |
| `ngOnInit` | `PaymentSuccess` | Reads `queryParams` for `redirect_status` + `payment_intent` from Stripe redirect, creates order, clears cart |
| `ngOnInit` | `AuthCallback` | Calls `getGoogleUser()` to finalize Google OAuth, stores username in localStorage |
| `ngAfterViewInit` | `Checkout` | After DOM is ready: loads Stripe.js, creates Payment Intent via backend, mounts Stripe Elements. Uses `ChangeDetectorRef.detectChanges()` for manual CD after async setup |

### 4.3 Dependency Injection

**Primary pattern**: `inject()` function (field injection)

```ts
// Used in almost every component and service
productService = inject(ProductService);
router = inject(Router);
http = inject(HttpClient);
cdr = inject(ChangeDetectorRef);
```

**Constructor injection** is used only where `ChangeDetectorRef` or multiple dependencies are needed:

| Component | Injected via Constructor |
|---|---|
| `Checkout` | `CartService`, `HttpClient`, `ChangeDetectorRef` |
| `Cart` | `CartService`, `Router` |
| `ProductDetail` | `CartService` |
| `VisualSearch` | `Router` |
| `AuthService` | (none — creates Supabase client in constructor body) |
| `OrderService` | `CartService` |

All services use `providedIn: 'root'` → **singleton scope** application-wide.

### 4.4 Standalone Components

**Every component is standalone** — there are zero NgModules in the project. Each component declares its own `imports` array:

```ts
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
```

Most components omit `standalone: true` since it is the default in Angular 21, but all still declare their own `imports`.

### 4.5 Control Flow Syntax (`@if`, `@for`)

Angular 17+ built-in control flow is used throughout all templates.

#### `@for` — Iteration with tracking

```html
<!-- Product grid in home.html -->
@for (item of homeProducts(); track item.id) {
  <div class="col-6 col-md-4 col-lg-3">
    <app-card [cardProduct]="item"></app-card>
  </div>
}
```

**Where `@for` is used**: `home.html`, `shop.html`, `product-detail.html` (sizes, tags), `cart.html` (cart items), `checkout.html` (order items), `stylist-search.html` (chat messages, results), `visual-search.html` (results)

#### `@if` — Conditional rendering

```html
<!-- With alias binding -->
@if (product(); as p) {
  <div>{{ p.title }}</div>
}

<!-- With nested conditions -->
@if (verifying) {
  <p>VERIFYING PAYMENT...</p>
}
@if (!verifying && success) {
  <h1>ORDER PLACED.</h1>
}
```

**Where `@if` is used**: Every template — login errors, empty cart, loading states, mobile menu, AI search results, payment states, form validation errors

### 4.6 Input / Output Bindings

| Decorator | Component | Usage |
|---|---|---|
| `@Input()` | `Card.cardProduct` | Parent passes `Product` to display |
| `@Input()` | `Cart.isOpen` | Root component passes cart drawer open state |
| `@Input()` | `Login.username` / `Login.password` | Template-driven form fields |
| `@Input()` | `ForgetPassword.email` | Email input field |
| `@Input()` | `PinForm.pin` | PIN input field |
| `@Output()` | `Cart.closed` | Emits when user closes cart drawer |
| `@Output()` | `Tabs.selectedCategory` | Emits selected category to `Shop` parent |

### 4.7 Forms

#### Reactive Forms — `Signup` and `ResetPassword`

```ts
form = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  username: new FormControl('', [Validators.required]),
  password: new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(new RegExp('[^a-zA-Z0-9]')),   // special char
    Validators.pattern(new RegExp('[A-Z]')),            // uppercase
    Validators.pattern(new RegExp('[a-z]')),            // lowercase
    Validators.pattern(new RegExp('[0-9]')),            // digit
  ]),
  confirmPassword: new FormControl('', [Validators.required])
}, { validators: match });   // custom cross-field validator
```

**Custom validator** `match()` — defined at `FormGroup` level, checks `password === confirmPassword`:

```ts
function match(group: AbstractControl): ValidationErrors | null {
  let password = group.get("password")?.value;
  let confirmPassword = group.get("confirmPassword")?.value;
  return password !== confirmPassword ? { match: true } : null;
}
```

> Note: This validator is **duplicated** in both `signup.ts` and `reset-password.ts`.

#### Template-Driven Forms — `Login`, `ForgetPassword`, `PinForm`

Simple forms using `[(ngModel)]` two-way binding with `FormsModule`:

```html
<input [(ngModel)]="username" name="username" class="auth-input" placeholder="Enter username">
```

### 4.8 Route Guards (Functional)

Angular 16+ functional guards using `CanActivateFn`:

```ts
// auth-guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const username = localStorage.getItem("username");
  if (username == null) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
```

| Guard | File | Applied To | Behavior |
|---|---|---|---|
| `authGuard` | `Guard/auth/auth-guard.ts` | `/checkout`, `/payment-success` | Redirects to `/login` if no username in localStorage |
| `pinGuard` | `Guard/pin/pin-guard.ts` | (not used on any route) | Placeholder — always returns `true` |

### 4.9 Other Angular Features

| Feature | Where | Details |
|---|---|---|
| `@ViewChild` | `StylistSearch` | `@ViewChild('chatHistory', { static: false })` — gets DOM element ref for auto-scrolling chat to bottom |
| Template ref `#var` | `StylistSearch` (`#chatHistory`, `#occasion`) | Access DOM elements or template variables |
| `UpperCasePipe` | `ProductDetail` | `{{ p.category | uppercase }}` |
| `Location` service | `ProductDetail` | `this.location.back()` for back navigation |
| `ChangeDetectorRef` | `Checkout`, `VisualSearch`, `StylistSearch` | Manual `detectChanges()` after async operations outside Angular zone |
| `RouterLink` | Header, Home, Footer, many templates | Declared in each component's `imports` array |
| `ActivatedRoute` | `ProductDetail`, `PaymentSuccess` | Read route params (`:id`) and query params (`redirect_status`, `payment_intent`) |

---

## 5. Services & Data Logic

### 5.1 ProductService

**File**: `src/app/core/features/products/services/productService.ts`

**Data source**: External REST API — `https://fakestoreapiserver.reactbd.org/api/products`

| Method | What It Does |
|---|---|
| `getHomeProducts()` | Fetches 8 products → `products.set()` |
| `getProducts()` | Fetches paginated products → `products.update(prev => [...prev, ...new])` (appends) |
| `loadMore()` | Increments page signal → calls `getProducts()` |
| `mapProduct(apiProduct)` | Transforms raw API response into `Product` interface (adds image URL params, default tags) |

**Computed signal** `filteration`: derives a filtered subset from `products()` based on `category()` (men/women/kids/All).

### 5.2 CartService

**File**: `src/app/core/features/products/services/cart-service.ts`

**Persistence**: `localStorage` key `vanta_cart`

| Method | What It Does |
|---|---|
| `addToCart(product, size, qty)` | Finds existing item by product ID + size; increments quantity or pushes new item |
| `removeFromCart(productId, size?)` | Filters out matching item(s) |
| `clearCart()` | Empties array + localStorage |
| `openCart()` / `closeCart()` / `toggleCart()` | Controls `cartOpen` signal |
| `getCartItems()` | Returns current cart array |
| `isInCart(productId)` | Checks if product is in cart |
| `getTotalPrice()` | `reduce()` over items: price × quantity |
| `getTotalInCents()` | `getTotalPrice() × 100` (Stripe requires cents) |
| `getTotalItems()` | `reduce()` over quantities |

**Key design**: State is a plain `CartItem[]` array (not a signal). Only `cartOpen` is a signal. Persistence is manual — every mutation calls `saveToStorage()`.

### 5.3 OrderService

**File**: `src/app/core/features/products/services/order-service.ts`

**Persistence**: `localStorage` key `orders`

| Method | What It Does |
|---|---|
| `createOrder(paymentIntentId)` | Converts cart → `OrderItem[]`, calculates subtotal + flat $12 shipping, generates UUID, updates `orders` signal, saves |
| `getOrderById(id)` | Finds order by UUID |
| `getOrderByPaymentIntent(id)` | Finds order by Stripe PaymentIntent ID |

**Key design**: Uses `signal<Order[]>` + `computed` `ordersList`. Loads from localStorage on construction.

### 5.4 AuthService

**File**: `src/app/Services/Auth/auth.ts`

**Backend**: Supabase (PostgreSQL `Users` table + Google OAuth)

| Method | What It Does |
|---|---|
| `AddUser(user)` | SHA-256 hashes password via CryptoJS, checks duplicate email, inserts into Supabase `Users` table |
| `CheckUser(username, password)` | SHA-256 hashes password, queries Supabase for matching credentials |
| `GetUserByEmail(email)` | Supabase `.select('*').eq('email', email)` |
| `GeneratePin()` | Generates random 6-digit PIN, stores in `this.pin` (service instance property) |
| `UpdatePassword(email, newPassword)` | SHA-256 hashes new password, updates Supabase `Users` table |
| `signInWithGoogle()` | Supabase OAuth redirect to Google with callback to `/auth/callback` |
| `getGoogleUser()` | `supabase.auth.getUser()` — retrieves current Google user session |

**Key design**: Passwords are **never stored in plain text** — always SHA-256 hashed via CryptoJS before database operations.

### 5.5 StylistSearchService

**File**: `src/app/core/features/products/services/stylist-search-service.ts`

**Backend**: Mistral AI REST API (no SDK — uses native `fetch()`)

| Method | What It Does |
|---|---|
| `searchText(text)` | Serializes product catalog as text, sends to Mistral `mistral-large-latest` with system prompt, extracts top 3 product IDs |
| `searchImage(imageUrl)` | Sends image + catalog to Mistral vision model (`mistral-medium-3.5`), extracts top 3 matching products |

**How it works**:
1. The full product catalog is serialized into a text string (ID, title, category, brand, price, sizes, tags, stock)
2. A system prompt instructs the AI to act as a stylist assistant
3. The AI returns a JSON array of 3 product IDs
4. `extractTop3Products()` (in `utils.ts`) parses the response — handles markdown code blocks, extracts the JSON array, resolves IDs to full `Product` objects

### 5.6 Utils

**File**: `src/app/core/features/products/utils.ts`

| Function | What It Does |
|---|---|
| `compressImage(file, maxWidth=800, maxHeight=800, quality=0.6)` | Client-side image compression using Canvas API. Reads file → draws to canvas at reduced dimensions → exports as JPEG at 60% quality → returns base64 DataURL |
| `extractTop3Products(content, products)` | Parses Mistral AI response. Handles ```json``` code blocks, extracts JSON array, maps numeric IDs to `Product` objects from catalog |

---

## 6. Data Flow Diagrams

### 6.1 Product Browsing Flow

```
User visits /home or /shop
        │
        ▼
Component.ngOnInit()
        │
        ▼
ProductService.getProducts()
        │
        ▼
HttpClient.get(apiBaseUrl?page=X&limit=Y)
        │
        ▼
FakeStore API returns { data: [...products] }
        │
        ▼
mapProduct() transforms each item → Product interface
        │
        ▼
products signal.set() or .update(prev => [...prev, ...new])
        │
        ▼
Component's computed() signal derives filtered/sliced view
        │
        ▼
Template @for renders <app-card> for each product
```

### 6.2 Cart & Checkout Flow

```
ProductDetail "Add to bag"
        │
        ▼
CartService.addToCart(product, size)
        │
        ├── Adds to cartItems array (or increments quantity)
        └── saveToStorage() → localStorage

User clicks "Checkout"
        │
        ▼
Cart component navigates to /checkout
        │
        ▼
Checkout.ngAfterViewInit()
        │
        ├── loadStripe(publicKey)
        ├── HttpClient.post('/api/payments/create-payment-intent', { amount })
        │       └── ASP.NET Core backend creates Stripe PaymentIntent
        │
        ▼
Stripe Elements mounted on #payment-element
        │
        ▼
User fills card → clicks "Place order"
        │
        ▼
stripe.confirmPayment({ return_url: /payment-success })
        │
        ▼
Stripe redirects to /payment-success?redirect_status=succeeded&payment_intent=pi_xxx
        │
        ▼
PaymentSuccess.ngOnInit()
        │
        ├── Reads queryParams
        ├── OrderService.createOrder(paymentIntentId)
        │       └── Creates Order → saves to localStorage
        └── CartService.clearCart()
```

### 6.3 Auth Flow (Email)

```
Signup Form
        │
        ▼
AuthService.AddUser(new User(username, email, password))
        │
        ├── cryptoJS.SHA256(password)
        ├── Check duplicate email via Supabase
        └── Supabase Users.insert({ id, username, email, password })
                │
                ▼
        Navigate to /login

Login Form
        │
        ▼
AuthService.CheckUser(username, password)
        │
        ├── cryptoJS.SHA256(password)
        └── Supabase select where username=X AND password=Y
                │
                ▼
        If found: localStorage.setItem('username', name) → /home
        If not found: show "INVALID CREDENTIALS"
```

### 6.4 Password Reset Flow

```
Step 1: /forgetpassword
        │
        ▼
AuthService.GetUserByEmail(email)
        │
        ▼
AuthService.GeneratePin() → 6-digit random number
        │
        ▼
EmailJS.send(service, template, { email_to, auth_code })
        │
        ▼
Navigate to /pinform

Step 2: /pinform
        │
        ▼
PinForm.ValidatePin()
        │
        ├── Compare input === authService.pin
        └── If match: Navigate to /resetpassword

Step 3: /resetpassword
        │
        ▼
AuthService.UpdatePassword(email, newPassword)
        │
        ├── cryptoJS.SHA256(newPassword)
        └── Supabase Users.update({ password }) where email=X
                │
                ▼
        Navigate to /login
```

### 6.5 Google OAuth Flow

```
Login page → "Sign in with Google" button
        │
        ▼
AuthService.signInWithGoogle()
        │
        ▼
Supabase auth.signInWithOAuth({ provider: 'google', redirectTo: /auth/callback })
        │
        ▼
Google authentication page (external)
        │
        ▼
Google redirects to /auth/callback
        │
        ▼
AuthCallback.ngOnInit()
        │
        ▼
AuthService.getGoogleUser() → supabase.auth.getUser()
        │
        ├── Extracts full_name from user_metadata
        ├── localStorage.setItem('username', name)
        └── Navigate to /home
```

### 6.6 AI Stylist Search Flow

```
StylistSearch component (chat UI)
        │
        ▼
User types occasion (e.g. "80s party")
        │
        ▼
StylistSearchService.searchText("80s party")
        │
        ├── Serializes full product catalog as text
        ├── Builds prompt: "Return ONLY 3 most similar product IDs as JSON"
        ├── fetch(MistralApiUrl, { model: "mistral-large-latest", messages: [...] })
        │
        ▼
Mistral AI returns: [1, 5, 12]
        │
        ▼
extractTop3Products(response, catalog)
        │
        ├── Parses JSON (handles ```json``` blocks)
        └── Maps IDs → Product objects
        │
        ▼
Results rendered as <app-card> components
```

### 6.7 AI Visual Search Flow

```
VisualSearch component
        │
        ▼
User uploads image file
        │
        ▼
compressImage(file) → Canvas-based JPEG compression (800px, 60% quality)
        │
        ▼
StylistSearchService.searchImage(base64DataUrl)
        │
        ├── Serializes product catalog
        ├── Builds multimodal prompt (text + image_url)
        ├── fetch(MistralApiUrl, { model: "mistral-medium-3.5", messages: [image + text] })
        │
        ▼
Mistral vision model returns: [3, 7, 9]
        │
        ▼
extractTop3Products() → maps IDs to Products
        │
        ▼
Results rendered as <app-card> components
```

---

## 7. Third-Party Integrations

### 7.1 Runtime Dependencies

| Library | Version | Purpose | Where Used |
|---|---|---|---|
| `@angular/common` | ^21.2.0 | CommonModule, HttpClient, Location, UpperCasePipe | Throughout |
| `@angular/core` | ^21.2.0 | Signals, DI, Component, Lifecycle hooks | Throughout |
| `@angular/forms` | ^21.2.0 | FormsModule, ReactiveFormsModule, Validators | Auth forms |
| `@angular/router` | ^21.2.0 | Router, ActivatedRoute, Guards, RouterOutlet | Throughout |
| `@angular/platform-browser` | ^21.2.0 | bootstrapApplication | main.ts |
| `@supabase/supabase-js` | ^2.105.4 | PostgreSQL database + Google OAuth | AuthService |
| `@stripe/stripe-js` | ^9.6.0 | Client-side Stripe Elements + confirmPayment | Checkout |
| `@emailjs/browser` | ^4.4.1 | Send password reset PIN emails | ForgetPassword |
| `crypto-js` | ^4.2.0 | SHA-256 password hashing | AuthService |
| `bootstrap` | ^5.3.8 | CSS grid system + responsive utilities | Global (angular.json) |
| `bootstrap-icons` | ^1.13.1 | Icon library (`bi-bag`, `bi-send`, `bi-camera`, etc.) | Templates |
| `uuid` | ^14.0.0 | UUID generation for User IDs | User class |
| `rxjs` | ~7.8.0 | Observables for HttpClient + route params | Services |

### 7.2 External APIs (via HTTP)

| API | Base URL | Purpose | Auth Method |
|---|---|---|---|
| **FakeStore API** | `https://fakestoreapiserver.reactbd.org/api/products` | Product catalog data | None |
| **Mistral AI** | `https://api.mistral.ai/v1/chat/completions` | Text + vision AI search | Bearer token |
| **Stripe Backend** | `http://localhost:5000/api/payments` | Payment Intent creation | ASP.NET Core backend |
| **Supabase** | `https://xckhkeelnhlalcckuwkn.supabase.co` | User DB + Google OAuth | Anon key |

### 7.3 External Services (via SDK)

| Service | SDK/Method | Purpose |
|---|---|---|
| **EmailJS** | `@emailjs/browser` `.send()` | Sends password reset PIN emails |
| **Stripe** | `@stripe/stripe-js` `loadStripe()` | Client-side payment form |
| **Supabase** | `@supabase/supabase-js` `createClient()` | Database queries + OAuth |

### 7.4 Dev Dependencies

| Library | Version | Purpose |
|---|---|---|
| `@angular/build` | ^21.2.8 | Build tooling (esbuild-based) |
| `@angular/cli` | ^21.2.8 | Angular CLI commands |
| `@angular/compiler-cli` | ^21.2.0 | AOT compilation |
| `@types/crypto-js` | ^4.2.2 | TypeScript types for CryptoJS |
| `@types/node` | ^25.8.0 | Node.js type definitions |
| `jsdom` | ^28.0.0 | DOM environment for unit tests |
| `prettier` | ^3.8.1 | Code formatting |
| `typescript` | ~5.9.2 | TypeScript compiler |
| `vitest` | ^4.0.8 | Unit testing framework |

---

## 8. State Management Strategy

This project uses a **service-based state** pattern with Angular Signals — no NgRx, no external state library.

| State | Storage | Mechanism | Owner |
|---|---|---|---|
| Products list | In-memory | `signal<Product[]>` | `ProductService` |
| Category filter | In-memory | `signal<string>` | `ProductService` |
| Pagination (page, limit, hasMore) | In-memory | `signal<number>`, `signal<boolean>` | `ProductService` |
| Cart items | `localStorage` + array | Plain `CartItem[]` + manual sync | `CartService` |
| Cart drawer open | In-memory | `signal<boolean>` | `CartService` |
| Orders | `localStorage` + `signal` | `signal<Order[]>` loaded from storage | `OrderService` |
| Auth (logged-in user) | `localStorage` | String key `'username'` | Header + Guard |
| Password reset PIN | In-memory (service) | String property `authService.pin` | `AuthService` |
| Password reset email | `localStorage` | String key `'email'` | ForgetPassword → ResetPassword |
| Mobile menu | In-memory | `signal<boolean>` | `AppHeader` |
| AI search results | In-memory | Component properties | `StylistSearch`, `VisualSearch` |

---

## 9. Component Communication Patterns

| Pattern | Direction | Example |
|---|---|---|
| **`@Input` binding** | Parent → Child | `Home` → `Card` via `[cardProduct]="item"` |
| **`@Output` + `EventEmitter`** | Child → Parent | `Tabs` → `Shop` via `(selectedCategory)="selector($event)"` |
| **Shared service (signals)** | Any → Any | `ProductService.products` read by Home, Shop, ProductDetail, VisualSearch, StylistSearch |
| **Shared service (methods)** | Any → Any | `CartService.addToCart()` called from ProductDetail, Cart |
| **Template ref + `@ViewChild`** | Component → DOM | `StylistSearch` uses `@ViewChild('chatHistory')` to auto-scroll chat |
| **Signal reading in templates** | Service → Template | `App` root reads `cartService.cartOpen()` directly in `app.html` |
| **`localStorage`** | Cross-navigation | Auth state, email, PIN persist across route changes |

### Communication Map

```
┌─────────────────────────────────────────────────────────────┐
│                       App (root)                             │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    AppHeader                            │ │
│  │  reads: CartService.cartItems, CartService.cartOpen     │ │
│  │  writes: CartService.cartOpen.update()                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────┐   @Input    ┌───────┐                         │
│  │   Home    │───────────▶│ Card  │   (product data)         │
│  │   Shop    │───────────▶│ Card  │                          │
│  └──────────┘             └───────┘                          │
│       │                                                     │
│       │ inject(ProductService)                               │
│       ▼                                                     │
│  ┌──────────────────┐                                       │
│  │  ProductService   │ ← shared singleton                    │
│  │  .products signal │                                      │
│  │  .category signal │                                      │
│  │  .filteration     │                                      │
│  └──────────────────┘                                       │
│                                                             │
│  ┌────────────────┐  @Output(closed)  ┌──────────────────┐ │
│  │  Tabs           │─────────────────▶│      Shop         │ │
│  │ (selectedCategory)               │ .selector()       │ │
│  └────────────────┘                 └──────────────────┘ │
│                                                             │
│  ┌─────────────────┐              ┌──────────────────┐     │
│  │  ProductDetail   │─────────────▶│  CartService      │     │
│  │  .addToCart()    │              │  .addToCart()     │     │
│  └─────────────────┘              │  .cartOpen signal │     │
│                                    └──────────────────┘     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Cart (drawer)                                         │ │
│  │  @Input isOpen  ◀── App root                           │ │
│  │  @Output closed ──▶ App root                           │ │
│  │  inject(CartService)                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Testing

### Setup

- **Framework**: Vitest + jsdom (configured via `@angular/build:unit-test` in angular.json)
- **Spec pattern**: `*.spec.ts` alongside each source file

### Existing Tests

All existing test files are **scaffold-only** — they verify the component/service can be instantiated but contain no behavioral tests:

| Spec File | What It Tests | Assertions |
|---|---|---|
| `Services/Auth/auth.spec.ts` | `AuthService` creation | `expect(service).toBeTruthy()` |
| `Guard/auth/auth-guard.spec.ts` | `authGuard` function exists | `expect(executeGuard).toBeTruthy()` |
| `Guard/pin/pin-guard.spec.ts` | `pinGuard` function exists | `expect(executeGuard).toBeTruthy()` |
| `Components/signup/signup.spec.ts` | `Signup` component creation | `expect(component).toBeTruthy()` |
| `Components/login/login.spec.ts` | `Login` component creation | `expect(component).toBeTruthy()` |

---

## 11. UI / Design System

> Based on `DESIGN.md` and `src/styles.css`

### Theme

| Property | Value |
|---|---|
| Canvas | `#0e0e10` (near-black, slight cool tint) |
| Text | `#f5f5f6` (near-white) |
| Cards | `#1a1a1e` (slightly elevated surface) |
| **Accent** | **`#39ff14` (acid/neon green)** — used sparingly |
| Borders | `rgba(255, 255, 255, 0.08)` (hairlines) |
| Error | `#d9453a` (destructive red) |
| Selection | Neon green background with dark text |
| Scrollbar | Dark track, accent thumb, 4px radius |

### Design Rules

| Rule | Implementation |
|---|---|
| **One accent color** | Neon green used only for: primary CTAs, hover borders, logo slash `VANTA/`, active tabs, cart badge |
| **Square/rigid corners** | Max 4px border-radius — no rounded cards or pill buttons |
| **Borders over shadows** | Hairline borders define surfaces — no box shadows on cards |
| **Typography** | Space Grotesk (headings), Inter (body), JetBrains Mono (labels/eyebrows) |
| **Uppercase mono** | All labels, CTAs, and meta text are uppercase with wide letter-spacing |
| **Responsive** | Bootstrap 5 grid (`col-6 col-md-4 col-lg-3` product grid) |
| **Dark-first** | Everything is dark — no light mode |

### CSS Custom Properties (from `styles.css`)

```css
:root {
  --background: #0e0e10;
  --foreground: #f5f5f6;
  --card: #1a1a1e;
  --popover: #16161a;
  --primary: #f5f5f6;
  --primary-foreground: #0e0e10;
  --secondary: #28282e;
  --muted: #222226;
  --muted-foreground: #8a8a96;
  --accent: #2a2a30;
  --destructive: #d9453a;
  --border: rgba(255, 255, 255, 0.08);
  --input: rgba(255, 255, 255, 0.12);
  --ring: #39ff14;
  --neon: #39ff14;
  --neon-foreground: #0e0e10;
  --radius: 4px;
}
```

---

## 12. Docker & Deployment

### docker-compose.yaml

Docker Compose defines 3 services:

| Service | Image/Build | Port | Dependencies |
|---|---|---|---|
| `frontend` | `./` (Dockerfile: `node:22`) | 4200 | backend |
| `backend` | `./BE/StripeApi` | 5000 | mysql |
| `mysql` | `mysql:8.0` | 3306 | — |

- Frontend: Node.js 22 image, runs `npm start` with `--host 0.0.0.0 --port 4200`
- Backend: ASP.NET Core Stripe Payment API
- MySQL: Persistent volume `mysql_data`

### Dockerfile (Frontend)

```dockerfile
FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
```

---

## 13. Summary of Key Angular Patterns

| Angular Concept | Usage in This Project |
|---|---|
| **Standalone components** | Every component — zero NgModules |
| **Signals** | 11+ writable signals across services and components |
| **Computed signals** | 4 computed signals for derived state (`filteration`, `homeProducts`, shop `products`, `ordersList`) |
| **Lazy loading** | 13 of 14 routes use `loadComponent` |
| **Functional route guards** | `authGuard` and `pinGuard` as `CanActivateFn` |
| **`inject()` function** | Primary DI method — used in ~15 components |
| **Reactive Forms** | Signup and ResetPassword (`FormGroup` + validators) |
| **Template-driven Forms** | Login, ForgetPassword, PinForm (`ngModel`) |
| **Custom validators** | `match()` cross-field validator for password confirmation |
| **`@if` / `@for` control flow** | All templates (Angular 17+ syntax, no `*ngIf`/`*ngFor`) |
| **`@ViewChild`** | StylistSearch — auto-scroll chat to bottom |
| **`@Input` / `@Output`** | Card, Cart, Tabs — parent-child communication |
| **Lifecycle hooks** | `ngOnInit` (7 components), `ngAfterViewInit` (Checkout) |
| **`ChangeDetectorRef`** | Manual change detection in Checkout + AI components after async ops |
| **`HttpClient`** | Product fetching (FakeStore API), Stripe Payment Intent creation |
| **`Router` / `ActivatedRoute`** | Navigation + route/query params in most components |
| **`Location` service** | Back navigation in ProductDetail |
| **Pipes** | `UpperCasePipe` in ProductDetail |
| **`providedIn: 'root'`** | All services — singleton scope |
| **`fetch()` API** | Mistral AI calls (not HttpClient) — native browser fetch |

---

## 14. Appendix: Component Inventory

| Component | Path | Category | Key Features |
|---|---|---|---|
| `App` | `src/app/app.ts` | Root | RouterOutlet, Header, Footer, Cart drawer |
| `AppHeader` | `src/app/shared/components/header/` | Shared | Nav links, cart badge, auth state, mobile menu (signal) |
| `AppFooter` | `src/app/shared/components/footer/` | Shared | Static copyright |
| `Home` | `src/app/core/.../home/` | Product | Hero section, featured 8 products (computed) |
| `Shop` | `src/app/core/.../shop/` | Product | Category tabs, product grid, load more |
| `Card` | `src/app/core/.../card/` | Product | Reusable product card, click → detail |
| `ProductDetail` | `src/app/core/.../product-detail/` | Product | Size selection, add to cart, back nav |
| `Cart` | `src/app/core/.../cart/` | Product | Slide-out drawer, quantity +/-, checkout |
| `Tabs` | `src/app/core/.../tabs/` | Product | Category filter buttons, @Output |
| `Checkout` | `src/app/core/.../checkout/` | Product | Stripe Elements, Payment Intent, ngAfterViewInit |
| `PaymentSuccess` | `src/app/core/.../payment-success/` | Product | Verify payment, create order, clear cart |
| `StylistSearch` | `src/app/core/.../ai/stylist-search/` | AI | Chat UI, text → Mistral AI → product results |
| `VisualSearch` | `src/app/core/.../ai/visual-search/` | AI | Image upload → compress → Mistral vision → results |
| `Login` | `src/app/Components/login/` | Auth | Template-driven form, Google OAuth button |
| `Signup` | `src/app/Components/signup/` | Auth | Reactive form with password validation |
| `AuthCallback` | `src/app/Components/auth-callback/` | Auth | Google OAuth redirect handler |
| `ForgetPassword` | `src/app/Components/forget-password/` | Auth | Email input → EmailJS PIN dispatch |
| `PinForm` | `src/app/Components/pin-form/` | Auth | PIN verification |
| `ResetPassword` | `src/app/Components/reset-password/` | Auth | New password form with validation |
