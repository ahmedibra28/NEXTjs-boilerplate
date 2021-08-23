import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Head from 'next/head'
import Message from '../../components/Message'
import Pagination from '../../components/Pagination'
import moment from 'moment'
import { getUsersLog } from '../../api/users'
import { useQuery, useQueryClient } from 'react-query'

import Loader from 'react-loader-spinner'

const Logon = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const queryClient = useQueryClient()

  const { data, error, isLoading, isError } = useQuery(
    'users-log',
    () => getUsersLog(page),
    {
      retry: 0,
    }
  )

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('users-log')
    }
    refetch()
  }, [page, queryClient])

  return (
    <>
      <Head>
        <title>Users Logon</title>
        <meta property='og:title' content='Users Logon' key='title' />
      </Head>
      <div className='d-flex justify-content-between align-items-center'>
        <h3 className=''>Users Log</h3>
        <Pagination data={data} setPage={setPage} />
      </div>

      <input
        type='text'
        className='form-control text-info '
        placeholder='Search by Email or Name'
        name='search'
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
        autoFocus
        required
      />

      {isLoading ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div className='table-responsive'>
            <table className='table table-sm hover bordered striped caption-top '>
              <caption>{!isLoading && data.total} records were found</caption>
              <thead>
                <tr>
                  <th>LOG ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>LOGIN DATE</th>
                  <th>LOGIN TIME</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  data.data.map(
                    (log) =>
                      log.user &&
                      log.user.email.includes(search.trim()) && (
                        <tr key={log._id}>
                          <td>{log._id}</td>
                          <td>{log.user && log.user.name}</td>
                          <td>
                            <a href={`mailto:${log.user && log.user.email}`}>
                              {log.user && log.user.email}
                            </a>
                          </td>
                          <td>{moment(log.createdAt).format('YYYY-MM-DD')}</td>
                          <td>{moment(log.createdAt).format('HH:mm:ss')}</td>
                        </tr>
                      )
                  )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Logon)), { ssr: false })
