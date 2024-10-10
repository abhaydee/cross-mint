// src/utils/Logger.ts

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  private static log(level: LogLevel, message: string) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  public static info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  public static warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  public static error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }
}
