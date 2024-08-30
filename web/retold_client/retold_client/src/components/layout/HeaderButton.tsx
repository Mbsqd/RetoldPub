'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import Image from "next/image";
import Link from 'next/link'


  interface HeaderClientProps {
	authenticated: boolean;  
}

export const HeaderButton: React.FC<HeaderClientProps> = ( { authenticated } ) => {
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
	
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='border border-retro-black rounded-xl'>
				<div className='block text-lg py-3 px-6'><Image src='/menu-bars.svg' alt='Menu bars' width="0" height="0" style={{ width: "23px", height: "auto"}}/></div>
			</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuLabel>Меню</DropdownMenuLabel>
			<DropdownMenuSeparator />
			{authenticated ? (
				<>
					<DropdownMenuItem><Link href="/blocks">Панель керування</Link></DropdownMenuItem>
					<DropdownMenuItem><Link href="/profile">Профіль</Link></DropdownMenuItem>
					<DropdownMenuItem><button onClick={handlerLogout}>Вихід</button></DropdownMenuItem>
				</>
			) : (
				<>
					<DropdownMenuItem><Link href="/blocks">Панель керування</Link></DropdownMenuItem>
					<DropdownMenuItem><Link href="/signin">Вхід</Link></DropdownMenuItem>
					<DropdownMenuItem><Link href="/signup">Реєстрація</Link></DropdownMenuItem>
				</>
			)}

		</DropdownMenuContent>
		</DropdownMenu>
	)
}