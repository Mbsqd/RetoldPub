import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex flex-col  my-auto'>
      <div className='flex flex-col  items-center'>
        <h2 className='text-2xl ml-4'>Помилка 404</h2>
        <p>Вибачте, але запитувана сторінка не існує.</p>
        <Link href="/">Повернутися на головну</Link>
      </div>
    </div>
  )
}