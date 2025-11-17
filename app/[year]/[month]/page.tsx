import { redirect } from 'next/navigation'

interface PageProps {
  params: {
    year: string
    month: string
  }
}

export default function YearMonthPage({ params }: PageProps) {
  // Redirect to the archive page with the year parameter
  redirect(`/archive?year=${params.year}`)
}
