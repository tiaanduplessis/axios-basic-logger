import assert from 'assert'
import fs from 'fs'
import path from 'path'
import useLogger from '../'

const OriginalDate = global.Date
const originalRandom = Math.random
const originalLog = console.log
let now
let logs

beforeEach(() => {
  now = new OriginalDate(2020, 0, 2, 3, 4, 5, 6).getTime()
  logs = []
  global.Date = function () { return new OriginalDate(now) }
  let next = 0
  Math.random = () => (next++ % 64) / 64
  console.log = value => logs.push(value)
})

afterEach(() => {
  global.Date = OriginalDate
  Math.random = originalRandom
  console.log = originalLog
})

function interceptors (options) {
  const requests = []
  const responses = []
  const axios = {
    interceptors: {
      request: { use: handler => requests.push(handler) },
      response: { use: handler => responses.push(handler) }
    }
  }
  useLogger(axios, options)
  assert.strictEqual(requests.length, 1)
  assert.strictEqual(responses.length, 1)
  return { request: requests[0], response: responses[0] }
}

test('exports a logger and registers one interceptor per direction', () => {
  assert.strictEqual(typeof useLogger, 'function')
  interceptors()
  assert.deepStrictEqual(logs, [])
})

test('preserves request and response objects and default log output', () => {
  const hooks = interceptors()
  const request = { method: 'get', url: '/first' }
  assert.strictEqual(hooks.request(request), request)
  assert.strictEqual(request.logId, '0123456789ABCDEFGHIJKLMNOPQRST')
  assert.ok(/^[0-9A-Za-z_-]{30}$/.test(request.logId))
  now += 39
  const response = { status: 200, config: request }
  assert.strictEqual(hooks.response(response), response)
  assert.deepStrictEqual(logs, [
    'REQUEST  03:04:05:6 GET /first',
    'RESPONSE 03:04:05:45 200 (GET /first) 39ms'
  ])
})

test('correlates overlapping requests completed out of order', () => {
  const hooks = interceptors()
  const first = { method: 'get', url: '/first' }
  const second = { method: 'post', url: '/second' }
  hooks.request(first)
  now += 10
  hooks.request(second)
  assert.notStrictEqual(first.logId, second.logId)
  assert.ok(/^[0-9A-Za-z_-]{30}$/.test(second.logId))
  now += 15
  hooks.response({ status: 201, config: second })
  now += 14
  hooks.response({ status: 200, config: first })
  assert.deepStrictEqual(logs, [
    'REQUEST  03:04:05:6 GET /first',
    'REQUEST  03:04:05:16 POST /second',
    'RESPONSE 03:04:05:31 201 (POST /second) 15ms',
    'RESPONSE 03:04:05:45 200 (GET /first) 39ms'
  ])
})

test('passes the original request and timestamp to a custom request logger', () => {
  const request = { method: 'put', url: '/custom' }
  const calls = []
  const hooks = interceptors({
    requestLogger: (...args) => {
      calls.push(args)
      assert.strictEqual(args[0].logId, undefined)
      return 'custom request'
    }
  })
  assert.strictEqual(hooks.request(request), request)
  assert.strictEqual(calls.length, 1)
  assert.strictEqual(calls[0][0], request)
  assert.strictEqual(calls[0][1], '03:04:05:6')
  assert.strictEqual(calls[0].length, 2)
  assert.deepStrictEqual(logs, ['custom request'])
})

test('keeps pico-uid pinned to the reviewed artifact in manifest and lockfile', () => {
  const root = path.resolve(__dirname, '../..')
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const lock = fs.readFileSync(path.join(root, 'yarn.lock'), 'utf8')
  assert.strictEqual(manifest.dependencies['pico-uid'], '1.0.2')
  assert.deepStrictEqual(lock.match(/^pico-uid@.*:$/gm), ['pico-uid@1.0.2:'])
  assert.ok(lock.includes([
    'pico-uid@1.0.2:',
    '  version "1.0.2"',
    '  resolved "https://registry.yarnpkg.com/pico-uid/-/pico-uid-1.0.2.tgz#68332927f7076cb209b433df378318c69ceff51d"',
    '  integrity sha512-Uzxa3+S5e2Jf5oWrYmHl6JubLKAnoNbfJOTGUA/F/HfO4n5KZFMYcIk4c2JDoX4UaV4kVNVwFY/fXjlDKCRGQw=='
  ].join('\n')))
})
