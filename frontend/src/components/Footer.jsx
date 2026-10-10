import { Link } from 'react-router-dom';
import { PawPrint, Instagram, Twitter, Facebook } from 'lucide-react';
import Container from './ui/Container';

// One row of links instead of four stacked columns. Everything that was in
// the old column layout is still reachable from the nav, so repeating it
// here only made the page longer.
const links = [
  { to: '/pet-services', label: 'Pet Services' },
  { to: '/essentials', label: 'Essentials' },
  { to: '/grooming', label: 'Grooming' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/team', label: 'Our Team' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const socials = [
  { href: '#', label: 'Instagram', icon: Instagram },
  { href: '#', label: 'Twitter', icon: Twitter },
  { href: '#', label: 'Facebook', icon: Facebook },
];

const Footer = () => (
  <footer className="mt-auto border-t border-hairline bg-shell">
    <Container className="py-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-blush-100 text-blush-500">
            <PawPrint size={16} strokeWidth={2.2} />
          </span>
          <span className="text-base font-semibold text-ink">Pet Care Hub</span>
        </Link>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm text-ink-soft hover:text-blush-600 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-2 shrink-0">
          {socials.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="grid place-items-center w-8 h-8 rounded-full text-ink-mute hover:text-blush-600 hover:bg-cream transition-colors"
            >
              <Icon size={15} strokeWidth={1.9} />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-7 pt-5 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-xs text-ink-mute">
          © {new Date().getFullYear()} Pet Care Hub · Phagwara, Punjab
        </p>
        <p className="text-xs text-ink-mute">
          <a href="mailto:support@petcarehub.com" className="hover:text-blush-600 transition-colors">
            support@petcarehub.com
          </a>
          {' · '}
          <a href="tel:+919876543210" className="hover:text-blush-600 transition-colors">
            +91 98765 43210
          </a>
        </p>
      </div>
    </Container>
  </footer>
);

export default Footer;
