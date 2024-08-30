import UserProfile from '@/components/forms/ProfileForm'
import { isAuth } from '@/lib/auth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: "Профіль",
	description: "Retold - профіль користувача.",
	icons: {
		icon: "/icon.ico"
	},
	twitter: {
		card: "summary_large_image",
		title: "Профіль",
		description: "Retold - профіль користувача.",
		images: ["https://retold.com.ua/og-small-logo.png"],
	},
	openGraph: {
		type: "website",
		url: "https://retold.com.ua/profile",
		title: "Профіль",
		description: "Retold - профіль користувача.",
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
	if (!isAuth()) {
		redirect('/signin'); 
	}

	return(
		<UserProfile/>
	)
}
