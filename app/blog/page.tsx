'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import { BlogCard } from '@/components/BlogCard'
import { calculateReadTime, formatDate, getTags, extractDateFromUrl, type BlogPost } from '@/lib/api'

export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch('/api/blog')
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts')
        }
        const posts = await response.json()
        setAllPosts(posts)
      } catch (error) {
        console.error('Error loading posts:', error)
        setAllPosts([])
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [])

  // Get all unique tags from both Keywords and Categories
  const allTags = Array.from(new Set(
    allPosts.flatMap(post => {
      const keywordTags = getTags(post.Keywords)
      const categories = Array.isArray(post.Category) ? post.Category : post.Category?.Value || []
      const categoryTags = categories.map(cat => cat.Name) || []
      return [...keywordTags, ...categoryTags]
    })
  )).sort()

  const filteredPosts = allPosts.filter(post => {
    const description = typeof post.Description === 'string' ? post.Description : post.Description?.Value || ''
    const matchesSearch = post.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         description.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedTags.length === 0) return matchesSearch

    const postKeywordTags = getTags(post.Keywords)
    const categories = Array.isArray(post.Category) ? post.Category : post.Category?.Value || []
    const postCategoryTags = categories.map(cat => cat.Name) || []
    const postAllTags = [...postKeywordTags, ...postCategoryTags]

    const matchesTags = selectedTags.some(tag => postAllTags.includes(tag))
    return matchesSearch && matchesTags
  })

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="section-container">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading blog posts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Technical Blog</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            In-depth articles on Optimizely, ASP.NET, and modern web development.
            {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} available.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-6 mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            {/* Filter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-primary-50 dark:bg-primary-900/30' : ''}`}
            >
              <Filter size={20} />
              <span>Filters</span>
              {selectedTags.length > 0 && (
                <span className="px-2 py-1 text-xs bg-primary-500 text-white rounded-full">
                  {selectedTags.length}
                </span>
              )}
            </button>
          </div>

          {/* Filter tags */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <span className="font-medium mr-4">Filter by tags:</span>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results count */}
        {(searchQuery || selectedTags.length > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-gray-600 dark:text-gray-400"
          >
            Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
          </motion.div>
        )}

        {/* Blog posts grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => {
            const dateInfo = extractDateFromUrl(post.Url)
            const slug = post.Url.split('/').filter(Boolean).pop() || ''
            const keywordTags = getTags(post.Keywords)
            const categories = Array.isArray(post.Category) ? post.Category : post.Category?.Value || []
            const categoryTags = categories.map(cat => cat.Name) || []
            const tags = Array.from(new Set([...keywordTags, ...categoryTags])).slice(0, 5) // Remove duplicates and limit to 5 tags

            const description = typeof post.Description === 'string' ? post.Description : post.Description?.Value || ''
            const introText = typeof post.IntroText === 'string' ? post.IntroText : post.IntroText?.Value || ''
            const image = typeof post.TwitterCardImage === 'string' ? post.TwitterCardImage : post.TwitterCardImage?.Value

            return (
              <motion.div
                key={post.ContentLink.GuidValue}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BlogCard
                  title={post.Name}
                  excerpt={description || introText.substring(0, 150) || ''}
                  date={formatDate(post.StartPublish)}
                  readTime={calculateReadTime(post.BodyText)}
                  slug={slug}
                  year={dateInfo?.year || '2024'}
                  month={dateInfo?.month || '01'}
                  image={image}
                  tags={tags}
                />
              </motion.div>
            )
          })}
        </div>

        {/* No results */}
        {filteredPosts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">No articles found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedTags([])
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
