import Link from 'next/link'
import { Facebook, Instagram } from 'lucide-react'
import { NewsletterSignup } from '@/components/newsletter/newsletter-signup'
import { OmorfoLogo } from '@/components/ui/omorfo-logo'

const navigation = {
  shop: [
    { name: 'All Posters', href: '/shop' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Returns', href: '/returns' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
  ],
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Instagram', href: 'https://www.instagram.com/omorfodesigned/', icon: Instagram },
]

export function Footer() {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <OmorfoLogo size="md" className="text-accent-500" />
              <span className="text-xl font-display font-semibold">
                ómorfo
              </span>
            </Link>
            <p className="text-primary-200 mb-6 max-w-md">
              Discover and purchase high-quality custom posters. From abstract art to vintage designs, 
              find the perfect poster for your space with ómorfo.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-primary-200 uppercase tracking-wider mb-3">
                Stay Updated
              </h3>
              <NewsletterSignup />
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-primary-300 hover:text-accent-400 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-primary-200 uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              {navigation.shop.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-primary-200 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-primary-200 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-primary-200 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-primary-200 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-primary-200 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-primary-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-300 text-sm">
              © {new Date().getFullYear()} ómorfo. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center space-x-6 text-sm text-primary-300">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
