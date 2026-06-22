// Browser mock for @manicjs/tui - readline is not available in browsers
// This file is used when the package is imported in a browser context

export const PromptSession = class {
  private rl: any = null;

  private async ensureReadline() {
    return {
      question: (_q: string, cb: (a: string) => void) => cb(''),
      pause: () => {},
      resume: () => {},
      close: () => {},
    };
  }

  async input(_question: string, defaultValue?: string): Promise<string> {
    return defaultValue ?? '';
  }

  async confirm(_question: string, _defaultYes: boolean = true): Promise<boolean> {
    return true;
  }

  async select(_question: string, choices: string[], _defaultIndex: number = 0): Promise<string> {
    return choices[0] ?? '';
  }

  async multiSelect(
    _question: string,
    choices: string[],
    _defaultSelected: number[] = [],
    _groups: (string | null | undefined)[] = []
  ): Promise<string[]> {
    return choices.slice(0, 1);
  }
};

export { cyan, dim, yellow, green, bold, gray, eventLine, hint, sectionTitle, divider, brandTitle, white, red } from './index';
