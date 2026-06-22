const ESC = '\x1b[';

const colorCodes = {
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  cyan: 36,
  white: 37,
  gray: 90,
} as const;

export const BRAND_NAME = 'MANIC';
export const BRAND_MARK = 'ϟ';
export const BRAND_COLOR = '#F15156';

export const theme = {
  brand: BRAND_COLOR,
  red: '#F15156',
  green: '#3FB950',
  yellow: '#D29922',
  blue: '#58A6FF',
  cyan: '#56D4DD',
} as const;

function ansi(code: number, value: string): string {
  return `${ESC}${code}m${value}${ESC}0m`;
}

function maybeColor(code: number, value: string): string {
  if (process.env['NO_COLOR']) return value;
  return ansi(code, value);
}

export function red(value: string): string {
  return maybeColor(colorCodes.red, value);
}

export function green(value: string): string {
  return maybeColor(colorCodes.green, value);
}

export function yellow(value: string): string {
  return maybeColor(colorCodes.yellow, value);
}

export function blue(value: string): string {
  return maybeColor(colorCodes.blue, value);
}

export function cyan(value: string): string {
  return maybeColor(colorCodes.cyan, value);
}

export function white(value: string): string {
  return maybeColor(colorCodes.white, value);
}

export function gray(value: string): string {
  return maybeColor(colorCodes.gray, value);
}

export function dim(value: string): string {
  return maybeColor(2, value);
}

export function bold(value: string): string {
  return maybeColor(1, value);
}

export function brandTitle(suffix?: string): string {
  const title = `${BRAND_MARK} ${BRAND_NAME}`;
  if (!suffix) return red(bold(title));
  return `${red(bold(title))} ${dim(suffix)}`;
}

export function divider(width: number = 40): string {
  return dim('─'.repeat(width));
}

export type SectionTone = 'default' | 'build' | 'dev' | 'production';

export function sectionTitle(
  title: string,
  tone: SectionTone = 'default'
): string {
  const diamond =
    tone === 'build'
      ? yellow('◆')
      : tone === 'dev'
        ? cyan('◆')
        : tone === 'production'
          ? green('◆')
          : white('◆');
  return `${diamond} ${bold(white(title))}`;
}

export function statusPending(label: string): string {
  return `${dim('○')} ${dim(label)}`;
}

export function statusSuccess(label: string): string {
  return `${green('●')} ${white(label)}`;
}

export function statusError(label: string): string {
  return `${red('●')} ${white(label)}`;
}

export function hint(label: string, value: string): string {
  return `${dim(label)} ${cyan(value)}`;
}

export type EventTone = 'info' | 'success' | 'warn' | 'error';

export function eventLine(
  source: string,
  message: string,
  tone: EventTone = 'info'
): string {
  const ts = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const icon =
    tone === 'success'
      ? green('●')
      : tone === 'warn'
        ? yellow('▲')
        : tone === 'error'
          ? red('✖')
          : cyan('●');
  const label = tone === 'warn' ? yellow(source) : cyan(source);
  return `${dim(ts)} ${icon} ${label} ${white(message)}`;
}

export function isDebugEnabled(): boolean {
  return process.env['MANIC_DEBUG'] === '1' || process.argv.includes('--debug');
}

export function debugLog(source: string, message: string): void {
  if (!isDebugEnabled()) return;
  const scoped = source ? `[${source}] ${message}` : message;
  console.log(eventLine('debug', scoped, 'info'));
}

export { PromptSession } from './prompts';
