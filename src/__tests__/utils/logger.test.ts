import { logger } from '../../utils/logger';
import * as Sentry from '@sentry/react-native';

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

// Mock __DEV__ to true for testing
(global as any).__DEV__ = true;

describe('Logger', () => {
  let consoleSpy: {
    log: jest.SpyInstance;
    info: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
    debug: jest.SpyInstance;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Restore console methods for these tests
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(() => {}),
      info: jest.spyOn(console, 'info').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
      debug: jest.spyOn(console, 'debug').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  describe('log', () => {
    it('should call console.log in development', () => {
      logger.log('Test message');
      
      expect(consoleSpy.log).toHaveBeenCalledWith('Test message');
    });

    it('should handle multiple arguments', () => {
      logger.log('Message', { data: 'test' }, 123);
      
      expect(consoleSpy.log).toHaveBeenCalledWith('Message', { data: 'test' }, 123);
    });
  });

  describe('info', () => {
    it('should call console.info and add Sentry breadcrumb', () => {
      logger.info('[Service] Test info message');
      
      expect(consoleSpy.info).toHaveBeenCalledWith('[Service] Test info message');
      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        message: '[Service] Test info message',
        level: 'info',
        category: 'log',
      });
    });
  });

  describe('warn', () => {
    it('should call console.warn and capture Sentry message', () => {
      logger.warn('[Controller] Warning message');
      
      expect(consoleSpy.warn).toHaveBeenCalledWith('[Controller] Warning message');
      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        '[Controller] Warning message',
        expect.objectContaining({
          level: 'warning',
        })
      );
    });

    it('should extract component tag from message', () => {
      logger.warn('[TestController] Warning');
      
      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        '[TestController] Warning',
        expect.objectContaining({
          tags: { component: 'TestController' },
        })
      );
    });

    it('should extract service tag from message', () => {
      logger.warn('[TestService] Warning');
      
      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        '[TestService] Warning',
        expect.objectContaining({
          tags: { service: 'TestService' },
        })
      );
    });
  });

  describe('error', () => {
    it('should call console.error and capture Sentry exception for Error objects', () => {
      const testError = new Error('Test error');
      logger.error('[Service] Error occurred:', testError);
      
      expect(consoleSpy.error).toHaveBeenCalledWith('[Service] Error occurred:', testError);
      expect(Sentry.captureException).toHaveBeenCalledWith(
        testError,
        expect.objectContaining({
          level: 'error',
        })
      );
    });

    it('should capture Sentry message for non-Error arguments', () => {
      logger.error('[Service] Something went wrong', { code: 500 });
      
      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        expect.stringContaining('[Service] Something went wrong'),
        expect.objectContaining({
          level: 'error',
        })
      );
    });
  });

  describe('debug', () => {
    it('should call console.debug in development', () => {
      logger.debug('Debug message');
      
      expect(consoleSpy.debug).toHaveBeenCalledWith('Debug message');
    });
  });
});
