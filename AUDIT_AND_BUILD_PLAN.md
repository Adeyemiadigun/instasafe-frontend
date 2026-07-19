# InstaSafe Frontend — Audit Issues & Build Plan

**Date:** 2026-07-19  
**Status:** Pre-fix  
**Codebase:** 80 files, 3,929 lines  
**Backend Reference:** `Insta-Safe----Backend/API_REFERENCE.md`

---

## PART 1: COMPLETE ISSUE LIST

---

### 🔴 CRITICAL — Must Fix (App is non-functional without these)

#### C1. API Envelope Mismatch — Every API Call Broken

The backend controllers unwrap `Result<T>` and return raw data:
```csharp
return result.Succeeded ? Ok(result.Data) : BadRequest(new { errors = result.Errors });
```

The frontend assumes an envelope `{ succeeded, data, errors }`:
```typescript
select: (res: { data: ApiResult<T> }) => res.data.data  // res.data.data → undefined
```

**Every hook is affected:**
- `hooks/useOrders.ts` — all 5 hooks
- `hooks/useDisputes.ts` — all 5 hooks
- `hooks/useChatbot.ts` — both hooks
- `hooks/useDelivery.ts` — all 4 hooks
- `providers/AuthProvider.tsx` — login, register, /auth/me
- `pages/buyer/Payment.tsx` — manual API call
- `pages/admin/AdminDashboard.tsx` — direct useQuery
- `pages/admin/DisputesList.tsx` — direct useQuery
- `pages/auth/VerifyEmail.tsx` — direct API call
- `pages/auth/ForgotPassword.tsx` — direct API call
- `pages/auth/ResetPassword.tsx` — direct API call

**Fix:** Remove `ApiResult<T>` wrapper usage. Access `res.data` directly for success, use try/catch + HTTP status for errors.

#### C2. Auth Login Response Shape Mismatch

**Frontend** (`AuthProvider.tsx:49`): `setUser(data.data)` — expects envelope `.data`  
**Backend**: Returns `{ token, userId, email, ... }` directly  
**Result:** `data.data` → `undefined`, user never logged in

#### C3. Auth Register Response Shape Mismatch

**Frontend** (`AuthProvider.tsx:57`): `return data.data.message`  
**Backend**: Returns `{ message: "..." }` directly  
**Result:** Success message lost, `undefined` returned

#### C4. Auth /me Response — Refresh Broken

**Frontend** (`AuthProvider.tsx:29-32`): Checks `data.succeeded && data.data`  
**Backend**: Returns `{ token, userId, ... }` directly  
**Result:** `data.succeeded` → `undefined`, auth state never refreshes, user logged out on every page reload

#### C5. Error Response Shape Inconsistency

- `AuthController` returns `{ "message": "error text" }` (singular)
- All other controllers return `{ "errors": ["error text"] }` (array)
- Frontend reads `data.errors?.[0]` everywhere → fails for auth errors

---

### 🟡 HIGH — Should Fix (Significant UX/quality impact)

#### H1. Landing Page Lacks Design Effort (Score: 2/10)

- No hero image or illustration
- No gradient hero section
- No social proof / testimonials / trust badges
- No statistics section ("₦X secured", "X orders")
- No animations or micro-interactions
- No responsive mobile navigation (hamburger menu)
- No CTA footer section
- Footer is a single line of text
- Feature cards are plain icon + text

#### H2. No Mobile Navigation

`Landing.tsx` header has `<div className="flex gap-3">` — on mobile these buttons overflow. No hamburger menu. The dashboard sidebars also have no mobile collapse/toggle.

#### H3. No Loading Skeletons

Every loading state uses `<LoadingSpinner>` (centered spinner). Causes layout shift when data loads. `ui/skeleton.tsx` exists but is never imported anywhere.

#### H4. Inconsistent Error Handling

Three different patterns across the codebase:
- `Login.tsx`: try/catch with `toast.error(err.message)`
- `Payment.tsx`: try/catch with manual `setResult()` state
- `AdminDashboard.tsx`: React Query `select` (no error handling)
- `DisputeDetail.tsx`: Checks `result.succeeded` (broken by C1)

#### H5. Bundle Size — 1,044 KB (Warning at 500 KB)

Main contributors:
- `recharts` — ~200 KB (**UNUSED**, should be removed)
- `html5-qrcode` — ~200 KB
- `react` + `react-dom` — ~140 KB
- `@radix-ui/*` — ~100 KB combined

#### H6. No Code Splitting

All routes eagerly imported in `App.tsx`. No `React.lazy()`. Every page loads the entire app bundle.

---

### 🟢 MEDIUM — Nice to Fix (Polish/cleanup)

#### M1. `any` Type Usage

- `Login.tsx:34` — `catch (err: any)` → should be `unknown`
- `Register.tsx:43` — `catch (err: any)` → should be `unknown`
- `OrderDetail.tsx:26-27` — `useState<any>(null)` → should be typed

#### M2. Dead Code

- `hooks/useMerchants.ts` — `export {}` (empty file)
- `components/shared/CountdownTimer.tsx` — Fully implemented, never imported
- `components/ui/skeleton.tsx` — Exists, never used

#### M3. `CreateOrder.tsx` Uses Raw `<textarea>`

Line 65: Inline Tailwind on `<textarea>` instead of a `Textarea` component. Inconsistent with shadcn/ui usage elsewhere.

#### M4. Missing `htmlFor`/`id` on Payment Form

`Payment.tsx:51-55` — `<Label>` and `<Input>` are siblings but not programmatically associated.

#### M5. No `useMemo`/`useCallback` Where Needed

- `MerchantDashboard.tsx:21-23` — `orders.filter(...)` on every render
- `DisputesList.tsx:37` — `all.filter(...)` on every render
- `AdminDashboard.tsx:35-37` — Three `filter()` calls on every render

#### M6. React Query Stale Time Too Low

Default stale time is 0 (refetch on every window focus). Dashboard data should use `staleTime: 30_000`.

#### M7. No `<Suspense>` Integration

Loading states are managed per-component but no React Suspense boundaries exist.

---

### 🔵 LOW — Optional (Minor polish)

#### L1. Accessibility

- No `aria-label` on icon-only buttons (Header avatar, sidebar logout)
- No focus rings on clickable table rows
- No skip-to-content link in dashboard layouts
- Color contrast: emerald-600 on white is ~4.6:1 (passes AA, fails AAA)

#### L2. No Image Optimization

`Checkout.tsx:29` — `<img src={order.itemImageUrl}>` with no lazy loading, no width/height, no fallback.

#### L3. JWT in localStorage

`auth.ts` stores tokens in `localStorage`. XSS-vulnerable. Production should use `httpOnly` cookies.

#### L4. No Client-Side Rate Limiting

Login, register, forgot-password have no rate limiting or CAPTCHA.

---

## PART 2: BUILD PLAN

---

### Phase 1: Fix API Contract (CRITICAL — Do First)

**Goal:** Make every API call functional.

#### Step 1.1: Update `types/api.ts`

Remove the `ApiResult<T>` interface (it describes an envelope the backend doesn't send). Replace with a simpler type:

```typescript
// Keep for backward compatibility but mark as deprecated
export interface ApiResult<T> {
  succeeded: boolean;
  data: T | null;
  errors: string[];
}

// Add actual backend response types
export interface ApiError {
  message?: string;
  errors?: string[];
}
```

#### Step 1.2: Update `lib/api.ts`

Add response interceptor that handles both response shapes:

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      clearAuth();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);
```

#### Step 1.3: Update `hooks/useOrders.ts`

Change all `select` functions to unwrap the actual response:

```typescript
// Before:
select: (res: { data: ApiResult<PaginatedList<MerchantOrderResponse>> }) => res.data.data,

// After:
select: (res: { data: PaginatedList<MerchantOrderResponse> }) => res.data,
```

Update `useCreateOrder` and `useGenerateEscrowLink` to handle response directly:

```typescript
// Before:
const result = res.data
if (result.succeeded && result.data) { ... }

// After:
// res.data IS the data directly
toast.success("Order created!")
navigate(`/dashboard/orders/${res.data.orderId}`)
```

#### Step 1.4: Update `hooks/useDisputes.ts`

Same pattern — remove `ApiResult` unwrapping:

```typescript
select: (res: { data: Dispute }) => res.data,
```

#### Step 1.5: Update `hooks/useChatbot.ts`

Same pattern.

#### Step 1.6: Update `hooks/useDelivery.ts`

Same pattern.

#### Step 1.7: Update `providers/AuthProvider.tsx`

Fix login:
```typescript
// Before:
const data = res.data
if (!data.succeeded) throw new Error(data.errors?.[0] || "Login failed")
setUser(data.data)
storeAuth(data.data.token, data.data.refreshToken, data.data)

// After:
const data = res.data  // data IS { token, userId, email, ... }
setUser(data)
storeAuth(data.token, data.refreshToken, data)
```

Fix register:
```typescript
// Before:
return data.data.message

// After:
return data.message
```

Fix /auth/me:
```typescript
// Before:
if (data.succeeded && data.data) {
  setUser(data.data)
  storeAuth(data.data.token, data.data.refreshToken, data.data)
}

// After:
// data IS { token, userId, email, ... }
setUser(data)
storeAuth(data.token, data.refreshToken, data)
```

#### Step 1.8: Update `pages/buyer/Payment.tsx`

```typescript
// Before:
if (data.succeeded) {
  setResult(data.data?.otpMessage || "Payment initiated.")
} else {
  setResult(data.errors?.[0] || "Payment failed.")
}

// After (backend returns { transactionReference, otpMessage } on success, 400 on error):
setResult(data.otpMessage || "Payment initiated.")
```

#### Step 1.9: Update `pages/admin/AdminDashboard.tsx`

```typescript
// Before:
select: (res: { data: ApiResult<Dispute[]> }) => res.data.data ?? [],

// After:
select: (res: { data: Dispute[] }) => res.data ?? [],
```

#### Step 1.10: Update `pages/admin/DisputesList.tsx`

Same pattern.

#### Step 1.11: Update `pages/admin/DisputeDetail.tsx`

```typescript
// Before:
const result = res.data
if (result.succeeded) {
  toast.success(result.data?.message || "Dispute resolved!")
} else {
  toast.error(result.errors?.[0] || "Failed to resolve dispute.")
}

// After (backend returns { outcome, message } on success, 400 on error):
toast.success(res.data?.message || "Dispute resolved!")
```

#### Step 1.12: Update `pages/auth/VerifyEmail.tsx`

```typescript
// Before:
if (data.succeeded) {
  setStatus("success")
  setMessage(data.data?.message || "Email verified!")
} else {
  setStatus("error")
  setMessage(data.errors?.[0] || "Verification failed.")
}

// After (200 = success with { message }, 400 = error with { message }):
setStatus("success")
setMessage(data.message || "Email verified!")
```

#### Step 1.13: Update `pages/auth/ForgotPassword.tsx`

```typescript
// Before:
await api.post("/auth/forgot-password", { email: data.email })

// After: Backend always returns 200. Just set sent=true.
// No change needed — the try/catch already handles this correctly.
```

#### Step 1.14: Update `pages/auth/ResetPassword.tsx`

```typescript
// Before:
if (result.succeeded) {
  toast.success("Password reset successfully!")
  navigate("/auth/login")
} else {
  toast.error(result.errors?.[0] || "Reset failed.")
}

// After (200 = success, 400 = error):
toast.success("Password reset successfully!")
navigate("/auth/login")
```

#### Step 1.15: Update `merchant/Disputes.tsx`

```typescript
// Before:
select: (res: { data: ApiResult<PaginatedList<MerchantOrderResponse>> }) => res.data.data?.items ?? [],

// After:
select: (res: { data: PaginatedList<MerchantOrderResponse> }) => res.data?.items ?? [],
```

#### Step 1.16: Update `merchant/Dashboard.tsx`

No change needed — it uses `useMerchantOrders` which is fixed in Step 1.3.

#### Step 1.17: Update `merchant/OrderDetail.tsx`

```typescript
// Before:
const data = res.data
if (data.succeeded) setEscrowResult(data.data)

// After:
setEscrowResult(res.data)
```

Same for QR codes:
```typescript
if (data.succeeded) setQrResult(data.data)
// →
setQrResult(res.data)
```

#### Step 1.18: Update `buyer/ScanDelivery.tsx`

```typescript
// Before:
if (data.succeeded && data.data) {
  setResult({ status: "success", message: data.data.message || "Delivery confirmed!" })
} else {
  const msg = data.errors?.[0] || "Delivery confirmation failed."
  setResult({ status: "error", message: msg })
}

// After (200 = success with { status, message }, 400 = error):
setResult({ status: "success", message: res.data.message || "Delivery confirmed!" })
```

#### Step 1.19: Update `types/merchant.ts`

```typescript
// Before:
status: string;

// After:
status: OrderStatus;
```

(Already done in previous session.)

#### Step 1.20: Verify

```bash
npx tsc --noEmit
npx vite build
```

---

### Phase 2: Rebuild Landing Page (HIGH — Hackathon Impact)

**Goal:** Create a visually impressive, conversion-optimized landing page.

#### Step 2.1: Redesign Hero Section

- Gradient background (emerald → teal)
- Large headline with gradient text effect
- Subheadline with value prop
- CTA button with hover animation
- Hero illustration or abstract shape (CSS-only or SVG)

#### Step 2.2: Add Social Proof Section

- "Trusted by X merchants" counter
- Testimonial cards (3 cards with avatar, name, quote)
- Trust badges (escrow protected, secure payments, etc.)

#### Step 2.3: Add Stats Section

- Animated counters: "₦X+ Secured", "X+ Orders", "X+ Merchants"
- Full-width section with gradient background

#### Step 2.4: Enhance How It Works

- Visual flow diagram (numbered steps with connecting lines)
- Screenshot/mockup in each step
- Hover animations on step cards

#### Step 2.5: Add Feature Deep-Dive

- Alternating left/right layout (text + image)
- 3 features with illustrations
- Icon animations on hover

#### Step 2.6: Add CTA Footer Section

- "Ready to sell securely?" headline
- CTA button
- Link to register

#### Step 2.7: Add Mobile Navigation

- Hamburger menu component
- Slide-in drawer on mobile
- Smooth open/close animation

#### Step 2.8: Add Scroll Animations

- IntersectionObserver-based fade-in animations
- Staggered reveal for grid items
- Counter animation for stats

---

### Phase 3: Code Quality & Polish (MEDIUM)

**Goal:** Professional code quality.

#### Step 3.1: Remove `recharts` from `package.json`

Saves ~200 KB from bundle.

#### Step 3.2: Remove Dead Code

- Delete `hooks/useMerchants.ts` (empty)
- Keep `CountdownTimer.tsx` but integrate into `OrderDetail.tsx` (24h dispute window)
- Keep `skeleton.tsx` and replace spinners with skeletons on dashboard pages

#### Step 3.3: Fix `any` Types

Replace `catch (err: any)` with `catch (err: unknown)` and type-narrow.

#### Step 3.4: Standardize Error Handling

Create a shared error handler utility:

```typescript
// lib/errorHandler.ts
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.message) return data.message;
    if (data?.errors?.[0]) return data.errors[0];
  }
  return "An unexpected error occurred.";
}
```

Use in all pages.

#### Step 3.5: Add Code Splitting

```typescript
// App.tsx
const MerchantDashboard = React.lazy(() => import("@/pages/merchant/Dashboard"))
const Orders = React.lazy(() => import("@/pages/merchant/Orders"))
// ... etc
```

Wrap in `<Suspense fallback={<LoadingSpinner />}>`.

#### Step 3.6: Add Loading Skeletons

Replace `<LoadingSpinner>` in dashboard pages with `<Skeleton>` grids that match the layout.

#### Step 3.7: Add `useMemo` for Derived Data

Memoize filtered/sorted arrays in Dashboard, DisputesList, AdminDashboard.

#### Step 3.8: Increase React Query Stale Time

```typescript
// providers/QueryProvider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds
    },
  },
})
```

#### Step 3.9: Fix `CreateOrder.tsx` Textarea

Replace raw `<textarea>` with a proper `Textarea` component (create `ui/textarea.tsx` or use inline).

#### Step 3.10: Fix Payment Form Labels

Add `htmlFor`/`id` to all label-input pairs in `Payment.tsx`.

#### Step 3.11: Verify

```bash
npx tsc --noEmit
npx vite build
```

---

### Phase 4: Final Verification

#### Step 4.1: Full TypeScript Check
```bash
npx tsc --noEmit
```

#### Step 4.2: Production Build
```bash
npx vite build
```

#### Step 4.3: Bundle Analysis

Check bundle size is under 500 KB (or at least reduced from 1,044 KB).

#### Step 4.4: Manual Smoke Test

Verify each route loads without errors:
- `/` — Landing page
- `/auth/login` — Login form
- `/auth/register` — Register form
- `/dashboard` — Merchant dashboard with real data
- `/dashboard/orders` — Orders list with pagination
- `/dashboard/orders/new` — Create order form
- `/dashboard/orders/:id` — Order detail with tabs
- `/dashboard/disputes` — Merchant disputes
- `/dashboard/settings` — Settings
- `/order/:orderId` — Buyer checkout
- `/order/:orderId/pay` — Payment form
- `/order/:orderId/scan` — QR scanner
- `/order/:orderId/track` — Order tracking
- `/admin` — Admin dashboard
- `/admin/disputes` — Admin disputes list
- `/admin/disputes/:id` — Dispute detail with resolution
- `/whatsapp/sessions` — Chatbot sessions
- `/whatsapp/sessions/:id` — Session detail

---

## PART 3: FILE MANIFEST

### Files to Modify

| File | Phase | Changes |
|---|---|---|
| `types/api.ts` | 1 | Keep `ApiResult` for reference, add error types |
| `lib/api.ts` | 1 | Verify interceptor (already has 403) |
| `hooks/useOrders.ts` | 1 | Remove `ApiResult` unwrapping from all 5 hooks |
| `hooks/useDisputes.ts` | 1 | Remove `ApiResult` unwrapping from all 5 hooks |
| `hooks/useChatbot.ts` | 1 | Remove `ApiResult` unwrapping from both hooks |
| `hooks/useDelivery.ts` | 1 | Remove `ApiResult` unwrapping from all 4 hooks |
| `providers/AuthProvider.tsx` | 1 | Fix login, register, /auth/me response parsing |
| `pages/buyer/Payment.tsx` | 1 | Fix response handling |
| `pages/admin/AdminDashboard.tsx` | 1 | Fix `select` function |
| `pages/admin/DisputesList.tsx` | 1 | Fix `select` function |
| `pages/admin/DisputeDetail.tsx` | 1 | Fix response handling |
| `pages/auth/VerifyEmail.tsx` | 1 | Fix response handling |
| `pages/auth/ResetPassword.tsx` | 1 | Fix response handling |
| `pages/merchant/Disputes.tsx` | 1 | Fix `select` function |
| `pages/merchant/OrderDetail.tsx` | 1 | Fix escrow/QR response handling |
| `pages/buyer/ScanDelivery.tsx` | 1 | Fix delivery confirm response |
| `pages/Landing.tsx` | 2 | Complete redesign |
| `components/layout/BuyerLayout.tsx` | 2 | Add mobile nav (optional) |
| `package.json` | 3 | Remove recharts |
| `hooks/useMerchants.ts` | 3 | Delete or implement |
| `pages/merchant/Dashboard.tsx` | 3 | Add useMemo, skeleton loading |
| `pages/admin/AdminDashboard.tsx` | 3 | Add useMemo, skeleton loading |
| `pages/admin/DisputesList.tsx` | 3 | Add useMemo, skeleton loading |
| `providers/QueryProvider.tsx` | 3 | Increase staleTime |

### Files to Create

| File | Phase | Purpose |
|---|---|---|
| `lib/errorHandler.ts` | 3 | Shared API error extraction utility |
| `components/ui/textarea.tsx` | 3 | shadcn Textarea component (optional) |

### Files to Delete

| File | Phase | Reason |
|---|---|---|
| `hooks/useMerchants.ts` | 3 | Empty file, no implementations |

---

## ESTIMATED TIMELINE

| Phase | Effort | Priority |
|---|---|---|
| Phase 1: Fix API Contract | 2-3 hours | 🔴 CRITICAL |
| Phase 2: Rebuild Landing Page | 3-4 hours | 🟡 HIGH |
| Phase 3: Code Quality | 2-3 hours | 🟢 MEDIUM |
| Phase 4: Verification | 30 min | ✅ FINAL |
| **Total** | **8-11 hours** | |
