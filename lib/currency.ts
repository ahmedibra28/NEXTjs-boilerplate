export const currency = (amount: number, decimal = 3) => {
  if (!amount) return '$0.00'
  let amountWithDecimal = amount
    .toString()
    .substring(0, amount.toString().indexOf('.') + decimal)

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 20,
  })

  let truncatedValue = formatter.format(amount)

  amountWithDecimal = amountWithDecimal.split('.')[1]
  amountWithDecimal = amountWithDecimal ? amountWithDecimal : '00'
  truncatedValue = truncatedValue.split('.')[0]

  return `${truncatedValue}.${amountWithDecimal}`
}
