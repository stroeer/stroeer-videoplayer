import convertLocalStorageIntegerToBoolean from './convertLocalStorageIntegerToBoolean';

it('should return false, when localStorage item is not found', () => {
	expect(convertLocalStorageIntegerToBoolean('foobar')).toBe(false);
});

it('should return true for number 1', () => {
	window.localStorage.setItem('foobar', '1');
	expect(convertLocalStorageIntegerToBoolean('foobar')).toBe(true);
});


it('should return false for NaN string baz', () => {
	window.localStorage.setItem('foobar', 'baz');
	expect(convertLocalStorageIntegerToBoolean('foobar')).toBe(false);
});
