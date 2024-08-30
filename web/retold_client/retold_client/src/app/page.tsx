import Image from "next/image";

export default function Home() {
	return (
		<main className="min-w-full">

			<div className="w-full md:h-80 py-10 bg-retro-black text-retro-white">
				<div className="h-full flex flex-col md:flex-row md:items-center md:justify-between max-w-80 md:max-w-7xl mx-auto px-2.5">
					<div className='md:max-w-md lg:max-w-xl'>
						<h1 className="font-semibold text-2xl md:w-72 text-center md:text-justify">
							Керуйте навчанням
							на кінчиках пальців!
						</h1>
						<h2 className="text-lg text-center md:text-left md:pt-14">
							Проєкт, створений для того, щоб полегшити
							організацію та управління університетським життям.
						</h2>
					</div>
					<div>
						<Image className='mx-auto pt-4' src="/big-logo.svg" width={225} height={225} alt="Retold logo" />
					</div>
				</div>
			</div>

			<div className="w-full md:h-96 py-10 bg-retro-white text-retro-black">
				<div className="h-full flex flex-col md:flex-row md:items-center md:justify-between max-w-80 md:max-w-7xl mx-auto px-2.5">
					<div className='md:max-w-sm lg:max-w-lg'>
						<p className="text-lg">
							Це зручний інструмент,
							який набагато ефективніший за використання
							розкладу в Excel таблиці чи Word документі.
							<br /> <br />
							З Retold ви зможете легко створювати 
							та підтримувати розклад занять і консультацій,
							за допомогою телеграму.
						</p>
					</div>

					<div className='hidden md:block'>
						<Image src="/telegram-connect.svg" width={587} height={330} alt="Control panel screenshot" />
					</div>

          <div className='block md:hidden py-4'>
						<Image src="/telegram-connect-small.svg" width={587} height={330} alt="Control panel screenshot" />
					</div>

				</div>
			</div>

			<div className="w-full bg-retro-black text-retro-white">
				<div className="max-w-80 md:max-w-7xl h-full mx-auto pb-14 px-3">
					<h3 className="pt-4 px-2.5 font-semibold text-2xl">Можливості Retold</h3>
					<div className="flex flex-col md:flex-row gap-10 mt-4 mx-auto px-2.5 py-8 w-full bg-gradient-to-br from-retro-white/30 to-retro-black/10 border border-retro-white/30 rounded-xl drop-shadow-white  justify-between">
						<div>
							<h3 className="font-medium text-xl max-w-60">Розклад занять та консультацій</h3>
							<p className="font-light text-lg max-w-96">
								Завдяки нашій системі, ви зможете швидко створювати та оновлювати розклад занять і консультацій, що забезпечить доступ до актуального
								розкладу у будь-який час.
							</p>
						</div>

						<div>
							<h3 className="font-medium text-xl max-w-60">Інтеграція з Telegram</h3>
							<p className="font-light text-lg max-w-96">
								Retold дозволяє інтегрувати всю інформацію з месенджером Telegram. Бот надає можливість взаємодії з розкладом, як у особистих
								повідомленнях, так і в групових чатах.
							</p>
						</div>

						<div>
							<h3 className="font-medium text-xl max-w-60">Retold - це open source проєкт</h3>
							<p className="font-light text-lg max-w-96">
								Ви можете вільно ознайомитись із кодом, внести свої покращення або запропонувати нові функції. Для того, щоб почати роботу ознайомтеся
								із керівництвом користувача.
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
