import FormContainer from '@/components/FormContainer'

export default function Home() {
  return (
    <FormContainer title='Home'>
      <h1 className='text-gray-500 text-center'>
        Welcome to
        <a href='https://nextjs.org' target='_blank'>
          <strong> Next.JS 14 </strong>
        </a>
        boilerplate
      </h1>
    </FormContainer>
  )
}
