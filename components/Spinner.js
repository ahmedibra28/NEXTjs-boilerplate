import LoadingIcons from 'react-loading-icons'

export const Spinner = (props) => {
  const { height = '3em', stroke = '#06bcee' } = props
  return (
    <div className='text-center'>
      <LoadingIcons.ThreeDots
        stroke={stroke}
        height={height}
        fill='transparent'
      />
      <p style={{ color: '#06bcee' }}>Loading...</p>
    </div>
  )
}
