import { SignupForm } from "@/components/forms/SignupForm";
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: "Реєстрація",
	description: "Retold - сторінка реєстрації.",
	icons: {
		icon: "/icon.ico"
	},
	twitter: {
		card: "summary_large_image",
		title: "Реєстрація",
		description: "Retold - сторінка реєстрації.",
		images: ["https://retold.com.ua/og-small-logo.png"],
	},
	openGraph: {
		type: "website",
		url: "https://retold.com.ua/signup",
		title: "Реєстрація",
		description: "Retold - сторінка реєстрації.",
		siteName: "Retold",
		images: [
			{
				url: "https://retold.com.ua/opengraph-image.png",
				alt: "Retold OpenGraph Image",
			},
		],
	},
};

export default function SignUpRoute() {
	return(
		<SignupForm/>
	)
}