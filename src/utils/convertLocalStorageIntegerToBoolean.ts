const convertLocalStorageIntegerToBoolean = (key: string): boolean => {
  // 📌 Info:
  // `window` is undefined via SSR
  if (typeof window !== 'undefined') {
    const localStorageItem = window.localStorage.getItem(key)
    if (localStorageItem !== null) {
      const probablyInteger = parseInt(localStorageItem, 10)
      if (isNaN(probablyInteger)) {
        return false
      } else {
        return Boolean(probablyInteger)
      }
    }
  }
  return false
}

export default convertLocalStorageIntegerToBoolean
