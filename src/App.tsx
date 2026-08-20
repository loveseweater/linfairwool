import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import Layout from './components/layout/Layout'
import Home from './pages/Home'

// Lazy load non-critical routes for faster initial page load
const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const Contact = lazy(() => import('./pages/Contact'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Videos = lazy(() => import('./pages/Videos'))
const AdminPage = lazy(() => import('./pages/admin'))

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <Routes>
      <Route path="/admin" element={
        <Suspense fallback={<PageLoader />}>
          <AdminPage />
        </Suspense>
      } />
      <Route path="*" element={
        <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
              <Route path="/about" element={
                <Suspense fallback={<PageLoader />}>
                  <AnimatedPage><About /></AnimatedPage>
                </Suspense>
              } />
              <Route path="/products" element={
                <Suspense fallback={<PageLoader />}>
                  <AnimatedPage><Products /></AnimatedPage>
                </Suspense>
              } />
              <Route path="/contact" element={
                <Suspense fallback={<PageLoader />}>
                  <AnimatedPage><Contact /></AnimatedPage>
                </Suspense>
              } />
              <Route path="/blog" element={
                <Suspense fallback={<PageLoader />}>
                  <AnimatedPage><Blog /></AnimatedPage>
                </Suspense>
              } />
              <Route path="/blog/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <AnimatedPage><BlogPost /></AnimatedPage>
                </Suspense>
              } />
              <Route path="/videos" element={
                <Suspense fallback={<PageLoader />}>
                  <AnimatedPage><Videos /></AnimatedPage>
                </Suspense>
              } />
            </Routes>
          </AnimatePresence>
        </Layout>
      } />
    </Routes>
  )
}
