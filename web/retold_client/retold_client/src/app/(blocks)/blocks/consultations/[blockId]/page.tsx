import ConsultationTable from '@/components/tables/consultation/Table'
import { isAuth } from '@/lib/auth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: "Консультації",
	description: "Retold - панель керування розкладом консультацій.",
	icons: {
		icon: "/icon.ico"
	},
	twitter: {
		card: "summary_large_image",
		title: "Консультації",
		description: "Retold - панель керування розкладом консультацій.",
		images: ["https://retold.com.ua/og-small-logo.png"],
	},
	openGraph: {
		type: "website",
		url: "https://retold.com.ua/blocks/consultations",
		title: "Консультації",
		description: "Retold - панель керування розкладом консультацій.",
		siteName: "Retold",
		images: [
			{
				url: "https://retold.com.ua/opengraph-image.png",
				alt: "Retold OpenGraph Image",
			},
		],
	},
};

export default async function ConsultationPage( { params } : { params: { blockId: number } } ) {
	if (!isAuth()) {
		redirect('/signin'); 
	}
	
	return(
		<ConsultationTable blockId={params.blockId}/>
	)
  }