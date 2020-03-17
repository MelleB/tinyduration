export interface Duration {
    negative?: boolean
    years?: number
    months?: number
    weeks?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
}

// Construction of the duration regex
const r = (name: string, unit: string): string => `((?<${name}>-?\\d*[\\.,]?\\d+)${unit})?`
const durationRegex = new RegExp(
    [
        '(?<negativeStr>-)?P',
        r('yearStr', 'Y'),
        r('monthStr', 'M'),
        r('weekStr', 'W'),
        r('dayStr', 'D'),
        '(T',
        r('hourStr', 'H'),
        r('minuteStr', 'M'),
        r('secondStr', 'S'),
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

    const { negativeStr, yearStr, monthStr, weekStr, hourStr, dayStr, minuteStr, secondStr } = match.groups
    if (!yearStr && !monthStr && !weekStr && !hourStr && !dayStr && !minuteStr && !secondStr) {
        throw InvalidDurationError
    }

    return {
        negative: negativeStr === '-' || undefined,
        years: parseNum(yearStr),
        months: parseNum(monthStr),
        weeks: parseNum(weekStr),
        days: parseNum(dayStr),
        hours: parseNum(hourStr),
        minutes: parseNum(minuteStr),
        seconds: parseNum(secondStr),
    }
}

export function toString(duration: Duration): string {
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
        duration.years && duration.years + 'Y',
        duration.months && duration.months + 'M',
        duration.weeks && duration.weeks + 'W',
        duration.days && duration.days + 'D',
        (duration.hours || duration.minutes || duration.seconds) && 'T',
        duration.hours && duration.hours + 'H',
        duration.minutes && duration.minutes + 'M',
        duration.seconds && duration.seconds + 'S',
    ].join('')
}
