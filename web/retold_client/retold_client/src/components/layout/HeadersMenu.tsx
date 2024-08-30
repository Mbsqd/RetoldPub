'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface HeaderClientProps {
	authenticated: boolean;  
}

export const HeaderMenu: React.FC<HeaderClientProps> = ( { authenticated } ) => {
	const router = useRouter();

	const handlerLogout = async () => {
		try {
			const response = await fetch("/api/Authorization/logout", {
				method: "POST",
				credentials: "include",
			});

			if(!response.ok) {
				throw new Error("Server is not responding");
			}

			router.refresh();
		} catch(error) {
			console.error(error);
		}
	}

	return(
		<>
			{authenticated ? (
			<nav className='flex items-center justify-between gap-9'>
					<Link className='text-lg' href="/profile">Профіль</Link>
				<div className='border border-retro-black rounded-xl hover:shadow-xl transition-shadow ease-out duration-500'>
					<button className='block text-lg py-1.5 px-6' onClick={handlerLogout}>Вихід</button>
				</div>
			</nav>
			):(
			<nav className='flex items-center justify-between gap-9'>
					<Link className='text-lg' href="/signup">Реєстрація</Link>
				<div className='border border-retro-black rounded-xl hover:shadow-xl transition-shadow ease-out duration-500'>
					<Link className='block text-lg py-1.5 px-6' href="/signin">Вхід</Link>
				</div>
			</nav>
			)}
		</>
	)
}