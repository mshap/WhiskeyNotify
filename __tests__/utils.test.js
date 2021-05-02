jest.mock('aws')
jest.mock('aws-sdk')

const utils = require('../src/api/utils')

test('Has New Data', () => {
    expect(utils.isChanged({
        now: 4,
        prior: 0
    })).toBeTruthy()
})

test('Has No data', () => {
    expect(utils.isChanged({
        now: 0,
        prior: 0
    })).toBeFalsy()
})

test('Not new data', () => {
    expect(utils.isChanged({
        now: 4,
        prior: 2
    })).toBeFalsy()
})