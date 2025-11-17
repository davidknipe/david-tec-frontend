'use client'

import { motion } from 'framer-motion'
import { Calendar, FileText, ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { extractDateFromUrl, type BlogPost } from '@/lib/api'

interface Post {
  title: string
  slug: string
  date: string
  month: string
  year: string
}

interface YearArchive {
  year: number
  posts: Post[]
}

function ArchiveContent() {
  const searchParams = useSearchParams()
  const yearParam = searchParams.get('year')
  const yearRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  const [archiveData, setArchiveData] = useState<YearArchive[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedYears, setExpandedYears] = useState<number[]>([])

  useEffect(() => {
    async function loadArchive() {
      try {
        const response = await fetch('/api/blog')
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts')
        }
        const posts: BlogPost[] = await response.json()

        // Group posts by year
        const postsByYear: { [year: number]: Post[] } = {}

        posts.forEach(post => {
          const dateInfo = extractDateFromUrl(post.Url)
          const year = parseInt(dateInfo?.year || '2024')
          const slug = post.Url.split('/').filter(Boolean).pop() || ''

          // Extract month and day from StartPublish date
          const publishDate = new Date(post.StartPublish)
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const monthName = monthNames[publishDate.getMonth()]
          const day = publishDate.getDate().toString().padStart(2, '0')

          if (!postsByYear[year]) {
            postsByYear[year] = []
          }

          postsByYear[year].push({
            title: post.Name,
            slug,
            date: `${monthName} ${day}`,
            month: dateInfo?.month || '01',
            year: dateInfo?.year || '2024'
          })
        })

        // Convert to array and sort by year (descending)
        const archiveArray: YearArchive[] = Object.keys(postsByYear)
          .map(year => ({
            year: parseInt(year),
            posts: postsByYear[parseInt(year)]
          }))
          .sort((a, b) => b.year - a.year)

        setArchiveData(archiveArray)

        // If a year parameter is provided, expand that year
        // Otherwise, expand the two most recent years by default
        if (yearParam) {
          const targetYear = parseInt(yearParam)
          setExpandedYears([targetYear])
        } else if (archiveArray.length > 0) {
          setExpandedYears([archiveArray[0].year, archiveArray[1]?.year].filter(Boolean))
        }
      } catch (error) {
        console.error('Error loading archive:', error)
        setArchiveData([])
      } finally {
        setLoading(false)
      }
    }
    loadArchive()
  }, [yearParam])

  // Scroll to the year section when data is loaded and year param exists
  useEffect(() => {
    if (!loading && yearParam && archiveData.length > 0) {
      const targetYear = parseInt(yearParam)
      setTimeout(() => {
        const element = yearRefs.current[targetYear]
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300) // Small delay to ensure the section is expanded
    }
  }, [loading, yearParam, archiveData])

  const toggleYear = (year: number) => {
    setExpandedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    )
  }

  const totalPosts = archiveData.reduce((sum, year) => sum + year.posts.length, 0)
  const oldestYear = archiveData.length > 0 ? archiveData[archiveData.length - 1].year : 2009
  const newestYear = archiveData.length > 0 ? archiveData[0].year : new Date().getFullYear()

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="section-container max-w-4xl">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading archive...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="section-container max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-white mb-6 shadow-2xl">
            <Calendar size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Archive</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Browse all {totalPosts} articles organized by year
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-6">
          {archiveData.map((yearData, index) => (
            <motion.div
              key={yearData.year}
              ref={(el) => { yearRefs.current[yearData.year] = el }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              {/* Year header */}
              <button
                onClick={() => toggleYear(yearData.year)}
                className="w-full flex items-center justify-between group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                    {expandedYears.includes(yearData.year) ? (
                      <ChevronDown size={24} />
                    ) : (
                      <ChevronRight size={24} />
                    )}
                  </div>
                  <div className="text-left">
                    <h2 className="text-3xl font-bold gradient-text">{yearData.year}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {yearData.posts.length} article{yearData.posts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <FileText className="text-gray-400 group-hover:text-primary-500 transition-colors" size={24} />
              </button>

              {/* Posts list */}
              {expandedYears.includes(yearData.year) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3"
                >
                  {yearData.posts.map((post, postIndex) => (
                    <motion.div
                      key={post.slug}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: postIndex * 0.05 }}
                    >
                      <Link
                        href={`/${post.year}/${post.month}/${post.slug}`}
                        className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:gradient-text transition-all mb-1">
                              {post.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar size={14} />
                              <time>{post.date}, {yearData.year}</time>
                            </div>
                          </div>
                          <ChevronRight className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" size={20} />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Stats footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 glass rounded-2xl text-center"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Archive spans from <strong className="text-primary-600 dark:text-primary-400">{oldestYear}</strong> to{' '}
            <strong className="text-primary-600 dark:text-primary-400">{newestYear}</strong> with{' '}
            <strong className="text-primary-600 dark:text-primary-400">{totalPosts}</strong> articles
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function ArchivePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-12">
        <div className="section-container max-w-4xl">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading archive...</p>
          </div>
        </div>
      </div>
    }>
      <ArchiveContent />
    </Suspense>
  )
}
