import log from './log'

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {

  })
})

it('returns true, when using debug', () => {
  expect(log('debug')('debug', 1)).toBe(true)
})

it('returns true, when using info', () => {
  expect(log('info')('info', 1)).toBe(true)
})

it('returns true, when using error', () => {
  expect(log('error')('error', 1)).toBe(true)
})

it('returns true, when using warn', () => {
  expect(log('warn')('warn', 1)).toBe(true)
})

it('returns true, when using imlicit info', () => {
  expect(log()('implicit info', 1)).toBe(true)
})
