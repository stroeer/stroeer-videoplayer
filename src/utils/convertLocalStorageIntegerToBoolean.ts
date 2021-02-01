const convertLocalStorageIntegerToBoolean = (key: string): boolean => {
	const localStorageItem = window.localStorage.getItem(key);
	if (localStorageItem) {
		const probablyInteger = parseInt(localStorageItem, 10);
		if (isNaN(probablyInteger)) {
			return false;
		} else {
			return Boolean(probablyInteger);
		}
	}
	return false;
};

export default convertLocalStorageIntegerToBoolean;
