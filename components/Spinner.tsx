import LoadingIcons from 'react-loading-icons'

interface Props {
  height?: string
  stroke?: string
}

const Spinner = (props: Props) => {
  const { height = '3em', stroke = '#06bcee' } = props
  return (
    <div className="text-center">
      <LoadingIcons.ThreeDots
        stroke={stroke}
        height={height}
        fill="transparent"
      />
      <p style={{ color: '#06bcee' }}>Loading...</p>
    </div>
  )
}

export default Spinner
