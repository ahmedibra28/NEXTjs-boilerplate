import FormContainer from '@/components/form-container'
import Navigation from '@/components/navigation'
import Link from 'next/link'
import meta from '@/lib/meta'
import { logo, siteName } from '@/lib/setting'

export const metadata = meta({
  title: `${siteName} - 404`,
  description: `This page does not exist at ${siteName}.`,
  openGraphImage: logo,
})

export default function NotFound() {
  return (
    <>
      <FormContainer title='404'>
        <h1 className='text-red-500 text-center'>This page does not exist.</h1>
        <h2 className='text-red-500 text-center'>
          Please go back to the home page.
        </h2>

        <div className='text-center my-3'>
          <Link href='/' className='btn btn-outline btn-primary'>
            Go Back
          </Link>
        </div>
      </FormContainer>
    </>
  )
}
