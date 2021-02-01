interface LogColor {
  'bg': string
  'fg': string
}

interface LogColors {
  'info': LogColor
  'warn': LogColor
  'debug': LogColor
  'error': LogColor
}

type innerLogFunction = (desc: string, ...logs: string[] | Array<Record<string, unknown>> | number[] | HTMLElement[]) => void

const log = function (t?: string): innerLogFunction {
  t = t ?? 'info'

  const colors: LogColors = {
    info: {
      bg: '#19cf85',
      fg: '#272b30'
    },
    warn: {
      bg: '#ffd866',
      fg: '#272b30'
    },
    debug: {
      bg: '#3c92d1',
      fg: '#272b30'
    },
    error: {
      bg: '#ff6188',
      fg: '#272b30'
    }
  }

  const c: LogColor = colors[t as keyof typeof colors]

  return (desc: string, ...logs: string[] | Array<Record<string, unknown>> | number[] | HTMLElement[]) => {
    window.console.log(
      '%c' + desc,
      'color:' + c.fg + ';background:' + c.bg + ';',
      ...logs
    )

    return true
  }
}

export default log
