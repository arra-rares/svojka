import { useState } from 'react';
import { GalleryPage } from '@/pages/gallery';
import { Landing } from '@/pages/landing';

export default function App() {
  const [page, setPage] = useState<'home' | 'gallery'>('home');

  if (page === 'gallery') {
    return (
      <GalleryPage
        onBackToHome={() => {
          setPage('home');
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  return (
    <Landing
      onNavigateToGallery={() => {
        setPage('gallery');
        window.scrollTo(0, 0);
      }}
    />
  );
}
