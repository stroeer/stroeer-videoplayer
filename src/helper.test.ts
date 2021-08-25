import { getRandomItem } from './helper'

test('getRandomItem should return correct item', () => {
  global.Math.random = () => 0.2
  let stringArr = [
    'foo',
    'bar'
  ]
  expect(getRandomItem(stringArr)).toBe('foo')
  global.Math.random = () => 0.5
  expect(getRandomItem(stringArr)).toBe('bar')
  stringArr = []
  expect(getRandomItem(stringArr)).toBe('')
})
