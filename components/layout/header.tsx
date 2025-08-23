'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, Search, Menu, X, User, Heart, LogOut } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { AdvancedSearch } from '@/components/search/advanced-search'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { OmorfoLogo } from '@/components/ui/omorfo-logo'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const { data: session } = useSession()
  const { state } = useCart()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-primary-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <OmorfoLogo size="md" className="text-accent-500" />
            <span className="text-xl font-display font-semibold text-primary-800">
              ómorfo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-primary-900 hover:text-accent-500 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="w-80">
              <AdvancedSearch />
            </div>

            {/* User menu */}
            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-primary-700 hover:text-primary-800 transition-colors">
                  <User className="w-5 h-5" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-primary-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-accent-500 transition-colors"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-accent-500 transition-colors"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-accent-500 transition-colors"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-accent-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-primary-900 hover:text-accent-500 transition-colors font-medium"
              >
                Sign In
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="p-2 text-primary-700 hover:text-primary-800 transition-colors relative"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-primary-700 hover:text-primary-800 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-primary-700 hover:text-primary-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>



      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  )
}
