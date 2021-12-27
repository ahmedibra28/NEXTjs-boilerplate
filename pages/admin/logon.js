import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Head from 'next/head'
import Message from '../../components/Message'
import Pagination from '../../components/Pagination'
import moment from 'moment'
import useUsers from '../../api/users'
import { useQueryClient } from 'react-query'

import Loader from 'react-loader-spinner'

const Logon = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { getUsersLog } = useUsers(page)

  const queryClient = useQueryClient()

  const { data, error, isLoading, isError } = getUsersLog

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('usersLog')
    }
    refetch()
  }, [page, queryClient])

  return (
    <>
      <Head>
        <title>Users Logon</title>
        <meta property='og:title' content='Users Logon' key='title' />
      </Head>
      <div className='row mt-2'>
        <div className='col-md-4 col-6 m-auto'>
          <h3 className='fw-light font-monospace'>Users Log</h3>
        </div>
        <div className='col-md-4 col-6 m-auto'>
          <Pagination data={data} setPage={setPage} />
        </div>

        <div className='col-md-4 col-12 m-auto'>
          <input
            type='text'
            className='form-control py-2'
            placeholder='Search by Email or Name'
            name='search'
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            autoFocus
            required
          />
        </div>
      </div>

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
            <table className='table table-sm hover bordered table-striped caption-top '>
              <caption>{!isLoading && data.total} records were found</caption>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>LogIn Date</th>
                  <th>LogIn Time</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  data.data.map(
                    (log) =>
                      log.user &&
                      log.user.email.includes(search.trim()) && (
                        <tr key={log._id}>
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
