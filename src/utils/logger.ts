/**
 * Centralized logging utility for Suno MCP Server
 * Provides structured logging with levels and timestamps
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  tool?: string;
  error?: Error;
}

class Logger {
  private logLevel: LogLevel;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatEntry(entry: LogEntry): string {
    const parts = [
      `[${entry.timestamp}]`,
      `[${entry.level}]`,
      entry.tool ? `[${entry.tool}]` : '',
      entry.message
    ];
    
    return parts.filter(Boolean).join(' ');
  }

  private log(level: LogLevel, message: string, data?: unknown, tool?: string, error?: Error) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      tool,
      error
    };

    const formatted = this.formatEntry(entry);

    // Always use stderr for MCP server (stdout is reserved for MCP protocol)
    if (level === LogLevel.ERROR) {
      console.error(formatted);
      if (error) {
        console.error('Error details:', error);
      }
      if (data) {
        console.error('Additional data:', JSON.stringify(data, null, 2));
      }
    } else {
      console.error(formatted);
      if (data && level === LogLevel.DEBUG) {
        console.error('Debug data:', JSON.stringify(data, null, 2));
      }
    }
  }

  debug(message: string, data?: unknown, tool?: string) {
    this.log(LogLevel.DEBUG, message, data, tool);
  }

  info(message: string, data?: unknown, tool?: string) {
    this.log(LogLevel.INFO, message, data, tool);
  }

  warn(message: string, data?: unknown, tool?: string) {
    this.log(LogLevel.WARN, message, data, tool);
  }

  error(message: string, error?: Error, data?: unknown, tool?: string) {
    this.log(LogLevel.ERROR, message, data, tool, error);
  }

  // Tool-specific logging helpers
  toolStart(toolName: string, input: unknown) {
    this.info(`Tool execution started`, { input }, toolName);
  }

  toolSuccess(toolName: string, duration: number) {
    this.info(`Tool execution completed`, { duration: `${duration}ms` }, toolName);
  }

  toolError(toolName: string, error: Error, input?: unknown) {
    this.error(`Tool execution failed`, error, { input }, toolName);
  }
}

// Create singleton logger instance
export const logger = new Logger(
  process.env.LOG_LEVEL === 'DEBUG' ? LogLevel.DEBUG : LogLevel.INFO
);
