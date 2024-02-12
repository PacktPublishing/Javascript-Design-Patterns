import { runWithHttpRecording } from '../utils.js';

function proxyClassical() {
  class Implementation {
    someFn() {
      return 'some-output';
    }
    sensitiveFn() {
      return 'sensitive-output';
    }
  }

  class RedactionProxy {
    constructor() {
      this.impl = new Implementation();
    }
    someFn() {
      return this.impl.someFn();
    }
    sensitiveFn() {
      return this.impl.sensitiveFn().replace('sensitive', '[REDACTED]');
    }
  }

  const redactionProxy = new RedactionProxy();
  console.assert(
    redactionProxy.someFn() === new Implementation().someFn(),
    'Proxy implementation calls through to original',
  );
  console.assert(
    redactionProxy.sensitiveFn() !== new Implementation().sensitiveFn() &&
      redactionProxy.sensitiveFn() === '[REDACTED]-output',
    'Proxy implementation adds new behaviour',
  );
}
proxyClassical();

function proxyClassicalBreakdown() {
  class Implementation {
    someFn() {
      return 'sensitive-some-output';
    }
    sensitiveFn() {
      return 'sensitive-output';
    }
    otherSensitiveFn() {
      return 'sensitive-other-output';
    }
  }
  class RedactionProxyNaive {
    constructor() {
      this.impl = new Implementation();
    }
    someFn() {
      return this.impl.someFn().replace('sensitive', '[REDACTED]');
    }
    sensitiveFn() {
      return this.impl.sensitiveFn().replace('sensitive', '[REDACTED]');
    }
    otherSensitiveFn() {
      return this.impl.otherSensitiveFn().replace('sensitive', '[REDACTED]');
    }
  }

  console.assert(
    !new RedactionProxyNaive().someFn().includes('sensitive') &&
      !new RedactionProxyNaive().sensitiveFn().includes('sensitive') &&
      !new RedactionProxyNaive().otherSensitiveFn().includes('sensitive'),
    'naive proxy redacts correctly',
  );

  class RedactionProxyNaiveRefactored {
    constructor() {
      this.impl = new Implementation();
    }
    #redact(str) {
      return str.replace('sensitive', '[REDACTED]');
    }
    someFn() {
      return this.#redact(this.impl.someFn());
    }
    sensitiveFn() {
      return this.#redact(this.impl.sensitiveFn());
    }
    otherSensitiveFn() {
      return this.#redact(this.impl.otherSensitiveFn());
    }
  }

  console.assert(
    !new RedactionProxyNaiveRefactored().someFn().includes('sensitive') &&
      !new RedactionProxyNaiveRefactored()
        .sensitiveFn()
        .includes('sensitive') &&
      !new RedactionProxyNaiveRefactored()
        .otherSensitiveFn()
        .includes('sensitive'),
    'refactored naive proxy redacts correctly',
  );
}

proxyClassicalBreakdown();

function proxyModern() {
  const obj = {
    someFn() {
      return 'sensitive-some-output';
    },
    sensitiveFn() {
      return 'sensitive-output';
    },
    otherSensitiveFn() {
      return 'sensitive-other-output';
    },
    field: 'sensitive-data',
    sensitiveField: 'redact-everything',
  };
  const redactedObjProxy = new Proxy(obj, {
    get(target, property, _receiver) {
      if (target[property] instanceof Function) {
        return (...args) => {
          if (property.includes('sensitive')) {
            return '[REDACTED]';
          }
          const output = target[property](...args);
          if (typeof output === 'string') {
            return output.replace('sensitive', '[REDACTED]');
          }
          return output;
        };
      }
      if (property.includes('sensitive')) {
        return '[REDACTED]';
      }
      const output = target[property];
      return typeof output === 'string'
        ? output.replace('sensitive', '[REDACTED]')
        : output;
    },
  });
  console.assert(
    !redactedObjProxy.someFn().includes('sensitive') &&
      !redactedObjProxy.sensitiveFn().includes('sensitive') &&
      !redactedObjProxy.otherSensitiveFn().includes('sensitive'),
    'JavaScript Proxy redacts correctly for all functions',
  );
  console.assert(
    !redactedObjProxy.field.includes('sensitive'),
    'JavaScript Proxy redacts field values by value correctly',
  );
  console.assert(
    redactedObjProxy.sensitiveField === '[REDACTED]',
    'JavaScript Proxy redacts field values by property name correctly',
  );

  const redact = (propertyName, redactionValue) => {
    if (propertyName.includes('sensitive')) {
      return '[REDACTED]';
    }
    if (typeof redactionValue === 'string') {
      return redactionValue.replace('sensitive', '[REDACTED]');
    }
    // Could implement redaction of objects/Arrays and so on
    return redactionValue;
  };
  const redactedObjProxyImproved = new Proxy(obj, {
    get(target, property, receiver) {
      const targetPropertyValue = Reflect.get(target, property, receiver);
      if (targetPropertyValue instanceof Function) {
        return (...args) => {
          const output = Reflect.apply(
            targetPropertyValue,
            this === receiver ? this : target,
            args,
          );
          return redact(property, output);
        };
      }
      return redact(property, targetPropertyValue);
    },
  });
  console.assert(
    !redactedObjProxyImproved.someFn().includes('sensitive') &&
      !redactedObjProxyImproved.sensitiveFn().includes('sensitive') &&
      !redactedObjProxyImproved.otherSensitiveFn().includes('sensitive'),
    'JavaScript Proxy with Reflect redacts correctly for all functions',
  );
  console.assert(
    !redactedObjProxyImproved.field.includes('sensitive'),
    'JavaScript Proxy with Reflect redacts field values by value correctly',
  );
  console.assert(
    redactedObjProxyImproved.sensitiveField === '[REDACTED]',
    'JavaScript Proxy with Reflect redacts field values by property name correctly',
  );
}
proxyModern();

async function decoratorClassical() {
  class HttpClient {
    async getJson(url) {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Error loading ${url}`);
    }
  }

  class InstrumentedHttpClient {
    constructor(client) {
      this.client = client;
      this.requestTimings = {};
    }
    async getJson(url) {
      const start = performance.now();
      const output = await this.client.getJson(url);
      const end = performance.now();
      if (!Array.isArray(this.requestTimings[url])) {
        this.requestTimings[url] = [];
      }
      this.requestTimings[url].push(end - start);
      return output;
    }
  }

  const httpClient = new HttpClient();
  const instrumentedClient = new InstrumentedHttpClient(httpClient);
  // See https://github.com/georgyo/ifconfig.io/
  await instrumentedClient.getJson('https://ifconfig.io/all.json');
  console.assert(
    Object.keys(instrumentedClient.requestTimings).length > 0,
    'Tracks request timings',
  );
  await instrumentedClient.getJson('https://ifconfig.io/all.json');
  console.assert(
    instrumentedClient.requestTimings['https://ifconfig.io/all.json'].length ===
      2,
    'Tracks per URL timings',
  );
}
await runWithHttpRecording('decorator-http', () => decoratorClassical());

async function decoratorModern() {
  async function getJson(url) {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Error loading ${url}`);
  }
  const allOperationTimings = new Map();
  function addTiming(getJson) {
    return async (url) => {
      const start = performance.now();
      const output = await getJson(url);
      const end = performance.now();
      const previousOperationTimings = allOperationTimings.get(url) || [];
      allOperationTimings.set(
        url,
        previousOperationTimings.concat(end - start),
      );
      return output;
    };
  }
  const getJsonWithTiming = addTiming(getJson);
  await getJsonWithTiming('https://ifconfig.io/all.json');
  await getJsonWithTiming('https://ifconfig.io/all.json');
  console.assert(
    allOperationTimings.size === 1,
    'operation timings tracks by url',
  );
  console.assert(
    allOperationTimings.get('https://ifconfig.io/all.json').length === 2,
    'operation timings tracks number of calls by url',
  );
}
await runWithHttpRecording('decorator-http', () => decoratorModern());

function flyweightClassical() {
  class CoinFlyweight {
    /**
     * @param {Number} amount - amount in minor currency
     * @param {String} currency
     */
    constructor(amount, currency) {
      this.amount = amount;
      this.currency = currency;
    }
  }
  class CoinFlyweightFactory {
    static flyweights = {};
    static get(amount, currency) {
      const flyWeightKey = `${amount}-${currency}`;
      if (this.flyweights[flyWeightKey]) {
        return this.flyweights[flyWeightKey];
      }
      const instance = new CoinFlyweight(amount, currency);
      this.flyweights[flyWeightKey] = instance;
      return instance;
    }
    static getCount() {
      return Object.keys(this.flyweights).length;
    }
  }

  class MaterialFlyweight {
    constructor(materialName) {
      this.name = materialName;
    }
  }

  class MaterialFlyweightFactory {
    static flyweights = {};
    static get(materialName) {
      if (this.flyweights[materialName]) {
        return this.flyweights[materialName];
      }
      const instance = new MaterialFlyweight(materialName);
      this.flyweights[materialName] = instance;
      return instance;
    }
    static getCount() {
      return Object.keys(this.flyweights).length;
    }
  }
  class Coin {
    constructor(amount, currency, yearOfIssue, materials) {
      this.flyweight = CoinFlyweightFactory.get(amount, currency);
      this.yearOfIssue = yearOfIssue;
      this.materials = materials.map((material) =>
        MaterialFlyweightFactory.get(material),
      );
    }
  }

  class Wallet {
    constructor() {
      this.coins = [];
    }
    add(amount, currency, yearOfIssue, materials) {
      const coin = new Coin(amount, currency, yearOfIssue, materials);
      this.coins.push(coin);
    }
    getCount() {
      return this.coins.length;
    }
    getTotalValueForCurrency(currency) {
      return this.coins
        .filter((coin) => coin.flyweight.currency === currency)
        .reduce((acc, curr) => acc + curr.flyweight.amount, 0);
    }
  }
  const wallet = new Wallet();

  wallet.add(100, 'GBP', '2023', ['nickel-brass', 'nickel-plated alloy']);
  wallet.add(100, 'GBP', '2022', ['nickel-brass', 'nickel-plated alloy']);
  wallet.add(100, 'GBP', '2021', ['nickel-brass', 'nickel-plated alloy']);
  wallet.add(100, 'GBP', '2021', ['nickel-brass', 'nickel-plated alloy']);
  wallet.add(200, 'GBP', '2021', ['nickel-brass', 'cupro-nickel']);
  wallet.add(100, 'USD', '1990', ['copper', 'nickel']);
  wallet.add(5, 'USD', '1990', ['copper', 'nickel']);
  wallet.add(1, 'USD', '2010', ['copper', 'zinc']);

  console.assert(
    wallet.getCount() === 8,
    'wallet.add adds coin instances are created once given the same cache key',
  );
  console.assert(
    CoinFlyweightFactory.getCount() === 5,
    'CoinFlyweights are created once given the same cache key',
  );
  console.assert(
    MaterialFlyweightFactory.getCount() === 6,
    'MaterialFlyweights are created once given the same cache key',
  );
  console.assert(
    wallet.getTotalValueForCurrency('GBP') === 600,
    'Summing GBP works',
  );
  console.assert(
    wallet.getTotalValueForCurrency('USD') === 106,
    'Summing USD works',
  );
}
flyweightClassical();

function flyweightModern() {
  class CoinFlyweight {
    /**
     * @param {Number} amount - amount in minor currency
     * @param {String} currency
     */
    constructor(amount, currency) {
      this.amount = amount;
      this.currency = currency;
    }
  }
  class CoinFlyweightFactory {
    static #flyweights = new Map();
    static get(amount, currency) {
      const flyWeightKey = `${amount}-${currency}`;
      if (this.#flyweights.get(flyWeightKey)) {
        return this.#flyweights.get(flyWeightKey);
      }
      const instance = new CoinFlyweight(amount, currency);
      this.#flyweights.set(flyWeightKey, instance);
      return instance;
    }
    static getCount() {
      return this.#flyweights.size;
    }
  }

  class Coin {
    #flyweight;
    constructor(amount, currency, yearOfIssue, materials) {
      this.#flyweight = CoinFlyweightFactory.get(amount, currency);
      this.yearOfIssue = yearOfIssue;
      this.materials = materials;
    }
    get amount() {
      return this.#flyweight.amount;
    }
    get currency() {
      return this.#flyweight.currency;
    }
  }

  class Wallet {
    constructor() {
      this.coins = [];
    }
    add(amount, currency, yearOfIssue, materials) {
      const coin = new Coin(amount, currency, yearOfIssue, materials);
      this.coins.push(coin);
    }
    getCount() {
      return this.coins.length;
    }
    getTotalValueForCurrency(currency) {
      return this.coins
        .filter((coin) => coin.currency === currency)
        .reduce((acc, curr) => acc + curr.amount, 0);
    }
  }
  const wallet = new Wallet();

  wallet.add(100, 'GBP', '2023', ['nickel-brass', 'nickel-plated alloy']);
  wallet.add(100, 'GBP', '2022', ['nickel-brass', 'nickel-plated alloy']);
  wallet.add(100, 'GBP', '2021', ['nickel-brass', 'nickel-plated alloy']);
  wallet.add(100, 'GBP', '2021', ['nickel-brass', 'nickel-plated alloy']);
  wallet.add(200, 'GBP', '2021', ['nickel-brass', 'cupro-nickel']);
  wallet.add(100, 'USD', '1990', ['copper', 'nickel']);
  wallet.add(5, 'USD', '1990', ['copper', 'nickel']);
  wallet.add(1, 'USD', '2010', ['copper', 'zinc']);

  console.assert(
    wallet.getCount() === 8,
    'wallet.add adds coin instances are created once given the same cache key',
  );
  console.assert(
    CoinFlyweightFactory.getCount() === 5,
    'CoinFlyweights are created once given the same cache key',
  );
  console.assert(
    wallet.getTotalValueForCurrency('GBP') === 600,
    'Summing GBP works',
  );
  console.assert(
    wallet.getTotalValueForCurrency('USD') === 106,
    'Summing USD works',
  );
}
flyweightModern();

import { v4 as uuidv4, validate as isUuid } from 'uuid';
function adapterClassical() {
  class IdGenerator {
    get(entry) {
      return JSON.stringify(entry);
    }
  }

  class Database {
    constructor(idGenerator) {
      this.idGenerator = idGenerator;
      this.entries = {};
    }
    createEntry(entryData) {
      const id = this.idGenerator.get(entryData);
      this.entries[id] = entryData;
      return id;
    }
    get(id) {
      return this.entries[id];
    }
  }

  const naiveIdDatabase = new Database(new IdGenerator());
  naiveIdDatabase.createEntry({
    name: 'pear',
  });

  console.assert(
    naiveIdDatabase.get('{"name":"pear"}').name === 'pear',
    'stringIdDatabase recalls entries by stringified entry',
  );

  class UuidFactory {
    generateUuid() {
      return uuidv4();
    }
  }
  class UuidIdGeneratorAdapter {
    constructor() {
      this.uuidFactory = new UuidFactory();
    }
    get(_entry) {
      return this.uuidFactory.generateUuid();
    }
  }

  const uuidIdDatabase = new Database(new UuidIdGeneratorAdapter());
  const uuidEntryId = uuidIdDatabase.createEntry({
    name: 'pear',
  });
  console.assert(
    uuidIdDatabase.get(uuidEntryId).name === 'pear',
    'uuidIdDatabase recalls entries by uuid',
  );
  console.assert(isUuid(uuidEntryId), 'uuidIdDatabase generated uuid ids');

  class Counter {
    constructor(startValue = 1) {
      this.startValue = startValue;
      this.nextId = startValue;
      this.nextIdByPrefix = {};
    }
    getAndIncrement(prefix) {
      if (prefix) {
        if (!this.nextIdByPrefix[prefix]) {
          this.nextIdByPrefix[prefix] = this.startValue;
        }
        const nextId = this.nextIdByPrefix[prefix]++;
        return `${prefix}:${nextId}`;
      }
      return String(this.nextId++);
    }
  }

  class PrefixedAutoIncrementIdGeneratorAdapter {
    constructor() {
      this.counter = new Counter();
    }
    get(entry) {
      return this.counter.getAndIncrement(entry.name);
    }
  }
  const prefixAutoIncrementDatabase = new Database(
    new PrefixedAutoIncrementIdGeneratorAdapter(),
  );
  const noPrefixIncrementingEntryId1 = prefixAutoIncrementDatabase.createEntry({
    type: 'no-prefix',
  });
  const noPrefixIncrementingEntryId2 = prefixAutoIncrementDatabase.createEntry({
    type: 'no-prefix',
  });

  console.assert(
    noPrefixIncrementingEntryId1 === '1' &&
      noPrefixIncrementingEntryId2 === '2',
    'prefixAutoIncrementDatabase generates autoincrementing ids with no prefix if no name property is set',
  );
  console.assert(
    prefixAutoIncrementDatabase.get(noPrefixIncrementingEntryId1).type ===
      'no-prefix' &&
      prefixAutoIncrementDatabase.get(noPrefixIncrementingEntryId2).type ===
        'no-prefix',
    'prefixAutoIncrementDatabase recalls entries by autoincrementing id',
  );
  const prefixIncrementingEntryIdPear1 =
    prefixAutoIncrementDatabase.createEntry({
      name: 'pear',
    });
  const prefixIncrementingEntryIdPear2 =
    prefixAutoIncrementDatabase.createEntry({
      name: 'pear',
    });
  const prefixIncrementingEntryIdApple1 =
    prefixAutoIncrementDatabase.createEntry({
      name: 'apple',
    });
  console.assert(
    prefixIncrementingEntryIdPear1 === 'pear:1' &&
      prefixIncrementingEntryIdPear2 === 'pear:2' &&
      prefixIncrementingEntryIdApple1 === 'apple:1',
    'prefixAutoIncrementDatabase generates prefixed autoincrementing ids',
  );
  console.assert(
    prefixAutoIncrementDatabase.get(prefixIncrementingEntryIdPear1).name ===
      'pear',
    prefixAutoIncrementDatabase.get(prefixIncrementingEntryIdPear2).name ===
      'pear',
    prefixAutoIncrementDatabase.get(prefixIncrementingEntryIdApple1).name ===
      'apple',
    'prefixAutoIncrementDatabase recalls entries by prefixed id',
  );
}
adapterClassical();

function adapterModern() {
  function defaultIdGenerator(entry) {
    return JSON.stringify(entry);
  }
  class Database {
    constructor(idGenerator) {
      this.idGenerator = idGenerator;
      this.entries = {};
    }
    createEntry(entryData) {
      const id = this.idGenerator(entryData);
      this.entries[id] = entryData;
      return id;
    }
    get(id) {
      return this.entries[id];
    }
  }

  const naiveIdDatabase = new Database(defaultIdGenerator);
  naiveIdDatabase.createEntry({
    name: 'pear',
  });

  console.assert(
    naiveIdDatabase.get('{"name":"pear"}').name === 'pear',
    'stringIdDatabase recalls entries by stringified entry',
  );

  function uuidGenerator() {
    return uuidv4();
  }
  const uuidIdDatabase = new Database(uuidGenerator);
  const uuidEntryId = uuidIdDatabase.createEntry({
    name: 'pear',
  });
  console.assert(
    uuidIdDatabase.get(uuidEntryId).name === 'pear',
    'uuidIdDatabase recalls entries by uuid',
  );
  console.assert(isUuid(uuidEntryId), 'uuidIdDatabase generated uuid ids');

  const startValue = 1;
  let nextId = startValue;
  let nextIdByPrefix = {};
  function prefixAutoIncrementIdGenerator(entry) {
    const prefix = entry.name;
    if (prefix) {
      if (!nextIdByPrefix[prefix]) {
        nextIdByPrefix[prefix] = startValue;
      }
      const nextId = nextIdByPrefix[prefix]++;
      return `${prefix}:${nextId}`;
    }
    return String(nextId++);
  }
  const prefixAutoIncrementDatabase = new Database(
    prefixAutoIncrementIdGenerator,
  );
  const noPrefixIncrementingEntryId1 = prefixAutoIncrementDatabase.createEntry({
    type: 'no-prefix',
  });
  const noPrefixIncrementingEntryId2 = prefixAutoIncrementDatabase.createEntry({
    type: 'no-prefix',
  });

  console.assert(
    noPrefixIncrementingEntryId1 === '1' &&
      noPrefixIncrementingEntryId2 === '2',
    'prefixAutoIncrementDatabase generates autoincrementing ids with no prefix if no name property is set',
  );
  console.assert(
    prefixAutoIncrementDatabase.get(noPrefixIncrementingEntryId1).type ===
      'no-prefix' &&
      prefixAutoIncrementDatabase.get(noPrefixIncrementingEntryId2).type ===
        'no-prefix',
    'prefixAutoIncrementDatabase recalls entries by autoincrementing id',
  );
  const prefixIncrementingEntryIdPear1 =
    prefixAutoIncrementDatabase.createEntry({
      name: 'pear',
    });
  const prefixIncrementingEntryIdPear2 =
    prefixAutoIncrementDatabase.createEntry({
      name: 'pear',
    });
  const prefixIncrementingEntryIdApple1 =
    prefixAutoIncrementDatabase.createEntry({
      name: 'apple',
    });
  console.assert(
    prefixIncrementingEntryIdPear1 === 'pear:1' &&
      prefixIncrementingEntryIdPear2 === 'pear:2' &&
      prefixIncrementingEntryIdApple1 === 'apple:1',
    'prefixAutoIncrementDatabase generates prefixed autoincrementing ids',
  );
  console.assert(
    prefixAutoIncrementDatabase.get(prefixIncrementingEntryIdPear1).name ===
      'pear',
    prefixAutoIncrementDatabase.get(prefixIncrementingEntryIdPear2).name ===
      'pear',
    prefixAutoIncrementDatabase.get(prefixIncrementingEntryIdApple1).name ===
      'apple',
    'prefixAutoIncrementDatabase recalls entries by prefixed id',
  );
}
adapterModern();
