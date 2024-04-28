const defaultSalesInputSizes = {
  height: 64,
  minmax: '196px',
  fontSize: 0.95
}

const maxSalesInputSizes = {
  height: 138,
  minmax: '250px',
  fontSize: 1.8
}

export const calculateSalesInputButtonSize = value => {
  const heightRange = maxSalesInputSizes.height - defaultSalesInputSizes.height
  const fontSizeRange = maxSalesInputSizes.fontSize - defaultSalesInputSizes.fontSize

  const height = heightRange * (value / 100)
  const fontSize = fontSizeRange * (value / 100)

  return { height: defaultSalesInputSizes.height + height, fontSize: defaultSalesInputSizes.fontSize + fontSize }
}

export const resizeSalesInputButton = percentage => {
  const { height, fontSize } = calculateSalesInputButtonSize(percentage)

  document.body.style.setProperty('--sales-input-height', `${height}px`)
  document.body.style.setProperty('--sales-input-font-size', `${fontSize}em`)
  return
}
