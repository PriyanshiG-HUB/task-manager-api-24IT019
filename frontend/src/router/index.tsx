import { lazy, Suspense, type ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'

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

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-text-secondary">Loading...</p>
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: 'about', element: withSuspense(About) },
      { path: 'projects', element: withSuspense(Projects) },
      { path: 'projects/:slug', element: withSuspense(ProjectDetails) },
      { path: 'experience', element: withSuspense(Experience) },
      { path: 'research', element: withSuspense(Research) },
      { path: 'achievements', element: withSuspense(Achievements) },
      { path: 'resume', element: withSuspense(Resume) },
      { path: 'blog', element: withSuspense(Blog) },
      { path: 'contact', element: withSuspense(Contact) },
      { path: 'login', element: withSuspense(Login) },
      { path: 'register', element: withSuspense(Register) },
      {
        path: 'tasks',
        element: (
          <ProtectedRoute>
            {withSuspense(Tasks)}
          </ProtectedRoute>
        ),
      },
      { path: 'not-found', element: withSuspense(NotFound) },
      { path: '*', element: withSuspense(NotFound) },
    ],
  },
])
