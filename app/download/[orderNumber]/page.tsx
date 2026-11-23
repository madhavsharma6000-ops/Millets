import { redirect } from 'next/navigation'

// Old links: orders are shipped now, not downloaded
export default function DownloadPage({ params }: { params: { orderNumber: string } }) {
  redirect(`/order/${params.orderNumber}`)
}
