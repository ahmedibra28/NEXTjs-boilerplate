import FormContainer from '@/components/FormContainer'
import Link from 'next/link'

export default function NotFound() {
  return (
    // <FormContainer title='404'>
    <h1 className='text-red-500 text-center'>
      Welcome to
      <a href='https://nextjs.org' target='_blank'>
        <strong> Next.JS 13 </strong>
      </a>
      boilerplate
    </h1>
    // </FormContainer>

    // <div>
    //   <h2>Not Founds</h2>
    //   <p>Could not find requested resource</p>
    //   <p>
    //     View <Link href='/blog'>all posts</Link>
    //   </p>
    // </div>
  )
}
