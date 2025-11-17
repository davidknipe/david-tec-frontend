'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Code2, Wrench, BookOpen, Sparkles, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { BlogCard } from '@/components/BlogCard'
import { TagCloud } from '@/components/TagCloud'
import { calculateReadTime, formatDate, getTags, extractDateFromUrl, type BlogPost } from '@/lib/api'

const popularTags = [
  { name: 'Optimizely', count: 69 },
  { name: 'EPiServer', count: 45 },
  { name: 'ASP.NET', count: 38 },
  { name: 'CMS', count: 32 },
  { name: 'Architecture', count: 28 },
  { name: 'Commerce', count: 24 },
  { name: 'AI', count: 18 },
  { name: 'TypeScript', count: 15 },
  { name: 'Cloud', count: 12 },
]

const features = [
  {
    icon: Code2,
    title: 'Technical Deep Dives',
    description: 'In-depth articles on Optimizely, ASP.NET, and modern web development patterns.',
  },
  {
    icon: Wrench,
    title: 'Open Source Tools',
    description: 'Practical tools like the NuGet Explorer to help you discover and explore packages.',
  },
  {
    icon: BookOpen,
    title: 'Real-World Solutions',
    description: 'Solutions to actual problems encountered in enterprise development.',
  },
]

const stats = [
  { icon: TrendingUp, label: 'Years of Experience', value: '25+' },
  { icon: BookOpen, label: 'Articles Published', value: '100+' },
  { icon: Users, label: 'Community Reach', value: '10K+' },
]

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<any[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  useEffect(() => {
    async function loadLatestPosts() {
      try {
        const response = await fetch('/api/blog')
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts')
        }
        const posts: BlogPost[] = await response.json()
        // Get the 2 most recent posts
        const latest = posts.slice(0, 2).map(post => {
          const dateInfo = extractDateFromUrl(post.Url)
          const slug = post.Url.split('/').filter(Boolean).pop() || ''
          const keywordTags = getTags(post.Keywords)
          const categories = Array.isArray(post.Category) ? post.Category : post.Category?.Value || []
          const categoryTags = categories.map(cat => cat.Name) || []
          const tags = Array.from(new Set([...keywordTags, ...categoryTags])).slice(0, 5)
          const description = typeof post.Description === 'string' ? post.Description : post.Description?.Value || ''
          const introText = typeof post.IntroText === 'string' ? post.IntroText : post.IntroText?.Value || ''
          const image = typeof post.TwitterCardImage === 'string' ? post.TwitterCardImage : post.TwitterCardImage?.Value

          return {
            title: post.Name,
            excerpt: description || introText.substring(0, 150) || '',
            date: formatDate(post.StartPublish),
            readTime: calculateReadTime(post.BodyText),
            slug,
            year: dateInfo?.year || '2024',
            month: dateInfo?.month || '01',
            image,
            tags,
          }
        })
        setLatestPosts(latest)
      } catch (error) {
        console.error('Error loading posts:', error)
        setLatestPosts([])
      } finally {
        setLoadingPosts(false)
      }
    }
    loadLatestPosts()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 py-20 md:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/30 dark:bg-primary-600/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-6"
            >
              <Sparkles size={20} className="text-primary-500" />
              <span className="text-sm font-medium">VP of Solution Architecture @ Optimizely</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Building the Future</span>
              <br />
              <span className="text-gray-900 dark:text-white">of AI driven Digital Experiences</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Technical insights on Optimizely and modern web architecture.
              From enterprise solutions to bleeding-edge AI integrations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/blog" className="btn-primary">
                Explore Articles
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link href="/nuget-explorer" className="btn-secondary">
                Try NuGet Explorer
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <stat.icon size={24} className="text-primary-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What You'll Find Here
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Practical knowledge from the trenches of enterprise development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card text-center"
            >
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-white mb-6 shadow-lg">
                <feature.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="section-container py-20">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2">Latest Articles</h2>
            <p className="text-gray-600 dark:text-gray-400">Fresh insights and technical guides</p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all"
          >
            <span>View all</span>
            <ArrowRight size={20} />
          </Link>
        </div>

        {loadingPosts ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link href="/blog" className="btn-primary">
            View All Articles
          </Link>
        </div>
      </section>

      {/* Tag Cloud Section */}
      <section className="section-container py-20">
        <TagCloud tags={popularTags} />
      </section>

      {/* CTA Section */}
      <section className="section-container py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-purple-700 p-12 md:p-16 text-white text-center"
        >
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get the latest articles on Optimizely, ASP.NET, and modern web development delivered to your feed reader.
            </p>
            <Link
              href="/rss"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <span>Subscribe via RSS</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
