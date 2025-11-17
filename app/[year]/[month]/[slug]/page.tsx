'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowLeft, Share2, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { calculateReadTime, formatDate, getTags, type BlogPost } from '@/lib/api'
import { use } from 'react'

export default function BlogPost({ params }: { params: Promise<{ year: string; month: string; slug: string }> }) {
  const { year, month, slug } = use(params)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`/api/blog/${year}/${month}/${slug}`)
        if (response.ok) {
          const blogPost = await response.json()
          setPost(blogPost)
        } else {
          setPost(null)
        }
      } catch (error) {
        console.error('Error loading post:', error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [year, month, slug])

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="section-container max-w-4xl">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading article...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen py-12">
        <div className="section-container max-w-4xl">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">404</div>
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The article you're looking for doesn't exist.
            </p>
            <Link href="/blog" className="btn-primary">
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const keywordTags = getTags(post.Keywords)
  const categories = Array.isArray(post.Category) ? post.Category : post.Category?.Value || []
  const categoryTags = categories.map(cat => cat.Name) || []
  const allTags = [...keywordTags, ...categoryTags]

  const introText = typeof post.IntroText === 'string' ? post.IntroText : post.IntroText?.Value || ''
  const bodyText = typeof post.BodyText === 'string' ? post.BodyText : post.BodyText?.Value || ''
  const twitterCardImage = typeof post.TwitterCardImage === 'string' ? post.TwitterCardImage : post.TwitterCardImage?.Value

  return (
    <div className="min-h-screen py-12">
      <article className="section-container max-w-4xl">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to blog</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {allTags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {post.Name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar size={18} />
              <time dateTime={post.StartPublish}>{formatDate(post.StartPublish)}</time>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={18} />
              <span>{calculateReadTime(post.BodyText)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
                DK
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">David Knipe</div>
                <div className="text-sm">VP of Solution Architecture @ Optimizely</div>
              </div>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex items-center space-x-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Share:</span>
            <button
              onClick={() => {
                const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.Name)}`
                window.open(url, '_blank')
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Share on X"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            <button
              onClick={() => {
                const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
                window.open(url, '_blank')
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <Linkedin size={20} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                alert('Link copied to clipboard!')
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Copy link"
            >
              <Share2 size={20} />
            </button>
          </div>
        </motion.header>

        {/* Featured Image */}
        {twitterCardImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 rounded-2xl overflow-hidden"
          >
            <img
              src={twitterCardImage}
              alt={post.Name}
              className="w-full h-auto"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          {/* Intro Text */}
          {introText && (
            <div
              className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-8"
              dangerouslySetInnerHTML={{ __html: introText }}
            />
          )}

          {/* Main Body */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: bodyText }}
          />
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="card bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
            <h3 className="text-2xl font-bold mb-4">Want to learn more?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Explore more articles on Optimizely, ASP.NET, and modern web development.
            </p>
            <Link href="/blog" className="btn-primary">
              View More Articles
            </Link>
          </div>
        </motion.div>
      </article>
    </div>
  )
}
