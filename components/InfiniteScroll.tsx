import { useEffect } from 'react'
import apiHook from '../api'

interface ScrollProps {
  url: string
  key: string[]
  method: string
  scrollMethod: string
}

const InfiniteScroll = ({ url, key, method, scrollMethod }: ScrollProps) => {
  const getInfiniteApi = apiHook({
    key,
    method,
    scrollMethod,
    url,
  })?.infinite

  useEffect(() => {
    let fetching = false

    const handleScroll = async ({ target }: { target: any }) => {
      const { scrollHeight, scrollTop, clientHeight } = target.scrollingElement

      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true
        if (getInfiniteApi?.hasNextPage) {
          await getInfiniteApi?.fetchNextPage()
        }
        fetching = false
      }
    }

    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getInfiniteApi?.fetchNextPage, getInfiniteApi?.hasNextPage])

  return { getInfiniteApi }
}

export default InfiniteScroll

// Other components:

// import InfiniteScroll from '../../components/InfiniteScroll'

// const { getInfiniteApi } = InfiniteScroll({
//     key: ['permissions-infinite'],
//     method: 'InfiniteScroll',
//     scrollMethod: 'GET',
//     url: `auth/permissions?q=${q}&limit=${25}`,
//   })

// {getInfiniteApi?.data?.pages?.map((page, i: number) => (
//     <React.Fragment key={i}>
//       {page?.data?.map((item: IPermission, index: number) => (.......))}
//       </React.Fragment>
// ))}

// <div onClick={getInfiniteApi?.fetchNextPage}>
//     <div>{getInfiniteApi?.isFetching ? 'fetching...' : null}</div>
// </div>
