const getRandomItem = (arr: string[]): string => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export {
  getRandomItem
}
