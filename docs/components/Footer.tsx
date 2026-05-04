import { gitConfig } from '@/lib/shared';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa6';
import { FaXTwitter } from 'react-icons/fa6';

const currentYear = new Date().getFullYear();
const copyrightStart = 2024;

export function Footer() {
  const footerLinkClass =
    'text-sm text-fd-muted-foreground transition-colors duration-200 hover:text-fd-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background rounded';

  const footerSections = [
    {
      title: 'FRAMEWORK',
      links: [
        { label: 'Guide', href: '/docs/framework' },
        { label: 'Config', href: '/docs/api/config' },
        { label: 'Plugins', href: '/docs/framework/plugins' },
        { label: 'Benchmarks', href: '/docs/framework/benchmarks' },
      ],
    },
    {
      title: 'RESOURCES',
      links: [
        { label: 'Getting Started', href: '/docs/framework/getting-started' },
        { label: 'API Reference', href: '/docs/api' },
        { label: 'CLI', href: '/docs/cli' },
        { label: 'GitHub', href: `${gitConfig.protocol}://${gitConfig.hostname}/${gitConfig.user}/${gitConfig.repo}`, external: true },
      ],
    },
    {
      title: 'VERSIONS',
      links: [
        { label: 'Latest Docs', href: '/docs/framework' },
        { label: 'Releases', href: `${gitConfig.protocol}://${gitConfig.hostname}/${gitConfig.user}/${gitConfig.repo}/releases`, external: true },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      label: 'GitHub',
      href: `${gitConfig.protocol}://${gitConfig.hostname}/${gitConfig.user}/${gitConfig.repo}`,
    },
    {
      icon: FaXTwitter,
      label: 'X',
      href: 'https://twitter.com/rahuletto',
    },
  ];

  return (
    <footer className="border-t border-fd-border bg-fd-background">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
        {/* Links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-medium uppercase tracking-widest text-fd-foreground mb-4">
                {section.title}
              </p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className={footerLinkClass}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social links */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-fd-foreground mb-4">
              SOCIAL
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.label}
                    className={`${footerLinkClass} inline-flex items-center justify-center`}
                  >
                    <Icon className="size-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-fd-border pt-8">
          {/* Copyright */}
          <p className="text-xs text-fd-muted-foreground">
            © {copyrightStart}{copyrightStart !== currentYear ? `-${currentYear}` : ''} Manic contributors. MIT Licensed.
          </p>
        </div>
      </div>
    </footer>
  );
}
