import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import useProfilesHook from '../../../utils/api/profiles'
import { Spinner, Pagination, Message } from '../../../components'

import TableView from '../../../components/TableView'

const UserProfiles = () => {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const { getUserProfiles } = useProfilesHook({
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

  // TableView
  const table = {
    header: ['Name', 'Address', 'Phone', 'Email'],
    body: ['name', 'address', 'phone', 'user.email'],
    createdAt: 'createdAt',
    image: 'image',
    data: data,
  }

  const name = 'User Profiles List'
  const label = 'User Profile'
  const modal = 'userProfile'
  const searchPlaceholder = 'Search by name'
  const addBtn = false

  return (
    <>
      <Head>
        <title>User Profiles</title>
        <meta property='og:title' content='User Profiles' key='title' />
      </Head>

      <div className='ms-auto text-end'>
        <Pagination data={table.data} setPage={setPage} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <TableView
          table={table}
          searchHandler={searchHandler}
          name={name}
          modal={modal}
          label={label}
          setQ={setQ}
          q={q}
          searchPlaceholder={searchPlaceholder}
          searchInput={true}
          addBtn={false}
        />
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(UserProfiles)), {
  ssr: false,
})
