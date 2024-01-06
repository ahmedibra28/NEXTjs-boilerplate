export const numberFormat = (amount: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
  })
  return formatter.format(amount)
}
