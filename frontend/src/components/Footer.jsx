import { Link } from 'react-router-dom';
import { PawPrint, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';
import Container from './ui/Container';

const columns = [
  {
    title: 'Services',
    links: [
      { to: '/pet-services', label: 'Pet Services' },
      { to: '/essentials', label: 'Essentials' },
      { to: '/grooming', label: 'Grooming' },
      { to: '/pet-finder', label: 'Pet Finder' },
      { to: '/disease-prediction', label: 'Health Check' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/team', label: 'Our team' },
      { to: '/gallery', label: 'Gallery' },
      { to: '/contact', label: 'Contact' },
    ],
  },
];

const socials = [
  { href: '#', label: 'Instagram', icon: Instagram },
  { href: '#', label: 'Twitter', icon: Twitter },
  { href: '#', label: 'Facebook', icon: Facebook },
];

const Footer = () => (
  <footer className="mt-auto border-t border-hairline bg-shell">
    <Container className="py-16 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-blush-100 text-blush-500">
              <PawPrint size={18} strokeWidth={2.2} />
            </span>
            <span className="text-base font-semibold text-ink">Pet Care Hub</span>
          </Link>
          <p className="text-sm text-ink-soft leading-relaxed max-w-xs">
            Find a companion, book grooming, shop essentials and check symptoms —
            without juggling five different apps.
          </p>

          <div className="flex gap-2 mt-6">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid place-items-center w-9 h-9 rounded-full border border-hairline text-ink-soft hover:border-blush-300 hover:text-blush-500 hover:bg-blush-50 transition-colors"
              >
                <Icon size={16} strokeWidth={1.9} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink-mute mb-5">
              {col.title}
            </h3>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-ink-soft hover:text-blush-500 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink-mute mb-5">
            Get in touch
          </h3>
          <ul className="space-y-4">
            <li>
              <a
                href="mailto:support@petcarehub.com"
                className="flex items-start gap-3 text-sm text-ink-soft hover:text-blush-500 transition-colors"
              >
                <Mail size={16} className="mt-0.5 shrink-0" strokeWidth={1.9} />
                support@petcarehub.com
              </a>
            </li>
            <li>
              <a
                href="tel:+919876543210"
                className="flex items-start gap-3 text-sm text-ink-soft hover:text-blush-500 transition-colors"
              >
                <Phone size={16} className="mt-0.5 shrink-0" strokeWidth={1.9} />
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-start gap-3 text-sm text-ink-soft">
              <MapPin size={16} className="mt-0.5 shrink-0" strokeWidth={1.9} />
              Phagwara, Punjab, India
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-14 pt-8 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-ink-mute">
          © {new Date().getFullYear()} Pet Care Hub
        </p>
        <p className="text-xs text-ink-mute">
          Health guidance is informational and does not replace a licensed vet.
        </p>
      </div>
    </Container>
  </footer>
);

export default Footer;
