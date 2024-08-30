export default function ProfileLayout({ children } : {
	readonly children: React.ReactNode;
}) {
	return (
		<div className=' bg-retro-white flex items-center justify-center'>
			{ children }
		</div>
	)
}