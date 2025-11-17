'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, ExternalLink, Filter, TrendingUp, Package, Users } from 'lucide-react'

interface NugetPackage {
  id: string
  version: string
  downloads: number
  description: string
  author: string
  lastUpdated: string
  tags: string[]
}

// Sample data - would normally come from API
const samplePackages: NugetPackage[] = [
  {
    id: 'EPiServer.CMS.Core',
    version: '12.15.0',
    downloads: 125430,
    description: 'Core functionality for Optimizely CMS including content management, routing, and security.',
    author: 'Optimizely',
    lastUpdated: '2024-03-15',
    tags: ['CMS', 'Core'],
  },
  {
    id: 'EPiServer.Commerce',
    version: '14.8.2',
    downloads: 98765,
    description: 'Complete e-commerce solution with catalog, cart, checkout, and order management.',
    author: 'Optimizely',
    lastUpdated: '2024-02-28',
    tags: ['Commerce', 'E-commerce'],
  },
  {
    id: 'EPiServer.Find',
    version: '14.2.3',
    downloads: 87654,
    description: 'Enterprise search and personalization powered by Elasticsearch.',
    author: 'Optimizely',
    lastUpdated: '2024-01-20',
    tags: ['Search', 'Personalization'],
  },
  {
    id: 'Optimizely.ContentGraph',
    version: '3.4.1',
    downloads: 45678,
    description: 'GraphQL-based headless CMS API for building modern frontend applications.',
    author: 'Optimizely',
    lastUpdated: '2024-04-01',
    tags: ['Headless', 'GraphQL'],
  },
  {
    id: 'EPiServer.Labs.LanguageManager',
    version: '5.2.0',
    downloads: 23456,
    description: 'Simplify content translation and language management workflows.',
    author: 'EPiServer Labs',
    lastUpdated: '2023-11-15',
    tags: ['Translation', 'Languages'],
  },
]

export default function NugetExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSource, setFilterSource] = useState<'all' | 'optimizely' | 'community'>('all')
  const [sortBy, setSortBy] = useState<'downloads' | 'updated' | 'name'>('downloads')

  const filteredPackages = samplePackages
    .filter(pkg => {
      const matchesSearch = pkg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterSource === 'all' ||
                          (filterSource === 'optimizely' && pkg.author === 'Optimizely') ||
                          (filterSource === 'community' && pkg.author !== 'Optimizely')
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads
      if (sortBy === 'updated') return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      return a.id.localeCompare(b.id)
    })

  const totalDownloads = samplePackages.reduce((sum, pkg) => sum + pkg.downloads, 0)

  return (
    <div className="min-h-screen py-12">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-white mb-6 shadow-2xl">
            <Package size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">NuGet Explorer</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover and explore Optimizely packages. Browse through 828+ packages from the Optimizely ecosystem.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="card text-center">
            <div className="inline-flex p-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
              <Package size={24} />
            </div>
            <div className="text-3xl font-bold gradient-text mb-2">828+</div>
            <div className="text-gray-600 dark:text-gray-400">Total Packages</div>
          </div>
          <div className="card text-center">
            <div className="inline-flex p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
              <Download size={24} />
            </div>
            <div className="text-3xl font-bold gradient-text mb-2">{(totalDownloads / 1000).toFixed(0)}K+</div>
            <div className="text-gray-600 dark:text-gray-400">Total Downloads</div>
          </div>
          <div className="card text-center">
            <div className="inline-flex p-3 rounded-xl bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 mb-4">
              <Users size={24} />
            </div>
            <div className="text-3xl font-bold gradient-text mb-2">200+</div>
            <div className="text-gray-600 dark:text-gray-400">Contributors</div>
          </div>
        </motion.div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="downloads">Most Downloaded</option>
              <option value="updated">Recently Updated</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterSource('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterSource === 'all'
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All Packages
            </button>
            <button
              onClick={() => setFilterSource('optimizely')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterSource === 'optimizely'
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Optimizely Official
            </button>
            <button
              onClick={() => setFilterSource('community')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterSource === 'community'
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Community
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <div className="mb-4 text-gray-600 dark:text-gray-400">
          Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
        </div>

        {/* Package list */}
        <div className="space-y-4">
          {filteredPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold group-hover:gradient-text transition-all mb-1">
                        {pkg.id}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-mono text-primary-600 dark:text-primary-400">v{pkg.version}</span>
                        <span>by {pkg.author}</span>
                        <span>Updated {new Date(pkg.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {pkg.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {pkg.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-start lg:items-end space-y-3">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Download size={18} />
                    <span className="font-semibold">{pkg.downloads.toLocaleString()}</span>
                    <span className="text-sm">downloads</span>
                  </div>
                  <a
                    href={`https://www.nuget.org/packages/${pkg.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm inline-flex items-center space-x-2"
                  >
                    <span>View on NuGet</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No results */}
        {filteredPackages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-2">No packages found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterSource('all')
              }}
              className="btn-primary"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
