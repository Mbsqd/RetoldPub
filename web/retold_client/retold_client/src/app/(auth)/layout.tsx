export default function AuthLayout({ children } : {
	readonly children: React.ReactNode;
}) {
	return (
		<div className=' bg-retro-white flex items-center justify-center'>
			{ children }
		</div>
	)
}

// bg-retro-white flex flex-col items-center justify-center min-h-screen