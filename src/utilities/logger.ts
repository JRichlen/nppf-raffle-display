import chalk from 'chalk';

enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

type LogLevelString = 'error' | 'warn' | 'info' | 'debug';

// Helper function to safely access environment variables in any environment
const getEnvVariable = (key: string): string | undefined => {
  // Check if running in browser
  if (typeof window !== 'undefined') {
    // Use localStorage as fallback in browser environments
    return localStorage.getItem(key) || undefined;
  }
  
  // In Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  return undefined;
};

// Helper to determine if we're in production environment
const isProduction = (): boolean => {
  const nodeEnv = getEnvVariable('NODE_ENV');
  return nodeEnv === 'production';
};

class Logger {
  private level: LogLevel;
  
  constructor() {
    this.level = this.determineLogLevel();
  }

  private determineLogLevel(): LogLevel {
    // Get LOG_LEVEL from environment variables or localStorage
    const configuredLevel = getEnvVariable('LOG_LEVEL')?.toLowerCase() as LogLevelString;
    if (configuredLevel && configuredLevel in LogLevel) {
      return LogLevel[configuredLevel.toUpperCase() as keyof typeof LogLevel];
    }
    
    // Default log levels based on environment
    return isProduction() ? LogLevel.ERROR : LogLevel.DEBUG;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  error(message: string, ...args: never[]): void {
    if (this.level >= LogLevel.ERROR) {
      console.error(
        chalk.red(this.formatMessage('error', message)),
        ...args
      );
    }
  }

  warn(message: string, ...args: never[]): void {
    if (this.level >= LogLevel.WARN) {
      console.warn(
        chalk.yellow(this.formatMessage('warn', message)),
        ...args
      );
    }
  }

  info(message: string, ...args: never[]): void {
    if (this.level >= LogLevel.INFO) {
      console.info(
        chalk.blue(this.formatMessage('info', message)),
        ...args
      );
    }
  }

  debug(message: string, ...args: never[]): void {
    if (this.level >= LogLevel.DEBUG) {
      console.debug(
        chalk.gray(this.formatMessage('debug', message)),
        ...args
      );
    }
  }

  // Helper to change log level at runtime
  setLevel(level: LogLevelString): void {
    this.level = LogLevel[level.toUpperCase() as keyof typeof LogLevel];
    // Persist to localStorage if in browser
    if (typeof window !== 'undefined') {
      localStorage.setItem('LOG_LEVEL', level);
    }
  }
}

// Export a singleton instance
export const logger = new Logger();
