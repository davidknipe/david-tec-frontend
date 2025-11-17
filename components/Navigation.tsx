'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, Sun, Github, Linkedin, Rss, Menu, X as CloseIcon } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/nuget-explorer', label: 'NuGet Explorer' },
  { href: '/archive', label: 'Archive' },
]

export function Navigation() {
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass-strong shadow-lg">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="hidden md:block">
              <div className="font-bold text-3xl gradient-text">david-tec.com</div>
              {/* <div className="text-xs text-gray-600 dark:text-gray-400">Solution Architecture</div> */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Social links */}
            <div className="hidden sm:flex items-center space-x-2">
              <a
                href="https://github.com/davidknipe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com/davidknipe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/david--knipe/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="/rss"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="RSS Feed"
              >
                <Rss size={20} />
              </a>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="relative flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              aria-label="Toggle theme"
            >
              <div className="flex items-center space-x-2">
                {theme === 'dark' ? (
                  <>
                    <Sun size={18} className="animate-pulse" />
                    <span className="hidden sm:inline text-sm">Light</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} className="animate-pulse" />
                    <span className="hidden sm:inline text-sm">Dark</span>
                  </>
                )}
              </div>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      pathname === link.href
                        ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center space-x-2 px-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href="https://github.com/davidknipe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Github size={20} />
                  </a>
                  <a
                    href="https://twitter.com/davidknipe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/davidknipe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href="/rss"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Rss size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
