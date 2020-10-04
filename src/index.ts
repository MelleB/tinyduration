interface DurationValues {
    years?: number
    months?: number
    weeks?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
}

export type Duration = {
    negative?: boolean
} & DurationValues

const units: Array<{ unit: keyof DurationValues; symbol: string }> = [
    { unit: 'years', symbol: 'Y' },
    { unit: 'months', symbol: 'M' },
    { unit: 'weeks', symbol: 'W' },
    { unit: 'days', symbol: 'D' },
    { unit: 'hours', symbol: 'H' },
    { unit: 'minutes', symbol: 'M' },
    { unit: 'seconds', symbol: 'S' },
]

// Construction of the duration regex
const r = (name: string, unit: string): string => `((?<${name}>-?\\d*[\\.,]?\\d+)${unit})?`
const durationRegex = new RegExp(
    [
        '(?<negative>-)?P',
        r('years', 'Y'),
        r('months', 'M'),
        r('weeks', 'W'),
        r('days', 'D'),
        '(T',
        r('hours', 'H'),
        r('minutes', 'M'),
        r('seconds', 'S'),
        ')?', // end optional time
    ].join(''),
)

function parseNum(s: string): number | undefined {
    if (s === '' || s === undefined || s === null) {
        return undefined
    }

    return parseFloat(s.replace(',', '.'))
}

export const InvalidDurationError = new Error('Invalid duration')

export function parse(durationStr: string): Duration {
    const match = durationRegex.exec(durationStr)
    if (!match || !match.groups) {
        throw InvalidDurationError
    }

    let empty = true
    const values: DurationValues = {}
    for (const { unit } of units) {
        if (match.groups[unit]) {
            empty = false
            values[unit] = parseNum(match.groups[unit])
        }
    }

    if (empty) {
        throw InvalidDurationError
    }

    const duration: Duration = values
    if (match.groups.negative) {
        duration.negative = true
    }

    return duration
}

const s = (number: number | undefined, component: string): string | undefined => {
    if (!number) {
        return undefined
    }

    let numberAsString = number.toString()
    const exponentIndex = numberAsString.indexOf('e')
    if (exponentIndex > -1) {
        const magnitude = parseInt(numberAsString.slice(exponentIndex + 2), 10)
        numberAsString = number.toFixed(magnitude + exponentIndex - 2)
    }

    return numberAsString + component
}

export function serialize(duration: Duration): string {
    if (
        !duration.years &&
        !duration.months &&
        !duration.weeks &&
        !duration.days &&
        !duration.hours &&
        !duration.minutes &&
        !duration.seconds
    ) {
        return 'PT0S'
    }

    return [
        duration.negative && '-',
        'P',
        s(duration.years, 'Y'),
        s(duration.months, 'M'),
        s(duration.weeks, 'W'),
        s(duration.days, 'D'),
        (duration.hours || duration.minutes || duration.seconds) && 'T',
        s(duration.hours, 'H'),
        s(duration.minutes, 'M'),
        s(duration.seconds, 'S'),
    ]
        .filter(Boolean)
        .join('')
}
