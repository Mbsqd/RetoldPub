import Link from "next/link";
import Image from "next/image";

const Footer = () => {
	return (
		<footer id="section_footer" className="pb-0 mb-0 h-16 w-full bg-retro-white drop-shadow-footer-shadow overflow-hidden">
			<nav className=" md:gap-10 max-w-xs md:max-w-xl px-2.5 h-full mx-auto items-center">
				<div className='flex flex-row mx-auto items-center h-full justify-between'>

					<div className='flex flex-col md:flex-row md:gap-10 items-center'>
						<p>Retold, 2024</p>
						<Image className='hidden md:block' src="/vertical-line.svg" width="0" height="0" style={{ width: "auto", height: "40px" }} alt="Vertical line" />
						<Link href="/terms">Умови користування</Link>
						<Image className='hidden md:block' src="/vertical-line.svg" width="0" height="0" style={{ width: "auto", height: "40px" }} alt="Vertical line" />
					</div>

					<div className="hidden md:flex flex-row justify-between gap-10">
						<Link href="https://github.com/Mbsqd/RetoldPub">
							<Image src="/github-ico.svg" width={25} height={25} alt="Github link" />
						</Link>
						<Link href="https://t.me/mbsqd001">
							<Image src="/telegram-ico.svg" width={27} height={27} alt="Telegram link" />
						</Link>
					</div>

					<div className="flex md:hidden flex-row justify-between gap-6">
						<Link href="https://github.com/Mbsqd/RetoldPub">
							<Image src="/github-ico.svg" width={32} height={32} alt="Github link" />
						</Link>
						<Link href="https://t.me/mbsqd001">
							<Image src="/telegram-ico.svg" width={35} height={35} alt="Telegram link" />
						</Link>
					</div>
					
				</div>
			</nav>
		</footer>
	);
};

export default Footer;
