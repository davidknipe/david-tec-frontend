import { redirect } from 'next/navigation'

interface PageProps {
  params: {
    year: string
  }
}

export default function YearPage({ params }: PageProps) {
  // Redirect to the archive page with the year parameter
  redirect(`/archive?year=${params.year}`)
}
