// Types for the Optimizely API response
export interface BlogPost {
  Name: string
  Url: string
  Description?: { Value: string; PropertyDataType: string } | string
  IntroText?: { Value: string; PropertyDataType: string } | string
  BodyText?: { Value: string; PropertyDataType: string } | string
  Keywords?: { Value: string; PropertyDataType: string } | string
  Category?: Array<{
    Id?: number
    Name: string
    Description?: string
  }> | { Value: Array<{ Name: string }>; PropertyDataType: string }
  StartPublish: string
  Created: string
  Changed: string
  TwitterCardImage?: { Value: string; PropertyDataType: string } | string
  ContentLink: {
    Id: number
    GuidValue: string
  }
}

export interface ApiResponse {
  TotalMatching: number
  Results: BlogPost[]
}

// Fetch all blog posts with pagination
export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  const baseUrl = 'https://david-tec-api-proxy.david-tec.workers.dev/search/content/'
  const params = new URLSearchParams({
    filter: "ContentType/any(t:t eq 'BlogPostPage')",
    orderby: 'StartPublish desc',
    personalize: 'true',
  })

  let allPosts: BlogPost[] = []
  let skip = 0
  const top = 100
  let totalMatching = 0

  try {
    // First request to get total count
    const firstUrl = `${baseUrl}?${params.toString()}&skip=${skip}&top=${top}`
    const firstResponse = await fetch(firstUrl, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!firstResponse.ok) {
      throw new Error(`API request failed: ${firstResponse.status}`)
    }

    const firstData: ApiResponse = await firstResponse.json()
    totalMatching = firstData.TotalMatching
    allPosts = [...firstData.Results]

    // Fetch remaining pages
    while (allPosts.length < totalMatching) {
      skip += top
      const url = `${baseUrl}?${params.toString()}&skip=${skip}&top=${top}`
      const response = await fetch(url, {
        next: { revalidate: 3600 },
      })

      if (!response.ok) {
        console.error(`Failed to fetch page at skip=${skip}`)
        break
      }

      const data: ApiResponse = await response.json()
      allPosts = [...allPosts, ...data.Results]
    }

    return allPosts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Get a single blog post by URL path
export async function getBlogPostByUrl(year: string, month: string, slug: string): Promise<BlogPost | null> {
  const posts = await fetchAllBlogPosts()

  // Try both with and without trailing slash to be flexible
  const urlPath1 = `/${year}/${month}/${slug}/`
  const urlPath2 = `/${year}/${month}/${slug}`

  const post = posts.find(p => {
    const normalizedUrl = p.Url.toLowerCase().replace(/\/$/, '') // Remove trailing slash
    const normalizedPath1 = urlPath1.toLowerCase().replace(/\/$/, '')
    const normalizedPath2 = urlPath2.toLowerCase().replace(/\/$/, '')
    return normalizedUrl === normalizedPath1 || normalizedUrl === normalizedPath2
  })

  return post || null
}

// Calculate read time from HTML content
export function calculateReadTime(html?: { Value: string; PropertyDataType: string } | string): string {
  if (!html) return '1 min read'

  // Handle both object format (from API) and string format
  const htmlString = typeof html === 'string' ? html : html.Value

  if (!htmlString) return '1 min read'

  // Remove HTML tags and count words
  const text = htmlString.replace(/<[^>]*>/g, ' ')
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200) // Average reading speed: 200 words/min
  return `${minutes} min read`
}

// Extract year and month from URL
export function extractDateFromUrl(url: string): { year: string; month: string } | null {
  const match = url.match(/\/(\d{4})\/(\d{2})\//)
  if (match) {
    return { year: match[1], month: match[2] }
  }
  return null
}

// Format date string
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
}

// Get tags from Keywords field
export function getTags(keywords?: { Value: string; PropertyDataType: string } | string): string[] {
  if (!keywords) return []

  // Handle both object format (from API) and string format
  const keywordString = typeof keywords === 'string' ? keywords : keywords.Value

  if (!keywordString) return []
  return keywordString.split(',').map(tag => tag.trim()).filter(Boolean)
}

// Sanitize HTML (basic implementation - consider using DOMPurify for production)
export function sanitizeHtml(html: string): string {
  // Basic sanitization - allows common HTML tags
  // In production, consider using a library like DOMPurify
  return html
}
