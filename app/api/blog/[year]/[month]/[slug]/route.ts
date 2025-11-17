import { NextResponse } from 'next/server'
import type { BlogPost } from '@/lib/api'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ year: string; month: string; slug: string }> }
) {
  const { year, month, slug } = await params

  const baseUrl = 'https://david-tec-api-proxy.david-tec.workers.dev/search/content/'
  const filterParams = new URLSearchParams({
    filter: "ContentType/any(t:t eq 'BlogPostPage')",
    orderby: 'StartPublish desc',
    personalize: 'true',
  })

  try {
    // Fetch all posts (this will be cached by Next.js)
    const response = await fetch(`${baseUrl}?${filterParams.toString()}&skip=0&top=200`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `API request failed: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const posts: BlogPost[] = data.Results

    // Try to find the post with flexible URL matching
    const urlPath1 = `/${year}/${month}/${slug}/`
    const urlPath2 = `/${year}/${month}/${slug}`

    const post = posts.find(p => {
      const normalizedUrl = p.Url.toLowerCase().replace(/\/$/, '')
      const normalizedPath1 = urlPath1.toLowerCase().replace(/\/$/, '')
      const normalizedPath2 = urlPath2.toLowerCase().replace(/\/$/, '')
      return normalizedUrl === normalizedPath1 || normalizedUrl === normalizedPath2
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}
