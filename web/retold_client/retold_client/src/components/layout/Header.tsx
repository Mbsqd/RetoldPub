import Link from "next/link";
import { isAuth } from '@/lib/auth'
import { HeaderMenu } from './HeadersMenu'
import { HeaderButton } from './HeaderButton'


const Header = () => {
	const authenticated = isAuth();

	return (
		<header className="h-16 w-full bg-retro-white drop-shadow">
			<div className='flex items-center justify-between max-w-7xl mx-auto px-2.5 h-full'>
				<div className='gap-2.5'>
					<Link className='text-2xl' href="/">./Retold</Link>
				</div>

				<div className='hidden md:block'>
					<Link className="" href="/blocks">Панель керування блоками</Link>
				</div>
				<div className='hidden md:block'>
					<HeaderMenu authenticated={authenticated}/>
				</div>

				<div className='block md:hidden'>
					<HeaderButton authenticated={authenticated}/>
				</div>
			</div>
		</header>
	);
};

export default Header;
