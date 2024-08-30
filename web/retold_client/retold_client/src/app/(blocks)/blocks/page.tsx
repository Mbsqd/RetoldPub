import { BlockList } from '@/components/forms/blocks/BlockList'
import CreateBlock from '@/components/forms/blocks/CreateBlock'
import { isAuth } from '@/lib/auth'
import { Metadata } from 'next'
import Image from "next/image";
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: "Блоки",
	description: "Retold - панель керування блоками.",
	icons: {
		icon: "/icon.ico"
	},
	twitter: {
		card: "summary_large_image",
		title: "Блоки",
		description: "Retold - панель керування блоками.",
		images: ["https://retold.com.ua/og-small-logo.png"],
	},
	openGraph: {
		type: "website",
		url: "https://retold.com.ua/blocks",
		title: "Блоки",
		description: "Retold - панель керування блоками.",
		siteName: "Retold",
		images: [
			{
				url: "https://retold.com.ua/opengraph-image.png",
				alt: "Retold OpenGraph Image",
			},
		],
	},
};

export default function BlocksPage() {
	if (!isAuth()) {
		redirect('/signin'); 
	}

	return (
		<div className='w-full flex flex-col justify-start items-center my-10'>
			<div className="w-full max-w-4xl flex flex-col items-start space-y-2">
				<h1 className="text-xl md:text-2xl ml-4">Панель керування блоками</h1>
				<CreateBlock/>
			</div>
			
			<Image src="/big-divide-line.svg" width="0" height="0" style={{ width: "auto", height: "2px"}} alt="Divide line" className='my-8 px-2 md:w-[961px] md:h-[2px]'/>

			<BlockList/>
		</div>
	)
}