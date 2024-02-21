import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
  Tailwind,
} from '@react-email/components'
import * as React from 'react'

interface ResetPasswordProps {
  company: string
  token: string
  clientName: string
  osName: string
  ip: string
}

const baseUrl =
  process.env.env === 'production'
    ? `https://ahmedibra.com`
    : 'http://localhost:3000'

export const ResetPassword = ({
  company,
  token,
  clientName,
  osName,
  ip,
}: ResetPasswordProps) => (
  <Tailwind
    config={{
      theme: {
        extend: {
          colors: {
            primary: 'green',
          },
        },
      },
    }}
  >
    <Html>
      <Head />
      <Preview>Password Reset Request</Preview>
      <Body className='bg-white'>
        <Container className='px-3 mx-auto font-sans'>
          <Heading className='text-2xl font-bold text-black my-10'>
            Password Reset Request
          </Heading>

          <Text className='mb-4 text-gray-700 my-6'>
            You recently requested to reset your password for your {company}{' '}
            account. Use the button below to reset it.{' '}
            <strong className='font-bold'>
              This password reset is only valid for the next 10 minutes.
            </strong>
          </Text>

          <a
            href={baseUrl + '/auth/reset-password/' + token}
            target='_blank'
            className='bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer no-underline'
          >
            Reset your password
          </a>

          <Text className='text-gray-400 mb-5 mt-3'>
            <strong className='text-gray-900 font-bold'>
              Didn&apos;t request this?
            </strong>{' '}
            <br />
            For security, this request was received from {ip} a {osName} device
            using {clientName}. If you did not request a password reset, please
            ignore this email.
          </Text>

          <Img
            height='32'
            src={`https://github.com/ahmedibra28.png`}
            width='32'
            alt="Notion's Logo"
          />

          <Text className='text-gray-400 text-xs mt-3 mb-6'>
            Thanks,
            <br />
            <strong>{company}</strong>
          </Text>

          <br />

          <Text className='text-gray-400 text-xs mt-3 mb-6'>
            If you’re having trouble with the button above, copy and paste the
            URL below into your web browser. <br />
            <a href={baseUrl + '/auth/reset-password/' + token}>
              {baseUrl}/auth/reset-password/{token}
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  </Tailwind>
)

export default ResetPassword
