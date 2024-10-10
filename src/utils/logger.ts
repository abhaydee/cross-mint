import chalk from 'chalk';

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export class Logger {
  private static log(level: LogLevel, message: string) {
    const timestamp = new Date().toISOString();
    let logColor;

    switch (level) {
      case LogLevel.INFO:
        logColor = chalk.blue;
        break;
      case LogLevel.WARN:
        logColor = chalk.yellow;
        break;
      case LogLevel.ERROR:
        logColor = chalk.red;
        break;
      case LogLevel.DEBUG:
        logColor = chalk.green;
        break;
      default:
        logColor = chalk.white;
    }

    console.log(logColor(`[${timestamp}] [${level}] ${message}`));
  }

  public static info(message: string) {
    this.log(LogLevel.INFO, message);
  }

  public static warn(message: string) {
    this.log(LogLevel.WARN, message);
  }

  public static error(message: string) {
    this.log(LogLevel.ERROR, message);
  }

  public static debug(message: string) {
    this.log(LogLevel.DEBUG, message);
  }
}
