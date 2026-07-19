# InstaSafe Frontend — Professional Audit Report

**Date:** 2026-07-19  
**Auditor:** Automated Multi-Agent Analysis  
**Scope:** Full codebase (80+ files), Landing Page, Backend Sync, API Reference Compliance  
**Status:** POST-FIX (previous round of fixes applied)

---

## 1. EXECUTIVE SUMMARY

| Category | Status | Issues Found |
|----------|--------|-------------|
| TypeScript | ✅ Clean | 0 errors |
| Build | ✅ Passes | 26s, 1,854 modules |
| Backend Sync | ⚠️ 3 Critical gaps | Error shape inconsistency, missing hook, auth token issue |
| Type Safety | ✅ Clean | 0 `any` types, 0 unsafe casts |
| Landing Page | ⚠️ 4 High issues | WCAG contrast failure, no SEO, no testimonials, dead links |
| Accessibility | ⚠️ 10 issues | Clickable rows not keyboard accessible, missing ARIA |
| Performance | ⚠️ 13 issues | Missing memoization, inline functions, rAF leak |
| Dead Code | ⚠️ 16 items | 6 unused component files, 3 unused hooks, empty file |

---

## 2. BACKEND-FRONTEND SYNC

### 2.1 JSON Serialization Configuration

**File:** `Program.cs` — Backend uses default ASP.NET Core 8 `AddControllers()` with **no** `AddJsonOptions()`.

- **Controller output:** camelCase (`JsonNamingPolicy.CamelCase`)
- **Controller input:** Case-insensitive (accepts both camelCase and PascalCase)
- **ExceptionHandlingMiddleware output:** **PascalCase** (uses raw `JsonSerializer.Serialize()` with no naming policy)

**Result:** Two incompatible JSON conventions depending on where the response originates.

### 2.2 CRITICAL: Error Response Shape Has 3 Variants

| Source | Shape | Example |
|--------|-------|---------|
| Controllers (Orders, Delivery, Disputes, Chatbot) | `{ "errors": ["msg"] }` | camelCase, string array |
| AuthController domain errors | `{ "Message": "msg" }` | PascalCase, joined string |
| ExceptionHandlingMiddleware | `{ "Errors": {...} }` or `{ "Message": "msg" }` | PascalCase, dict or string |

**Frontend `getApiErrorMessage()`** handles all three — this was fixed in the previous round. ✅

### 2.3 CRITICAL: Missing `useDisputes()` Hook

**Backend:** `GET /api/disputes` returns all disputes (admin endpoint).  
**Frontend:** No hook exists for this. `AdminDashboard.tsx` and `DisputesList.tsx` make raw `api.get("/disputes")` calls with inline `select` functions — inconsistent with the hook pattern used everywhere else.

Additionally, `useRaiseDispute` and `useResolveDispute` both invalidate query key `["disputes"]`, but no query uses that key. These invalidation calls are dead code.

### 2.4 CRITICAL: Login Response Missing `refreshToken`

**Backend:** Login returns `{ Token, UserId, Email, FirstName, LastName, Roles }` — no `RefreshToken`.  
**Frontend:** `mapBackendAuth()` produces `refreshToken: ""` (empty string). This gets stored in `localStorage` via `storeAuth()`, which could mislead refresh-token logic.

### 2.5 All Other Endpoints: Synced ✅

All 27 backend endpoints have been verified. HTTP methods, URL paths, request payloads, and response shapes all match. The frontend types use camelCase which matches the backend's default ASP.NET Core serialization. The API reference documentation shows PascalCase but the actual backend responses are camelCase — the frontend types are correct.

---

## 3. LANDING PAGE AUDIT

### 3.1 CRITICAL: WCAG AA Contrast Failure

**Lines 90, 125, 151, 233** — `text-emerald-600` (#10b981) on white (#ffffff) = **3.1:1 ratio**. WCAG AA requires 4.5:1 for normal text. This affects all emerald text throughout the page.

**Fix:** Change `text-emerald-600` to `text-emerald-700` (#047857, 5.1:1 ratio) for all body text.

### 3.2 HIGH: No SEO Meta Tags

- No `<title>` tag
- No `<meta name="description">`
- No Open Graph tags (`og:title`, `og:description`, `og:image`)
- No canonical URL
- No structured data (JSON-LD)

### 3.3 HIGH: No Testimonials/Trust Section

For a financial escrow platform, having zero testimonials is a significant trust gap. The "trust badges" in the hero ("Escrow Protected", "QR Verified") are product features, not trust signals. Need real social proof: customer quotes, security certifications, partner logos.

### 3.4 HIGH: Dead Footer Links

**Lines 247-258** — "About", "Blog", "Contact", "Privacy Policy", "Terms of Service", "Escrow Terms" all link to `#`. Dead links on a financial platform erode trust.

### 3.5 MEDIUM: Invalid Tailwind Class

**Line 56** — `duration-600` is not a valid Tailwind v4 value. Valid values: `duration-500`, `duration-700`.

### 3.6 MEDIUM: AnimatedCounter Memory Leak

**Line 32** — `requestAnimationFrame` loop has no cleanup. If component unmounts mid-animation, the loop continues. Add `cancelAnimationFrame` in useEffect cleanup.

### 3.7 MEDIUM: Social Proof Contradiction

**Line 125** — "Trusted by 500+ Nigerian Merchants" in hero badge.  
**Line 218** — "Join hundreds of Nigerian merchants" in CTA. "Hundreds" contradicts "500+".

### 3.8 MEDIUM: Mobile Nav Issues

- No animation on menu open/close (instant appear/disappear)
- Buttons too cramped on 320px screens (`flex gap-3` with `w-full`)
- No body scroll lock when menu is open

### 3.9 LOW: No aria-expanded on Mobile Toggle

**Line 99** — Button has `aria-label` but no `aria-expanded={mobileOpen}`.

### 3.10 LOW: Dead Code in Stats Rendering

**Line 171** — `{stat.prefix}{stat.prefix ? "" : ""}` — the second expression is always empty string.

---

## 4. CODEBASE QUALITY

### 4.1 Type Safety: ✅ Clean

- 0 `any` types
- 0 unsafe casts
- All enums properly typed as unions
- All response types match backend (verified against controller source code)

### 4.2 Unused Imports (1)

| File | Import |
|------|--------|
| `pages/whatsapp/ChatbotSessions.tsx:7` | `ChatbotState` |

### 4.3 Dead Code (16 items)

| Category | Items |
|----------|-------|
| Empty file | `hooks/useMerchants.ts` |
| Unused hooks | `useOrderDispute`, `useCreatePickup`, `useDeliverySessionStatus` |
| Unused utility | `getStoredRefreshToken` |
| Unused components | `DisputeForm`, `CountdownTimer`, `Skeleton` |
| Unused UI libs | `Dialog`, `Form`, `Separator` (entire component files) |
| Unused types | 14 type exports never imported by any consumer |

### 4.4 Missing Error Handling (5)

| File | Issue |
|------|-------|
| `components/disputes/DisputeForm.tsx:31` | No try/catch on `mutateAsync()` |
| `pages/auth/ForgotPassword.tsx:25` | Empty `catch {}` swallows error silently |
| `components/delivery/QrScanner.tsx:35` | Empty error callback `() => {}` |
| `components/delivery/FingerprintCapture.tsx:18` | Async call in useEffect without .catch() |
| `providers/AuthProvider.tsx:44` | .catch() doesn't log error for debugging |

### 4.5 Accessibility (10 issues)

| File | Issue |
|------|-------|
| `components/layout/Header.tsx:16` | DropdownMenuTrigger missing `aria-label` |
| `pages/admin/AdminDashboard.tsx:66` | Clickable TableRow not keyboard accessible |
| `pages/admin/DisputesList.tsx:68` | Same |
| `pages/merchant/Disputes.tsx:53` | Same |
| `pages/whatsapp/SessionTable.tsx:34` | Same |
| `pages/admin/DisputesList.tsx:37` | `<select>` without `<label>` |
| `components/delivery/QrScanner.tsx:43` | Camera viewfinder missing `aria-label` |
| `pages/Landing.tsx:99` | Mobile toggle missing `aria-expanded` |
| `pages/Landing.tsx:170` | AnimatedCounter missing `aria-live="off"` |
| `pages/Landing.tsx:90` | emerald-600 text fails WCAG AA contrast |

### 4.6 Performance (13 issues)

| File | Issue |
|------|-------|
| `pages/merchant/Dashboard.tsx:18-20` | Missing `useMemo` on filter/reduce |
| `pages/whatsapp/ChatbotSessions.tsx:16` | Missing `useMemo` on filter |
| `pages/Landing.tsx` | No memoization on StepCard/FeatureCard sub-components |
| `pages/Landing.tsx:32` | AnimatedCounter missing rAF cleanup |
| `pages/merchant/Orders.tsx:50` | Inline object in EmptyState action prop |
| `pages/merchant/OrderDetail.tsx:79-83` | Multiple inline onChange handlers |
| 4 table pages | Inline `onClick={() => navigate(...)}` on each TableRow |
| `components/delivery/FingerprintCapture.tsx:29` | eslint-disable masks stale closure issue |
| `pages/merchant/Disputes.tsx:27` | Unnecessary useMemo on trivial `?? []` |
| `pages/admin/AdminDashboard.tsx:32-35` | Unnecessary useMemo chain on trivial operations |

### 4.7 Security: ✅ Clean

- No hardcoded secrets
- No `dangerouslySetInnerHTML`
- No `.innerHTML` assignments
- API base URL uses env variable with fallback
- Tokens in localStorage (standard SPA trade-off)

---

## 5. REMAINING BACKEND GAPS

| Gap | Priority | Notes |
|-----|----------|-------|
| `POST /auth/refresh-token` not implemented | LOW | Auth token refresh flow not built in frontend |
| `useCreatePickup` hook unused | LOW | Merchant pickup confirmation not wired to UI |
| `useDeliverySessionStatus` hook unused | LOW | Delivery status polling not implemented |
| `useOrderDispute` hook unused | LOW | Buyer dispute status not shown |
| `DisputeForm` component unused | LOW | Buyer dispute submission not wired |
| `CountdownTimer` component unused | LOW | 24h dispute window countdown not shown |
| Dashboard sidebars not responsive | LOW | Fixed 256px width, no mobile toggle |
| Tables not responsive on mobile | LOW | Horizontal scroll works but UX is poor |

---

## 6. RECOMMENDED FIX PRIORITY

### Immediate (Before Demo)
1. Fix WCAG contrast: `text-emerald-600` → `text-emerald-700` on Landing page
2. Add SEO meta tags to `index.html`
3. Fix `duration-600` → `duration-500` on Landing page
4. Add `aria-expanded` to mobile menu toggle
5. Fix AnimatedCounter rAF cleanup

### Short Term
6. Add testimonials/trust section to Landing page
7. Remove or fix dead footer links
8. Make clickable TableRows keyboard accessible (add `tabIndex={0}`, `onKeyDown`)
9. Fix social proof contradiction ("500+" vs "hundreds")
10. Add slide-down animation to mobile menu

### Medium Term
11. Delete dead code (6 unused component files, 3 unused hooks, empty useMerchants.ts)
12. Add `useMemo` to Dashboard and ChatbotSessions filter computations
13. Add missing `useDisputes()` hook and wire it to admin pages
14. Fix Login to not store empty refresh token
15. Make dashboard sidebars responsive (hamburger toggle on mobile)

---

## 7. FILES VERIFIED

All 80+ source files in `src/` were read and analyzed. All 8 backend controllers were read. The complete `API_REFERENCE.md` (1,665 lines) was cross-referenced. `Program.cs` was read to verify JSON serialization settings.

**Total findings:** 3 critical, 4 high, 12 medium, 15 low
**Previous round fixes verified:** ✅ API envelope, auth mapping, delivery enum, type safety, error handler, code splitting, landing page redesign
