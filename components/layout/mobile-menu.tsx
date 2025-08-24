'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Dialog, Transition } from '@headlessui/react'
import { X, User, Heart, ShoppingCart, ChevronRight } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { OmorfoLogo } from '@/components/ui/omorfo-logo'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const categories = [
  { name: 'Abstract', href: '/categories/abstract' },
  { name: 'Nature', href: '/categories/nature' },
  { name: 'Typography', href: '/categories/typography' },
  { name: 'Vintage', href: '/categories/vintage' },
  { name: 'Minimalist', href: '/categories/minimalist' },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: session } = useSession()
  const { state } = useCart()

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                      <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <OmorfoLogo size="sm" className="text-accent-500" />
                        <span>ómorfo</span>
                      </Dialog.Title>
                      <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto">
                      <nav className="px-6 py-4">
                        {/* Main Navigation */}
                        <div className="space-y-1">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={onClose}
                              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-accent-500 hover:bg-gray-50 rounded-md transition-colors"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>

                        {/* Categories */}
                        <div className="mt-8">
                          <h3 className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Categories
                          </h3>
                          <div className="space-y-1">
                            {categories.map((category) => (
                              <Link
                                key={category.name}
                                href={category.href}
                                onClick={onClose}
                                className="flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-accent-500 hover:bg-gray-50 rounded-md transition-colors"
                              >
                                {category.name}
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* User Actions */}
                        <div className="mt-8 border-t border-gray-200 pt-8">
                          <div className="space-y-1">
                            {session ? (
                              <>
                                <Link
                                  href="/account"
                                  onClick={onClose}
                                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-accent-500 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                  <User className="w-5 h-5 mr-3" />
                                  My Account
                                </Link>
                                <Link
                                  href="/account/orders"
                                  onClick={onClose}
                                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-accent-500 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                  Orders
                                </Link>
                                <Link
                                  href="/account/wishlist"
                                  onClick={onClose}
                                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-accent-500 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                  <Heart className="w-5 h-5 mr-3" />
                                  Wishlist
                                </Link>
                                <button
                                  onClick={() => {
                                    signOut()
                                    onClose()
                                  }}
                                  className="flex w-full items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-accent-500 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                  Sign Out
                                </button>
                              </>
                            ) : (
                              <Link
                                href="/auth/signin"
                                onClick={onClose}
                                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-accent-500 hover:bg-gray-50 rounded-md transition-colors"
                              >
                                <User className="w-5 h-5 mr-3" />
                                Sign In
                              </Link>
                            )}
                          </div>
                        </div>
                      </nav>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <Link
                          href="/cart"
                          onClick={onClose}
                          className="flex items-center text-base font-medium text-gray-700 hover:text-accent-500 transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Cart
                          {state.itemCount > 0 && (
                            <span className="ml-2 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {state.itemCount}
                            </span>
                          )}
                        </Link>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
