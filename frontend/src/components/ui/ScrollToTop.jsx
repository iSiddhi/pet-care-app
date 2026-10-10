import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Router keeps scroll position between pages by default, which makes a
// new page open halfway down. This resets it.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export default ScrollToTop;
