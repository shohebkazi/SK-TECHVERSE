import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider }  from './context/AuthContext';

import Cursor            from './components/Cursor';
import { Particles, Loader, ScrollProgress } from './components/Effects';
import AmbientBackground from './components/AmbientBackground';
import Navbar            from './components/Navbar';
import Footer            from './components/Footer';
import ChatBot           from './components/ChatBot';

import HomePage                     from './pages/Home';
import { AboutPage, ServicesPage }  from './pages/AboutServices';
import { ProjectsPage, AIPage, PricingPage, TestimonialsPage } from './pages/ProjectsAIPricingTest';
import { BlogPage, ContactPage, OrderPage, TrackOrderPage, AuthPage } from './pages/BlogContactOrderAuth';
import { ProjectDetailPage } from './pages/ProjectDetail';
import AdminDashboard               from './pages/admin/Dashboard';


const NO_CHROME = ['login','admin'];

// If the user opens /admin directly, drop them straight into the admin
// flow (Dashboard already redirects to the login page itself when no
// valid session exists — see pages/admin/Dashboard.jsx).
const getInitialPage = () => {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/admin') return 'admin';
  return 'home';
};

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [page,   setPageRaw]   = useState(getInitialPage);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const setPage = (p, projectId = null) => {
    setPageRaw(p);
    if (projectId) setSelectedProjectId(projectId);
  };

  useEffect(() => { window.scrollTo({ top:0, behavior:'smooth' }); }, [page]);

  // Keep the address bar in sync: only /admin ever shows the admin path,
  // every other page lives at "/" so the admin route stays hidden/unlinked.
  useEffect(() => {
    const wantsAdminPath = page === 'admin' || page === 'login';
    const targetPath = wantsAdminPath ? '/admin' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.replaceState(null, '', targetPath);
    }
  }, [page]);

  const showChrome = !NO_CHROME.includes(page);
  const isAdminArea = page === 'admin' || page === 'login';

  return (
    <ThemeProvider lockDark={isAdminArea}>
      <AuthProvider>
        {!loaded && <Loader onDone={() => setLoaded(true)} />}
        {loaded && (
          <>
            <AmbientBackground />
            <Cursor />
            <Particles />
            <ScrollProgress />
            {showChrome && <Navbar page={page} setPage={setPage} />}

            {page==='home'         && <HomePage          setPage={setPage}/>}
            {page==='about'        && <AboutPage />}
            {page==='services'     && <ServicesPage      setPage={setPage}/>}
            {page==='projects'     && <ProjectsPage       setPage={setPage}/>}
            {page==='projectDetail'&& <ProjectDetailPage  projectId={selectedProjectId} setPage={setPage}/>}
            {page==='ai'           && <AIPage             setPage={setPage}/>}
            {page==='pricing'      && <PricingPage        setPage={setPage}/>}
            {page==='testimonials' && <TestimonialsPage />}
            {page==='blog'         && <BlogPage />}
            {page==='contact'      && <ContactPage />}
            {page==='order'        && <OrderPage          setPage={setPage}/>}
            {page==='track'        && <TrackOrderPage     setPage={setPage}/>}
            {page==='login'        && <AuthPage           setPage={setPage}/>}
            {page==='admin'        && <AdminDashboard     setPage={setPage}/>}

            {showChrome && <Footer setPage={setPage} />}
            <ChatBot />
            <a href="https://wa.me/917410721438" target="_blank" rel="noopener noreferrer" className="wa-fab">💬</a>
          </>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}