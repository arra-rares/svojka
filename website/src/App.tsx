import { useEffect, useState } from 'react';
import { AdminPage } from '@/pages/admin';
import { GalleryPage } from '@/pages/gallery';
import { Landing } from '@/pages/landing';
import { LegalPage } from '@/pages/legal';

export default function App() {
  const [page, setPage] = useState<'home' | 'gallery' | 'admin' | 'privacy' | 'gdpr' | 'terms' | 'cookies'>('home');

  useEffect(() => {
    const syncPageFromPath = () => {
      const pathname = window.location.pathname;
      if (pathname === '/manage-events-9xk2') {
        setPage('admin');
        return;
      }
      if (pathname === '/gallery') {
        setPage('gallery');
        return;
      }
      if (pathname === '/privacy') {
        setPage('privacy');
        return;
      }
      if (pathname === '/gdpr') {
        setPage('gdpr');
        return;
      }
      if (pathname === '/terms') {
        setPage('terms');
        return;
      }
      if (pathname === '/cookies') {
        setPage('cookies');
        return;
      }
      setPage('home');
    };

    syncPageFromPath();
    window.addEventListener('popstate', syncPageFromPath);
    return () => window.removeEventListener('popstate', syncPageFromPath);
  }, []);

  const navigateTo = (
    nextPage: 'home' | 'gallery' | 'privacy' | 'gdpr' | 'terms' | 'cookies',
    path: '/' | '/gallery' | '/privacy' | '/gdpr' | '/terms' | '/cookies',
  ) => {
    window.history.pushState({}, '', path);
    setPage(nextPage);
    window.scrollTo(0, 0);
  };

  if (page === 'admin') {
    return <AdminPage onBackHome={() => navigateTo('home', '/')} />;
  }

  if (page === 'gallery') {
    return <GalleryPage onBackToHome={() => navigateTo('home', '/')} />;
  }
  if (page === 'privacy') {
    return <LegalPage kind="privacy" onBackHome={() => navigateTo('home', '/')} />;
  }
  if (page === 'gdpr') {
    return <LegalPage kind="gdpr" onBackHome={() => navigateTo('home', '/')} />;
  }
  if (page === 'terms') {
    return <LegalPage kind="terms" onBackHome={() => navigateTo('home', '/')} />;
  }
  if (page === 'cookies') {
    return <LegalPage kind="cookies" onBackHome={() => navigateTo('home', '/')} />;
  }

  return <Landing onNavigateToGallery={() => navigateTo('gallery', '/gallery')} />;
}
