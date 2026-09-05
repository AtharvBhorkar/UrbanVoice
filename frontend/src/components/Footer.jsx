import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import logo from '../assets/logo.png';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Home', to: '/' },
    { label: 'Explore', to: '/feed' },
    { label: 'How it works', to: '/how-it-works' },
    { label: 'Track complaint', to: '/track-complaint' },
    { label: 'Departments', to: '/departments' },
  ],
  Company: [
    { label: 'About us', to: '/about' },
    { label: 'Help & FAQ', to: '/help' },
    { label: 'Community impact', to: '/community-impact' },
    { label: 'Contact us', to: '/contact' },
  ],
  Resources: [
    { label: 'Reporting guidelines', to: '/reporting-guidelines' },
    { label: 'Priority & escalation', to: '/priority-escalation' },
  ],
  Legal: [
    { label: 'Privacy policy', to: '/privacy-policy' },
    { label: 'Terms of service', to: '/terms-of-service' },
  ],
};

const SOCIALS = [
  { icon: Instagram, href: 'https://instagram.com' },
  { icon: Twitter, href: 'https://twitter.com' },
  { icon: Facebook, href: 'https://facebook.com' },
  { icon: Youtube, href: 'https://youtube.com' },
];

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-volt/10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-6 gap-y-10 md:gap-x-8">
          <div className="col-span-2 md:col-span-2 pr-0 md:pr-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="" className="w-8 h-8 object-contain" />
              <span className="font-display font-bold text-[18px] text-volt">
                Urban<span className="text-signal">Voice</span>
              </span>
            </Link>
            <p className="font-body text-[14px] text-volt/60 mt-4 leading-relaxed max-w-[240px]">
              One voice for every public issue — government or community.
              Report it, track it, get it resolved.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social link"
                  className="w-9 h-9 rounded-full bg-volt/10 flex items-center justify-center text-volt hover:bg-volt hover:text-navy transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="col-span-1">
              <h4 className="font-body text-[13px] font-semibold uppercase tracking-wide text-volt/50">
                {heading}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="font-body text-[14px] text-volt/75 hover:text-volt transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-14 pt-6 border-t border-volt/10">
          <span className="font-body text-[13px] text-volt/50">
            © {new Date().getFullYear()} UrbanVoice. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link to="/help" className="font-body text-[13px] text-volt/50 hover:text-volt transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}