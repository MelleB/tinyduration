import { parse, toString, InvalidDurationError } from '.'

describe('valid test cases', () => {
    const testCasesValid = [
        { input: 'P12Y10M', parsed: { years: 12, months: 10 } },
        { input: 'P12Y10M13D', parsed: { years: 12, months: 10, days: 13 } },
        { input: 'P12W', parsed: { weeks: 12 } },
        { input: 'P1M', parsed: { months: 1 } },
        { input: 'PT1M', parsed: { minutes: 1 } },
        { input: 'P2DT1M', parsed: { days: 2, minutes: 1 } },
        { input: 'P-2DT1M', parsed: { days: -2, minutes: 1 } },
        { input: '-P-2DT1M', parsed: { negative: true, days: -2, minutes: 1 } },
        { input: 'PT.5M', parsed: { minutes: 0.5 }, serialized: 'PT0.5M' },
        { input: 'P.5YT.5M', parsed: { years: 0.5, minutes: 0.5 }, serialized: 'P0.5YT0.5M' },
        { input: 'P,5YT,5M', parsed: { years: 0.5, minutes: 0.5 }, serialized: 'P0.5YT0.5M' },
        { input: 'P0D', parsed: { days: 0 }, serialized: 'PT0S' },
        {
            input: '-P12Y10M13DT14H15M16S',
            parsed: { negative: true, years: 12, months: 10, days: 13, hours: 14, minutes: 15, seconds: 16 },
        },
    ]

    testCasesValid.forEach(({ input, parsed, serialized }) => {
        test(`parse & serialize valid - ${input}`, () => {
            expect(parse(input)).toEqual(parsed)
            expect(toString(parsed)).toEqual(serialized || input)
        })

        test('serialize empty object', () => {
            expect(toString({})).toEqual('PT0S')
        })
    })
})

describe('invalid test cases', () => {
    const testCasesInvalid = ['P', 'PT', 'asdf']

    testCasesInvalid.forEach(input => {
        test(`parse invalid - ${input}`, () => {
            expect(() => parse(input)).toThrow(InvalidDurationError)
        })
    })
})
