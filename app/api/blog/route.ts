import { NextResponse } from 'next/server'
import type { BlogPost, ApiResponse } from '@/lib/api'

export async function GET() {
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
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!firstResponse.ok) {
      return NextResponse.json(
        { error: `API request failed: ${firstResponse.status}` },
        { status: firstResponse.status }
      )
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

    return NextResponse.json(allPosts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}
