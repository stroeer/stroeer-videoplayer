const getRandomItem = (arr: string[]): string => {
  if (arr.length === 0) return ''
  return arr[Math.floor(Math.random() * arr.length)]
}

export {
  getRandomItem
}
