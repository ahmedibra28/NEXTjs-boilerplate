import { currency } from '@/lib/currency'
import { numberFormat } from '@/lib/numberFormat'

export const FormatNumber = ({
  value,
  isCurrency,
}: {
  value: number
  isCurrency: boolean
}) => {
  const isN = typeof value === 'number' && !isNaN(value)

  return isN ? (
    isCurrency ? (
      <span>{currency(value)}</span>
    ) : (
      <span>{numberFormat(value)}</span>
    )
  ) : (
    <span className='loading loading-bars loading-xs'></span>
  )
}
