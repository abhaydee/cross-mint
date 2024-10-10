// src/utils/Logger.ts
import chalk from 'chalk';

// Define log levels with type safety
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

// Configuration object type for advanced logging
interface LogConfig {
  level: LogLevel;
  message: string;
}

// Define a type for log icons for better reusability
interface LogIconMap {
  [key: string]: string;
}

// Logger class for structured and colorful logs
export class Logger {
  // Default log level set to 'INFO'
  private static currentLogLevel: LogLevel = 'INFO';

  // Map to store the log icons for each level
  private static readonly LOG_ICONS: LogIconMap = {
    INFO: 'ℹ️',
    WARN: '⚠️',
    ERROR: '❌',
    DEBUG: '🐛',
  };

  // Control the visibility of log levels
  private static readonly LOG_LEVELS: LogLevel[] = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

  // Get icon for the respective log level
  private static getLogIcon(level: LogLevel): string {
    return this.LOG_ICONS[level] || '🔍';
  }

  // Format the log message with styles based on log level
  private static formatMessage({ level, message }: LogConfig): string {
    const timestamp = new Date().toISOString();
    const icon = this.getLogIcon(level);

    let formattedMessage: string;

    switch (level) {
      case 'INFO':
        formattedMessage = `${chalk.bgBlue.black(` [${timestamp}] `)} ${chalk.bold.blueBright(`${icon} [${level}]`)} ${chalk.cyan(message)}`;
        break;
      case 'WARN':
        formattedMessage = `${chalk.bgYellow.black(` [${timestamp}] `)} ${chalk.bold.yellow(`${icon} [${level}]`)} ${chalk.yellowBright(message)}`;
        break;
      case 'ERROR':
        formattedMessage = `${chalk.bgRed.white(` [${timestamp}] `)} ${chalk.bold.redBright(`${icon} [${level}]`)} ${chalk.underline.red(message)}`;
        break;
      case 'DEBUG':
        formattedMessage = `${chalk.bgGreen.black(` [${timestamp}] `)} ${chalk.bold.green(`${icon} [${level}]`)} ${chalk.italic.greenBright(message)}`;
        break;
      default:
        formattedMessage = `${chalk.bgWhite.black(` [${timestamp}] `)} ${chalk.bold.gray(`[UNKNOWN]`)} ${message}`;
    }
    return formattedMessage;
  }

  // Method to print the log to the console based on log level
  private static log(level: LogLevel, message: string): void {
    const formattedMessage = this.formatMessage({ level, message });
    switch (level) {
      case 'INFO':
        console.log(formattedMessage);
        break;
      case 'WARN':
        console.warn(formattedMessage);
        break;
      case 'ERROR':
        console.error(formattedMessage);
        break;
      case 'DEBUG':
        console.debug(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  }

  // Set the current log level for filtering logs
  public static setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
  }

  // Determine whether to display the log based on current log level setting
  private static shouldLog(level: LogLevel): boolean {
    return this.LOG_LEVELS.indexOf(level) >= this.LOG_LEVELS.indexOf(this.currentLogLevel);
  }

  // Public method to log informational messages
  public static info(message: string): void {
    if (this.shouldLog('INFO')) this.log('INFO', message);
  }

  // Public method to log warnings
  public static warn(message: string): void {
    if (this.shouldLog('WARN')) this.log('WARN', message);
  }

  // Public method to log errors
  public static error(message: string): void {
    if (this.shouldLog('ERROR')) this.log('ERROR', message);
  }

  // Public method to log debug messages
  public static debug(message: string): void {
    if (this.shouldLog('DEBUG')) this.log('DEBUG', message);
  }
}
