import FormContainer from '@/components/form-container'

export default function Home() {
  return (
    <FormContainer title='Home'>
      <h1 className='text-center text-gray-500'>
        Welcome to
        <a href='https://nextjs.org' target='_blank'>
          <strong> Next.JS 15 </strong>
        </a>
        boilerplate
      </h1>
    </FormContainer>
  )
}
