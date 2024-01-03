import React from 'react'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar'

export const TopLoadingBar = ({ isFetching }: { isFetching?: boolean }) => {
  const ref: React.Ref<LoadingBarRef> | undefined = React.useRef(null)

  React.useEffect(() => {
    if (isFetching) ref.current?.staticStart()
    else ref.current?.complete()
  }, [isFetching])

  return <LoadingBar color={'red'} ref={ref} />
}
