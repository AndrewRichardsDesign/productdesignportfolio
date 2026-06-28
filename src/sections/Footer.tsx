import { Heart } from 'lucide-react';
import { useContent } from '@/content/ContentContext';
import { Editable } from '@/content/Editable';

export default function Footer() {
  const { content } = useContent();
  const footer = content.footer;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-8 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} <Editable as="span" path="footer.copyright" />
          </p>

          {/* Made with love */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Editable as="span" path="footer.madeWithPre" />{' '}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />{' '}
            <Editable as="span" path="footer.madeWithPost" />
          </p>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-sm">
            {footer.links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Editable as="span" path={`footer.links.${i}.name`} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
