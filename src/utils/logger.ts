import * as Sentry from '@sentry/react-native';

const isDevelopment = __DEV__;

export const logger = {

  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
    Sentry.addBreadcrumb({
      message: formatMessage(args),
      level: 'info',
      category: 'log',
    });
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
    Sentry.captureMessage(formatMessage(args), {
      level: 'warning',
      tags: extractTags(args),
    });
  },

  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
    
    const errorObj = args.find(arg => arg instanceof Error);
    const message = formatMessage(args);
    
    if (errorObj) {
      Sentry.captureException(errorObj, {
        level: 'error',
        tags: extractTags(args),
        contexts: {
          message: { value: message },
        },
      });
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        tags: extractTags(args),
      });
    }
  },

  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

function formatMessage(args: any[]): string {
  return args
    .map(arg => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return arg.message;
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join(' ');
}

function extractTags(args: any[]): Record<string, string> {
  const tags: Record<string, string> = {};
  const firstArg = args[0];
  
  if (typeof firstArg === 'string') {
    // Extract component/service name from [ComponentName] pattern
    const match = firstArg.match(/^\[([^\]]+)\]/);
    if (match) {
      const name = match[1].trim();
      if (name.includes('Controller')) {
        tags.component = name;
      } else if (name.includes('Service')) {
        tags.service = name;
      } else {
        tags.context = name;
      }
    }
  }
  
  return tags;
}
