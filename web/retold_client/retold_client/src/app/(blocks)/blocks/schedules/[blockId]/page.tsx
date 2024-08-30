import ScheduleTable from '@/components/tables/schedule/Table'
import { isAuth } from '@/lib/auth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: "Заняття",
	description: "Retold - панель керування розкладом занять.",
	icons: {
		icon: "/icon.ico"
	},
	twitter: {
		card: "summary_large_image",
		title: "Заняття",
		description: "Retold - панель керування розкладом занять.",
		images: ["https://retold.com.ua/og-small-logo.png"],
	},
	openGraph: {
		type: "website",
		url: "https://retold.com.ua/blocks/schedules",
		title: "Заняття",
		description: "Retold - панель керування розкладом занять.",
		siteName: "Retold",
		images: [
			{
				url: "https://retold.com.ua/opengraph-image.png",
				alt: "Retold OpenGraph Image",
			},
		],
	},
};

export default async function SchedulePage( { params } : { params: { blockId: number } } ) {
	if (!isAuth()) {
		redirect('/signin'); 
	}
	
	return(
		<ScheduleTable blockId={params.blockId}/>
	)
  }