# Priyanshi Gajiwala — Portfolio

A premium multi-page portfolio website built with React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, and React Router.

This codebase has been enhanced to satisfy the university requirements for **Practical 3: GitHub REST API Integration & Dynamic State Management in React**.

---

## Practical 3 Features (GitHub REST API Integration)

The portfolio implements the following core requirements specified in the University Practical 3 lab manual:

1. **GitHub REST API Integration**
   - Dynamically fetches repositories from the official GitHub REST API: `https://api.github.com/users/PriyanshiG-HUB/repos`.
   - Utilizes `async/await` for modern asynchronous HTTP network communication.

2. **React Hooks & State Management (`useState`)**
   - Manages asynchronous API states using React `useState`:
     - `repos`: Stores fetched repository objects array.
     - `loading`: Boolean state controlling the loading lifecycle.
     - `error`: Stores string error messages or null.
     - `searchQuery`: Manages real-time search input string for filtering.

3. **Mounting Side-Effect (`useEffect`)**
   - Triggers the API request **ONLY once** when the `Projects` component mounts.
   - Strictly enforces an empty dependency array `[]` to prevent redundant background network loops.

4. **Animated Loading Component (`Spinner.tsx`)**
   - Created a reusable, responsive, and centered animated spinner inside [`src/components/Spinner.tsx`](file:///c:/Users/priya/Downloads/PriyanshiGajiwalaNikesh/src/components/Spinner.tsx).
   - Displayed automatically while the API network request is in progress.

5. **Error Component & Retry Mechanism (`ErrorMessage.tsx`)**
   - Created a reusable error handling banner inside [`src/components/ErrorMessage.tsx`](file:///c:/Users/priya/Downloads/PriyanshiGajiwalaNikesh/src/components/ErrorMessage.tsx).
   - Gracefully catches HTTP errors (e.g., rate limits, 404, network failure).
   - Includes a **Retry Request** button that invokes `fetchRepos` again to recover from transient errors.

6. **Repository Search & Case-Insensitive Filtering**
   - Placed a search bar input above the repository list.
   - Filters repositories in real-time by repository name in a case-insensitive manner.

7. **Modular Repository Card (`RepoCard.tsx`)**
   - Created a dedicated presentation card inside [`src/components/RepoCard.tsx`](file:///c:/Users/priya/Downloads/PriyanshiGajiwalaNikesh/src/components/RepoCard.tsx).
   - Displays Repository Name, Description, Language, Star count (⭐ `stargazers_count`), and an **Open Repository** button (`target="_blank" rel="noreferrer"`).

8. **Conditional Rendering & Map Function**
   - Conditional rendering pipeline: `loading ? <Spinner /> : error ? <ErrorMessage /> : repos.map(...)`.
   - Safely handles empty repository list fallback.

---

## Practical 2 Features (State Management & Routing)

1. **Controlled Contact Form**: React `useState` for inputs `name`, `email`, and `message`.
2. **Real-time Live Preview**: Dynamically updates live preview card as the user types.
3. **Character Counter**: Real-time message length tracking.
4. **Live Preview Toggle**: `showPreview` boolean state to show/hide live preview.
5. **Dark / Light Theme Toggle**: Persistent theme state synchronized with `localStorage`.
6. **React Router DOM Routing**: Client-side navigation with custom 404 page.

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — Build tool
- **Tailwind CSS v4** — Styling & theme variables
- **React Router DOM v7** — Multi-page client-side routing
- **Framer Motion** — Micro-animations and page transitions
- **React Icons** — Icon library
- **GitHub REST API** — Dynamic repository data

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Portfolio hero, stats, and summary |
| `/about` | About | Bio, education, skills, and background |
| `/projects` | Projects | **Practical 3** GitHub REST API repos & featured showcase |
| `/projects/:slug` | Project Details | Deep dive into specific project architecture |
| `/experience` | Experience | Work experience timeline & key achievements |
| `/research` | Research | Published research papers & IEEE documentation |
| `/achievements` | Achievements | Badges, awards, and recognitions |
| `/resume` | Resume | Printable / downloadable resume layout |
| `/blog` | Blog | Technical articles and tutorials |
| `/contact` | Contact | **Practical 2** Controlled form with live preview |
| `/not-found` | 404 Fallback | Route fallback page |

---

## Getting Started

To run the development server locally:

```bash
npm install
npm run dev
```

To test production build and verify type safety:

```bash
npm run build
npm run preview
```
