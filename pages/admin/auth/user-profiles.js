import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import useUserProfilesHook from '../../../utils/api/profiles'
import {
  Spinner,
  ViewUserProfiles,
  Pagination,
  Message,
} from '../../../components'

const UserProfiles = () => {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const { getUserProfiles } = useUserProfilesHook({
    page,
    q,
  })

  const { data, isLoading, isError, error, refetch } = getUserProfiles

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!q) refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e) => {
    e.preventDefault()
    refetch()
    setPage(1)
  }

  return (
    <>
      <Head>
        <title>User Profiles</title>
        <meta property='og:title' content='User Profiles' key='title' />
      </Head>

      <div className='ms-auto text-end'>
        <Pagination data={data} setPage={setPage} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <ViewUserProfiles
          data={data}
          setQ={setQ}
          q={q}
          searchHandler={searchHandler}
        />
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(UserProfiles)), {
  ssr: false,
})
