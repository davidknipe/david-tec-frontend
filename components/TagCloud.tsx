'use client'

import { motion } from 'framer-motion'

interface Tag {
  name: string
  count: number
}

interface TagCloudProps {
  tags: Tag[]
}

export function TagCloud({ tags }: TagCloudProps) {
  const maxCount = Math.max(...tags.map(t => t.count))
  const minCount = Math.min(...tags.map(t => t.count))

  const getFontSize = (count: number) => {
    const ratio = (count - minCount) / (maxCount - minCount)
    return 0.875 + ratio * 0.75 // 14px to 24px
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6">Popular Topics</h3>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag, index) => (
          <motion.a
            key={tag.name}
            href={`/blog/tag/${tag.name.toLowerCase()}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{
              fontSize: `${getFontSize(tag.count)}rem`,
            }}
          >
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {tag.name}
            </span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
              ({tag.count})
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
