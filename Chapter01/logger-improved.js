export class Logger {
  static logLevels = ['info', 'warn', 'error'];
  static #loggerInstance = null;
  #logLevel;
  #transport;
  constructor(logLevel = 'info', transport = console) {
    if (Logger.#loggerInstance) {
      throw new TypeError(
        'Logger is not constructable, use getInstance() instead',
      );
    }
    this.#logLevel = logLevel;
    this.#transport = transport;
    Logger.#loggerInstance = this;
  }
  #isLevelEnabled(targetLevel) {
    return (
      Logger.logLevels.indexOf(targetLevel) >=
      Logger.logLevels.indexOf(this.#logLevel)
    );
  }
  info(message) {
    if (this.#isLevelEnabled('info')) {
      return this.#transport.info(message);
    }
  }
  warn(message) {
    if (this.#isLevelEnabled('warn')) {
      this.#transport.warn(message);
    }
  }
  error(message) {
    if (this.#isLevelEnabled('error')) {
      this.#transport.error(message);
    }
  }
  getInstance() {
    if (!Logger.#loggerInstance) {
      Logger.#loggerInstance = new Logger('warn', console);
    }

    return Logger.#loggerInstance;
  }
}

export default Object.freeze(new Logger('warn', console));
