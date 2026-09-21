# Practical 8 — Performance Optimization and Lazy Loading

## Student Details

- **Student Name:** Priyanshi Gajiwala
- **Enrollment No.:** 24IT019
- **Course:** Advanced Web Development Frameworks
- **Course Code:** ITUE301
- **Practical:** 8 — Performance Optimization and Lazy Loading in React

---

## Objective

The objective of Practical 8 is to optimize frontend performance in the React single-page application (SPA) by implementing route-based code splitting and on-demand resource delivery using `React.lazy()` and `React.Suspense`. This avoids loading all application views into a single monolithic bundle on initial page load, reducing initial JavaScript execution time, First Contentful Paint (FCP), and Time to Interactive (TTI).

---

## Implementation

### Architectural Concepts

1. **`React.lazy()`**: A built-in React function that lets you render a dynamic import as a regular component. It defers loading the component's code until it is rendered for the first time.
2. **Dynamic `import()`**: An ES standard function-like expression that loads JavaScript modules asynchronously and returns a Promise resolving to the module namespace. Vite/Rollup analyzes dynamic `import()` calls to split code into separate chunks.
3. **`Suspense`**: A React wrapper component that specifies a fallback UI (such as a spinner or skeleton screen) while child components inside the subtree are waiting for asynchronous resources (such as lazy-loaded JavaScript chunks) to download and resolve.
4. **Route-Level Code Splitting**: Applying lazy loading at the route configuration level (`react-router-dom`), ensuring that users only fetch JavaScript code corresponding to the specific route they visit.
5. **Debounced Fallback UI**: A specialized `PageLoader` fallback that incorporates a ~300ms debounce delay. This prevents jarring spinner flashes on fast networks or when rendering cached chunks, while presenting a polite, accessible loading state (`role="status"`, `aria-live="polite"`) during slower network transfers.

### Router Implementation Example

In `frontend/src/router/index.tsx`:

```tsx
import { lazy, Suspense, useState, useEffect, type ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Route-level dynamic imports with React.lazy
const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Projects = lazy(() => import('@/pages/Projects'))
const ProjectDetails = lazy(() => import('@/pages/ProjectDetails'))
const Experience = lazy(() => import('@/pages/Experience'))
const Research = lazy(() => import('@/pages/Research'))
const Achievements = lazy(() => import('@/pages/Achievements'))
const Resume = lazy(() => import('@/pages/Resume'))
const Blog = lazy(() => import('@/pages/Blog'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Tasks = lazy(() => import('@/pages/Tasks'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))

// Suspense Fallback with 300ms minimum delay to avoid layout flash
function PageLoader() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  if (!show) {
    return null
  }

  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-text-secondary">Loading page...</p>
      </div>
    </div>
  )
}

function withSuspense(Component: ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}
```

---

## Before vs After Build

### Measurement Comparison

| Metric | Before Optimization | After Optimization | Difference / Improvement |
|---|---|---|---|
| **Main JS Bundle (raw)** | `339.16 kB` | `253.69 kB` | **-85.47 kB (-25.2%)** |
| **Main JS Bundle (gzip)** | `100.61 kB` | `80.29 kB` | **-20.32 kB (-20.2%)** |
| **Shared Vendor Chunk** | `vendor-CpHK6yJH.js` (`103.48 kB` / gzip `34.80 kB`) | `vendor-C9NNLiCi.js` (`103.48 kB` / gzip `34.80 kB`) | Isolated shared dependencies |
| **Shared Motion Chunk** | `motion-ImYWn22l.js` (`129.51 kB` / gzip `42.72 kB`) | `motion-DK6ag9qi.js` (`129.51 kB` / gzip `42.72 kB`) | Isolated animation library |
| **Route Component Chunks**| *None (monolithic main bundle)* | *14 discrete route chunks* | Isolated on-demand route loading |

### Route Chunks Generated After Optimization

The build process emits separate JavaScript chunks for each page component:

- **`Projects`**: `8.15 kB` │ gzip: `2.89 kB`
- **`Contact`**: `6.56 kB` │ gzip: `2.14 kB`
- **`Tasks`**: `9.92 kB` │ gzip: `2.66 kB`
- **`Home`**: `11.06 kB` │ gzip: `3.64 kB`
- **`ProjectDetails`**: `5.52 kB` │ gzip: `1.60 kB`
- **`About`**: `3.90 kB` │ gzip: `1.49 kB`
- **`Login`**: `2.67 kB` │ gzip: `1.22 kB`
- **`Register`**: `2.72 kB` │ gzip: `1.18 kB`

### Architectural Impact

Before optimization, all route component logic, event handlers, and page-specific markup were compiled directly into the initial `index` bundle. A visitor landing only on `/login` or `/` was forced to download, parse, and compile the code for `/tasks`, `/projects`, `/contact`, `/resume`, `/blog`, etc.

After optimization, the initial load footprint dropped significantly. Route-specific chunks are downloaded asynchronously over HTTP only when their corresponding routes are activated by user navigation.

---

## Browser Network Testing

### Verification Procedure

1. Open Google Chrome and launch Developer Tools (`F12` or `Ctrl + Shift + I`).
2. Navigate to the **Network** tab.
3. Check **Disable cache** to simulate cold visits.
4. Set network throttling to **Fast 3G** or **Slow 3G** to observe network request sequencing.
5. In the filter bar, select **JS** to isolate JavaScript file transfers.
6. Observe initial page load (`/`):
   - Notice that only `index.html`, the main CSS, `index.js`, `vendor.js`, `motion.js`, and the immediate landing chunk (`Home.js`) are requested.
7. Click the **Projects** link in navigation (`/projects`):
   - A new HTTP GET request is triggered for `Projects-[hash].js` (`8.15 kB`).
8. Click the **Contact** link in navigation (`/contact`):
   - A new HTTP GET request is triggered for `Contact-[hash].js` (`6.56 kB`).
9. Navigate to the **Tasks** route (`/tasks`):
   - A new HTTP GET request is triggered for `Tasks-[hash].js` (`9.92 kB`).

### Observations

Route-specific JavaScript is requested on demand when the corresponding route is visited, rather than ahead of time during the initial page load.

---

## Performance Explanation

### 1. What is the difference between the initial bundle and a lazy-loaded chunk?
The **initial bundle** (entry chunk) contains the foundational runtime and critical code necessary to bootstrap the application: the React engine, client router, global layout (headers, footers, theme providers), and common utility functions. It must be downloaded, parsed, and executed before the first screen renders.

A **lazy-loaded chunk** is a modular slice of JavaScript that is decoupled from the entry bundle. It is produced by Rollup/Vite when an `import()` expression is encountered. The browser only requests it via an asynchronous network request when the component tree actually attempts to mount the component wrapped by `React.lazy()`.

### 2. Why does lazy loading improve perceived performance?
Perceived performance depends heavily on metrics such as **First Contentful Paint (FCP)**, **Largest Contentful Paint (LCP)**, and **Total Blocking Time (TBT)**. By stripping non-critical page code from the initial bundle:
- The initial payload size over the network is smaller, resulting in faster download times (especially on cellular/mobile connections).
- The JavaScript engine parses and compiles fewer bytes during initialization, reducing main thread blocking time.
- Users see and can interact with the initial landing screen much faster. Slower secondary pages load seamlessly in the background with polite fallback indicators.

### 3. When might lazy loading not be worth the complexity?
Lazy loading introduces minor operational overhead:
- **Network Latency on Navigation**: When a user clicks a lazy-loaded route, they may experience a slight delay or spinner while the chunk transfers over the network.
- **Micro-Components**: For trivial components (< 1–2 kB), the HTTP request overhead and code-splitting runtime wrapper may exceed the bytes saved.
- **Offline / Flaky Network Failures**: If a user loses internet connectivity after loading the initial shell, navigating to an un-cached lazy route will cause a dynamic import failure unless appropriate error boundaries and retry logic are implemented.

### 4. What is the difference between development-mode Vite modules and production build chunks?
- **Development Mode**: Vite leverages native browser ES Modules (ESM). It does not bundle files ahead of time; instead, each `.tsx`/`.ts` file is served as an individual HTTP module on-demand using Vite's esbuild transform pipeline. Hot Module Replacement (HMR) replaces only modified modules.
- **Production Build**: Vite invokes **Rollup** to perform static analysis, tree-shaking, dead code elimination, minification, and bundling. Rollup combines modules into optimized distribution chunks (such as `vendor`, `motion`, `index`, and route chunks with content hashes for HTTP caching).

---

## Authentication UI Error Handling Improvement

During functional testing, it was noted that a failed login attempt (`POST /api/v1/auth/login` returning HTTP 401 with `{ success: false, message: "Invalid email or password" }`) triggered a generic `"Session expired. Please login again."` notification due to centralized 401 interception in `handleResponse`.

### Resolution:
`frontend/src/lib/api.ts` was updated with contextual error handling:
- **Authentication Endpoints** (`/auth/login`, `/auth/register`): Set `isAuthEndpoint: true`. A 401 response forwards the server error message (`"Invalid email or password"`) directly to the login form, without clearing existing session tokens or triggering redirection.
- **Protected Endpoints** (`/tasks`, `/auth/me`): Retain standard session expiration handling: token invalidation via `removeToken()`, redirection to `/login?expired=true`, and displaying `"Session expired. Please login again."`.

---

## Learning Outcome

By completing Practical 8, the student has demonstrated:
1. Practical proficiency with React code-splitting patterns using `React.lazy()` and `React.Suspense`.
2. Mastery of client-side routing optimization in `react-router-dom` with fallback loading states.
3. Understanding of Rollup chunking configurations in `vite.config.ts` (`manualChunks` for vendor isolation).
4. Browser developer tooling skills utilizing the Chrome DevTools Network panel, network throttling, and cache control.
5. Ability to analyze and document bundle size metrics and performance trade-offs.

---

## Testing Evidence

- [x] `npm run build` successful with 0 TypeScript or bundling errors
- [x] Projects page lazy-loaded via dynamic import
- [x] Contact page lazy-loaded via dynamic import
- [x] Suspense fallback implemented with 300ms anti-flicker delay
- [x] Separate route chunks generated for all pages
- [x] Before/after bundle measurements recorded and verified
- [x] Network testing performed with JS request analysis
- [x] Existing JWT authentication pipeline preserved
- [x] Existing Task Manager CRUD functionality preserved
