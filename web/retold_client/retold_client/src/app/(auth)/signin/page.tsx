import { SigninForm } from '@/components/forms/SigninForm'
import { isAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: "Вхід",
	description: "Retold - сторінка авторизації.",
	icons: {
		icon: "/icon.ico"
	},
	twitter: {
		card: "summary_large_image",
		title: "Вхід",
		description: "Retold - сторінка авторизації.",
		images: ["https://retold.com.ua/og-small-logo.png"],
	},
	openGraph: {
		type: "website",
		url: "https://retold.com.ua/signin",
		title: "Вхід",
		description: "Retold - сторінка авторизації.",
		siteName: "Retold",
		images: [
			{
				url: "https://retold.com.ua/opengraph-image.png",
				alt: "Retold OpenGraph Image",
			},
		],
	},
};


export default function SignInRoute() {
	if (isAuth()) {
		redirect('/'); 
	}

	return(
		<SigninForm/>
	)
}