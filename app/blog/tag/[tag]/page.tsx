'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Search, Tag as TagIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BlogCard } from '@/components/BlogCard'
import { calculateReadTime, formatDate, getTags, extractDateFromUrl, type BlogPost } from '@/lib/api'

function TagPageContent() {
  const params = useParams()
  const tag = decodeURIComponent(params.tag as string)

  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

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

  // Filter posts by the tag from URL
  const tagFilteredPosts = allPosts.filter(post => {
    const postKeywordTags = getTags(post.Keywords)
    const categories = Array.isArray(post.Category) ? post.Category : post.Category?.Value || []
    const postCategoryTags = categories.map(cat => cat.Name) || []
    const postAllTags = [...postKeywordTags, ...postCategoryTags]

    return postAllTags.some(t => t.toLowerCase() === tag.toLowerCase())
  })

  // Further filter by search query if provided
  const filteredPosts = tagFilteredPosts.filter(post => {
    if (!searchQuery) return true

    const description = typeof post.Description === 'string' ? post.Description : post.Description?.Value || ''
    return post.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           description.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="section-container">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="section-container">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to all posts</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-white mb-6 shadow-2xl">
            <TagIcon size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">{tag}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} tagged with "{tag}"
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-6 mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search within these articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
        </motion.div>

        {/* Results count */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-gray-600 dark:text-gray-400"
          >
            Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} matching "{searchQuery}"
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
            const tags = Array.from(new Set([...keywordTags, ...categoryTags])).slice(0, 5)

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
              {searchQuery
                ? `No articles tagged with "${tag}" match your search "${searchQuery}"`
                : `No articles found with the tag "${tag}"`
              }
            </p>
            <Link href="/blog" className="btn-primary">
              View all posts
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function TagPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-12">
        <div className="section-container">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
          </div>
        </div>
      </div>
    }>
      <TagPageContent />
    </Suspense>
  )
}
