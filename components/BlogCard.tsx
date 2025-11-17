'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface BlogCardProps {
  title: string
  excerpt: string
  date: string
  readTime: string
  slug: string
  year: string
  month: string
  image?: string
  tags?: string[]
}

export function BlogCard({ title, excerpt, date, readTime, slug, year, month, image, tags }: BlogCardProps) {
  const blogUrl = `/${year}/${month}/${slug}`
  return (
    <Link href={blogUrl}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="card group cursor-pointer"
      >
        {image && (
          <div className="relative h-48 -mx-6 -mt-6 mb-6 rounded-t-2xl overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            <time dateTime={date}>{date}</time>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>{readTime}</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-3 group-hover:gradient-text transition-all duration-300">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {excerpt}
        </p>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          <span>Read article</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.article>
    </Link>
  )
}
