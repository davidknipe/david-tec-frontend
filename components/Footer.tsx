'use client'

import Link from 'next/link'
import { Github, Linkedin, Rss, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="glass-strong border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">DK</span>
              </div>
              <div>
                <div className="font-bold text-lg gradient-text">David Knipe</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">VP of Solution Architecture</div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Technical blog focusing on Optimizely, AI and modern web development.
              Sharing insights from years of enterprise architecture experience.
            </p>
            <div className="flex space-x-3">
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
                href="https://linkedin.com/in/davidknipe"
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
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/nuget-explorer" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  NuGet Explorer
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h3 className="font-bold text-lg mb-4">Popular Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['Optimizely', 'EPiServer', 'ASP.NET', 'CMS', 'Architecture', 'AI'].map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
            © {currentYear} David Knipe. Made with <Heart size={16} className="mx-1 text-red-500" /> and Next.js
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 md:mt-0">
            Optimizely MVP Alumni
          </p>
        </div>
      </div>
    </footer>
  )
}
