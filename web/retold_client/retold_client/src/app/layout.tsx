import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const jetBrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	style: ["normal", "italic"],
});

export const metadata: Metadata = {
	title: "Retold",
	description: "Retold - інструмент, який набагато ефективніший за ведення розкладу в Excel таблиці чи Word документі. В Retold ви можете легко створювати та підтримувати розклад занять і консультацій та переглядати його за допомогою телеграму.",
	icons: {
		icon: "/icon.ico"
	},
	twitter: {
		card: "summary_large_image",
		title: "Retold",
		description: "Retold - інструмент, який набагато ефективніший за ведення розкладу в Excel таблиці чи Word документі. В Retold ви можете легко створювати та підтримувати розклад занять і консультацій та переглядати його за допомогою телеграму.",
		images: ["https://retold.com.ua/og-small-logo.png"],
	},
	openGraph: {
		type: "website",
		url: "https://retold.com.ua",
		title: "Retold",
		description: "Retold - інструмент, який набагато ефективніший за ведення розкладу в Excel таблиці чи Word документі. В Retold ви можете легко створювати та підтримувати розклад занять і консультацій та переглядати його за допомогою телеграму.",
		siteName: "Retold",
		images: [
			{
				url: "https://retold.com.ua/opengraph-image.png",
				alt: "Retold OpenGraph Image",
			},
		],
	},
	alternates: {
		canonical: "https://retold.com.ua",
	},
	metadataBase: new URL("https://retold.com.ua"),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className='w-full'>
			<body className={`${jetBrainsMono.className} bg-retro-white flex flex-col min-h-screen w-full`}>
				<Header />
				<main className="flex flex-grow flex-col justify-start items-center">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
