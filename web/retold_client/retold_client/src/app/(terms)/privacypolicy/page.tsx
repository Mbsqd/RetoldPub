import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: "Політика конфіденційності",
	description: "Retold - політика конфіденційності.",
	icons: {
		icon: "/icon.ico"
	},
	twitter: {
		card: "summary_large_image",
		title: "Політика конфіденційності",
		description: "Retold - політика конфіденційності.",
		images: ["https://retold.com.ua/og-small-logo.png"],
	},
	openGraph: {
		type: "website",
		url: "https://retold.com.ua/privacypolicy",
		title: "Політика конфіденційності",
		description: "Retold - політика конфіденційності.",
		siteName: "Retold",
		images: [
			{
				url: "https://retold.com.ua/opengraph-image.png",
				alt: "Retold OpenGraph Image",
			},
		],
	},
};

export default function PrivacyPolicy() {
	return (
		<div className="container max-w-7xl mx-auto px-4 py-10">
		<h1 className="text-3xl font-bold mb-4">Політика конфіденційності</h1>
		<h3 className='text-xl font-medium'>Вступ</h3>
		<p>Ця Політика конфіденційності описує, як "Retold" («ми», «наш») збирає, використовує і захищає персональні дані, які ви надаєте під час використання нашого сайту retold.com.ua</p>

		
		<h3 className='text-xl font-medium pt-4'>Збір даних</h3>
		<p>Ми можемо збирати такі типи персональних даних:</p>
		<ul className='pl-4'>
			<li> - Інформація, що надається вами: <p className='pl-6'>Наприклад, логін, адреса електронної пошти та інші дані, які ви вводите на нашому сайті.</p></li>
			<li> - Автоматично збирається інформація: <p className='pl-6'>IP-адреса, тип браузера, операційна система, інформація про те, як ви використовуєте наш сайт (наприклад, сторінки, які ви відвідуєте).</p></li>
		</ul>

		<h3 className='text-xl font-medium pt-4'>Використання даних</h3>
		<p>Ми можемо використовувати ваші персональні дані для таких цілей:</p>
		<ul className='pl-4'>
			<li> - Надання послуг: <p className='pl-6'>Обробка ваших запитів, реєстрація на сайті, надання доступу до сервісів.</p></li>
			<li> - Комунікація: <p className='pl-6'>Відправлення вам повідомлень, оновлень або повідомлень, пов'язаних з використанням нашого сайту.</p></li>
		</ul>

		<h3 className='text-xl font-medium pt-4'>Безпека даних</h3>
		<p>Ми вживаємо заходів для захисту ваших персональних даних від несанкціонованого доступу, втрати або зміни. Однак жоден метод передачі даних через інтернет не є повністю безпечним, і ми не можемо гарантувати абсолютну безпеку ваших даних.</p>

		<h3 className='text-xl font-medium pt-4'>Файли cookie</h3>
		<p>Ми використовуємо файли cookie для управління сеансами користувачів, а також для надання персоналізованих функцій. Ви можете налаштувати свій браузер так, щоб він відхиляв усі файли cookie або повідомляв вас, коли файл cookie відправляється.</p>

		<h3 className='text-xl font-medium pt-4'>Зберігання даних</h3>
		<p>Ми зберігаємо ваші персональні дані тільки доти, доки це необхідно для виконання цілей, описаних у цій політиці конфіденційності.</p>

		<h3 className='text-xl font-medium pt-4'>Зміни в Політиці конфіденційності</h3>
		<p>Ми можемо оновлювати цю Політику конфіденційності час від часу. Оновлення будуть публікуватися на цій сторінці.</p>

		<h3 className='text-xl font-medium pt-4'>Контактна інформація</h3>
		<p>Якщо у вас є питання з приводу цієї політики конфіденційності, зв'яжіться з нами за адресою: <Link className='text-retro-blue' href="https://t.me/mbsqd001">@mbsqd001</Link></p>
	  </div>
	)
}