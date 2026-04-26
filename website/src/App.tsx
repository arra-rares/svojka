import { useEffect, useState } from 'react';
import { AdminPage } from '@/pages/admin';
import { GalleryPage } from '@/pages/gallery';
import { Landing } from '@/pages/landing';

export default function App() {
  const [page, setPage] = useState<'home' | 'gallery' | 'admin'>('home');

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
      setPage('home');
    };

    syncPageFromPath();
    window.addEventListener('popstate', syncPageFromPath);
    return () => window.removeEventListener('popstate', syncPageFromPath);
  }, []);

  const navigateTo = (nextPage: 'home' | 'gallery', path: '/' | '/gallery') => {
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

  return <Landing onNavigateToGallery={() => navigateTo('gallery', '/gallery')} />;
}
