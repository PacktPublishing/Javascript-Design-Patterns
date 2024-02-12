function observerClassical() {
  class Queue {
    constructor() {
      this.handlers = [];
    }
    subscribe(handlerFn) {
      this.handlers.push(handlerFn);
    }
    unsubscribe(handlerFn) {
      this.handlers = this.handlers.filter((handler) => handler !== handlerFn);
    }
    notify(message) {
      this.handlers.forEach((handler) => {
        handler(message);
      });
    }
  }

  const queue = new Queue();

  const createMessages = [];
  queue.subscribe((message) => {
    if (message.type === 'CREATE') {
      createMessages.push(message);
    }
  });

  const updateMessages = [];
  queue.subscribe((message) => {
    if (message.type === 'UPDATE') {
      updateMessages.push(message);
    }
  });

  const allMessages = [];
  queue.subscribe((message) => {
    allMessages.push(message);
  });

  queue.notify({ type: 'CREATE', data: { user: { id: 1 } } });
  queue.notify({ type: 'CREATE', data: { user: { id: 2 } } });
  queue.notify({ type: 'CREATE', data: { user: { id: 3 } } });
  queue.notify({ type: 'UPDATE', data: { user: { id: 1, role: 'ADMIN' } } });
  queue.notify({
    type: 'UPDATE',
    data: { user: { id: 3, role: 'DEVELOPER' } },
  });
  queue.notify({ type: 'UPDATE', data: { user: { id: 3, role: 'ADMIN' } } });

  console.assert(
    createMessages.length === 3,
    '%o collects CREATE messages',
    allMessages,
  );
  console.assert(
    updateMessages.length === 3,
    '%o collects UPDATE messages',
    allMessages,
  );
  console.assert(
    allMessages.length === 6,
    '%o collects all message',
    allMessages,
  );

  class QueueObserverObjects {
    constructor() {
      this.observers = [];
    }
    subscribe(observerObj) {
      this.observers.push(observerObj);
    }
    unsubscribe(observerObj) {
      this.observers = this.observers.filter(
        (observer) => observer !== observerObj,
      );
    }
    notify(message) {
      this.observers.forEach((observer) => {
        observer.handle(message);
      });
    }
  }

  class UpdateMessageObserver {
    constructor() {
      this.updateMessages = [];
    }
    handle(message) {
      if (message.type === 'UPDATE') {
        this.updateMessages.push(message);
      }
    }
  }

  const queueObserverObjects = new QueueObserverObjects();

  const updateMessageObserver = new UpdateMessageObserver();

  queueObserverObjects.subscribe(updateMessageObserver);

  queueObserverObjects.notify({
    type: 'CREATE',
    data: { user: { id: 1 } },
  });
  queueObserverObjects.notify({
    type: 'UPDATE',
    data: { user: { id: 1, role: 'ADMIN' } },
  });
  queueObserverObjects.notify({
    type: 'UPDATE',
    data: { user: { id: 3, role: 'DEVELOPER' } },
  });

  console.assert(
    updateMessageObserver.updateMessages.length === 2,
    '%o collects update messages',
    updateMessageObserver.updateMessages,
  );
}
observerClassical();

function observerModern() {
  class Queue {
    #handlers;
    constructor() {
      this.#handlers = [];
    }
    subscribe(handlerFn) {
      this.#handlers.push(handlerFn);
      return this;
    }
    unsubscribe(handlerFn) {
      this.#handlers = this.#handlers.filter(
        (handler) => handler !== handlerFn,
      );
      return this;
    }
    notify(message) {
      this.#handlers.forEach((handler) => {
        handler(message);
      });
      return this;
    }
  }

  const queue = new Queue();

  const createMessages = [];
  const updateMessages = [];
  const allMessages = [];

  queue
    .subscribe((message) => {
      if (message.type === 'CREATE') {
        createMessages.push(message);
      }
    })
    .subscribe((message) => {
      if (message.type === 'UPDATE') {
        updateMessages.push(message);
      }
    })
    .subscribe((message) => {
      allMessages.push(message);
    });

  queue
    .notify({ type: 'CREATE', data: { user: { id: 1 } } })
    .notify({ type: 'CREATE', data: { user: { id: 2 } } })
    .notify({ type: 'CREATE', data: { user: { id: 3 } } })
    .notify({ type: 'UPDATE', data: { user: { id: 1, role: 'ADMIN' } } })
    .notify({
      type: 'UPDATE',
      data: { user: { id: 3, role: 'DEVELOPER' } },
    })
    .notify({ type: 'UPDATE', data: { user: { id: 3, role: 'ADMIN' } } });

  console.assert(
    createMessages.length === 3,
    '%o collects CREATE messages',
    allMessages,
  );
  console.assert(
    updateMessages.length === 3,
    '%o collects UPDATE messages',
    allMessages,
  );
  console.assert(
    allMessages.length === 6,
    '%o collects all message',
    allMessages,
  );
}
observerModern();

import { captureError } from '../utils.js';
function stateStrategyClassical() {
  class DraftState {
    constructor(pullRequest) {
      this.pullRequest = pullRequest;
    }
    markReadyForReview() {
      this.pullRequest.setState(new OpenState(this.pullRequest));
    }
    close() {
      this.pullRequest.setState(new ClosedState(this.pullRequest));
    }
  }

  class OpenState {
    constructor(pullRequest) {
      this.pullRequest = pullRequest;
    }
    markDraft() {
      this.pullRequest.setState(new DraftState(this.pullRequest));
    }
    close() {
      this.pullRequest.setState(new ClosedState(this.pullRequest));
    }
    merge() {
      this.pullRequest.setState(new MergedState(this.pullRequest));
    }
  }

  class MergedState {
    constructor(pullRequest) {
      this.pullRequest = pullRequest;
    }
  }

  class ClosedState {
    constructor(pullRequest) {
      this.pullRequest = pullRequest;
    }
    open() {
      this.pullRequest.setState(new OpenState(this.pullRequest));
    }
  }

  class PullRequest {
    constructor(isDraft = false) {
      this.state = isDraft ? new DraftState(this) : new OpenState(this);
    }
    setState(state) {
      this.state = state;
    }
    open() {
      this.state.open();
    }
    markDraft() {
      this.state.markDraft();
    }
    markReadyForReview() {
      this.state.markReadyForReview();
    }
    close() {
      this.state.close();
    }
    merge() {
      this.state.merge();
    }
  }

  const pullRequest1 = new PullRequest(true);
  console.assert(pullRequest1.state instanceof DraftState, pullRequest1.state);
  pullRequest1.markReadyForReview();
  console.assert(pullRequest1.state instanceof OpenState, pullRequest1.state);
  pullRequest1.merge();

  console.assert(
    captureError(() => pullRequest1.open()) instanceof Error,
    pullRequest1.state,
  );
  console.assert(
    captureError(() => pullRequest1.markReadyForReview()) instanceof Error,
    pullRequest1.state,
  );
  console.assert(
    captureError(() => pullRequest1.close()) instanceof Error,
    pullRequest1.state,
  );

  const pullRequest2 = new PullRequest(false);
  console.assert(pullRequest2.state instanceof OpenState, pullRequest2.state);
  pullRequest2.close();
  console.assert(pullRequest2.state instanceof ClosedState, pullRequest2.state);
  console.assert(
    captureError(() => pullRequest2.markDraft()) instanceof Error,
    pullRequest2.state,
  );
  pullRequest2.open();
  console.assert(pullRequest2.state instanceof OpenState, pullRequest2.state);

  // strategy
  class ObjectMerger {
    constructor(defaultStrategy) {
      this.strategy = defaultStrategy;
    }
    setStrategy(newStrategy) {
      this.strategy = newStrategy;
    }
    combineObjects(obj1, obj2) {
      return this.strategy.combineObjects(obj1, obj2);
    }
  }

  class PureObjectAssignStrategy {
    constructor() {}
    combineObjects(obj1, obj2) {
      return Object.assign({}, obj1, obj2);
    }
  }

  const objectMerger = new ObjectMerger(new PureObjectAssignStrategy());
  const obj1 = {
    keys: '123',
  };
  const obj2 = {
    keys: '456',
  };

  const defaultMergeStrategyOutput = objectMerger.combineObjects(obj1, obj2);
  console.assert(
    defaultMergeStrategyOutput.keys === '456',
    '%o has keys = 456',
  );
  console.assert(obj1.keys === '123' && obj2.keys === '456', obj1, obj2);

  class MutatingObjectAssignStrategy {
    constructor() {}
    combineObjects(obj1, obj2) {
      return Object.assign(obj1, obj2);
    }
  }

  objectMerger.setStrategy(new MutatingObjectAssignStrategy());
  const mutatingMergedStrategyOutput = objectMerger.combineObjects(obj1, obj2);
  console.assert(
    mutatingMergedStrategyOutput.keys === '456',
    '%o has keys = 456',
    mutatingMergedStrategyOutput,
  );
  console.assert(
    obj1.keys === '456' && obj2.keys === '456',
    'Mutates the original object obj1 %o, obj2 %o',
    obj1,
    obj2,
  );

  class ObjectSpreadStrategy {
    constructor() {}
    combineObjects(obj1, obj2) {
      return { ...obj1, ...obj2 };
    }
  }

  objectMerger.setStrategy(new ObjectSpreadStrategy());

  const newObj1 = { keys: '123' };
  const newObj2 = { keys: '456', obj1: newObj1 };

  const objectSpreadStrategyOutput = objectMerger.combineObjects(
    newObj1,
    newObj2,
  );
  console.assert(
    objectSpreadStrategyOutput.keys === '456',
    '%o has keys = 456',
    objectSpreadStrategyOutput,
  );
  console.assert(
    newObj1.keys === '123' && newObj2.keys === '456',
    'Does not mutate the original object newObj1 %o, newObj2 %o',
    newObj1,
    newObj2,
  );

  console.assert(
    objectSpreadStrategyOutput.obj1 === newObj1,
    'Does a shallow clone so objectSpreadStrategyOutput.obj1 references newObj1',
  );

  class DeepCloneObjectAssignStrategy {
    constructor() {}
    combineObjects(obj1, obj2) {
      return Object.assign(structuredClone(obj1), structuredClone(obj2));
    }
  }

  objectMerger.setStrategy(new DeepCloneObjectAssignStrategy());

  const deepCloneStrategyOutput = objectMerger.combineObjects(newObj1, newObj2);
  console.assert(
    deepCloneStrategyOutput.keys === '456',
    '%o has keys = 456',
    deepCloneStrategyOutput,
  );
  console.assert(
    newObj1.keys === '123' && newObj2.keys === '456',
    'Does not mutate the original object newObj1 %o, newObj2 %o',
    newObj1,
    newObj2,
  );

  console.assert(
    deepCloneStrategyOutput.obj1 !== newObj1 &&
      deepCloneStrategyOutput.obj1.keys === newObj1.keys,
    'Does a shallow clone so deepCloneStrategyOutput.obj1 references newObj1',
  );
}
stateStrategyClassical();

function stateStrategyModern() {
  class IllegalOperationError extends Error {
    constructor(stateInstance) {
      this.stateInstance = stateInstance;
      throw new Error('Illegal operation for State');
    }
  }
  class PullRequestBaseState {
    /**
     * @param {PullRequest} pullRequest
     */
    constructor(pullRequest) {
      this.pullRequest = pullRequest;
    }
    markDraft() {
      throw new IllegalOperationError(this);
    }
    markReadyForReview() {
      throw new IllegalOperationError(this);
    }
    open() {
      throw new IllegalOperationError(this);
    }
    close() {
      throw new IllegalOperationError(this);
    }
    merge() {
      throw new IllegalOperationError(this);
    }
  }

  class ClosedState extends PullRequestBaseState {
    open() {
      this.pullRequest.setState(new OpenState(this.pullRequest));
    }
  }

  class DraftState extends PullRequestBaseState {
    markReadyForReview() {
      this.pullRequest.setState(new OpenState(this.pullRequest));
    }
    close() {
      this.pullRequest.setState(new ClosedState(this.pullRequest));
    }
  }

  class OpenState extends PullRequestBaseState {
    markDraft() {
      this.pullRequest.setState(new DraftState(this.pullRequest));
    }
    close() {
      this.pullRequest.setState(new ClosedState(this.pullRequest));
    }
    merge() {
      this.pullRequest.setState(new MergedState(this.pullRequest));
    }
  }

  class MergedState extends PullRequestBaseState {}

  class PullRequest {
    constructor(isDraft = false) {
      this.state = isDraft ? new DraftState(this) : new OpenState(this);
    }
    setState(state) {
      this.state = state;
    }
    open() {
      this.state.open();
    }
    markDraft() {
      this.state.markDraft();
    }
    markReadyForReview() {
      this.state.markReadyForReview();
    }
    close() {
      this.state.close();
    }
    merge() {
      this.state.merge();
    }
  }

  const pullRequest1 = new PullRequest(true);
  console.assert(pullRequest1.state instanceof DraftState, pullRequest1.state);
  pullRequest1.markReadyForReview();
  console.assert(pullRequest1.state instanceof OpenState, pullRequest1.state);
  pullRequest1.merge();

  console.assert(
    captureError(() => pullRequest1.open()) instanceof Error,
    pullRequest1.state,
  );
  console.assert(
    captureError(() => pullRequest1.markReadyForReview()) instanceof Error,
    pullRequest1.state,
  );
  console.assert(
    captureError(() => pullRequest1.close()) instanceof Error,
    pullRequest1.state,
  );

  const pullRequest2 = new PullRequest(false);
  console.assert(pullRequest2.state instanceof OpenState, pullRequest2.state);
  pullRequest2.close();
  console.assert(pullRequest2.state instanceof ClosedState, pullRequest2.state);
  console.assert(
    captureError(() => pullRequest2.markDraft()) instanceof Error,
    pullRequest2.state,
  );
  pullRequest2.open();
  console.assert(pullRequest2.state instanceof OpenState, pullRequest2.state);
  // strategy could be a function being passed around
  class ObjectMerger {
    constructor(defaultStrategy) {
      this.strategy = defaultStrategy;
    }
    setStrategy(newStrategy) {
      this.strategy = newStrategy;
    }
    combineObjects(obj1, obj2) {
      return this.strategy(obj1, obj2);
    }
  }

  function pureObjectAssignStrategy(obj1, obj2) {
    return Object.assign({}, obj1, obj2);
  }

  function mutatingObjectAssignStrategy(obj1, obj2) {
    return Object.assign(obj1, obj2);
  }

  function objectSpreadStrategy(obj1, obj2) {
    return { ...obj1, ...obj2 };
  }

  function deepCloneObjectAssignStrategy(obj1, obj2) {
    return Object.assign(structuredClone(obj1), structuredClone(obj2));
  }

  const objectMerger = new ObjectMerger(pureObjectAssignStrategy);
  const obj1 = {
    keys: '123',
  };
  const obj2 = {
    keys: '456',
  };

  const defaultMergeStrategyOutput = objectMerger.combineObjects(obj1, obj2);
  console.assert(
    defaultMergeStrategyOutput.keys === '456',
    '%o has keys = 456',
  );
  console.assert(obj1.keys === '123' && obj2.keys === '456', obj1, obj2);
  objectMerger.setStrategy(mutatingObjectAssignStrategy);
  const mutatingMergedStrategyOutput = objectMerger.combineObjects(obj1, obj2);
  console.assert(
    mutatingMergedStrategyOutput.keys === '456',
    '%o has keys = 456',
    mutatingMergedStrategyOutput,
  );
  console.assert(
    obj1.keys === '456' && obj2.keys === '456',
    'Mutates the original object obj1 %o, obj2 %o',
    obj1,
    obj2,
  );

  objectMerger.setStrategy(objectSpreadStrategy);

  const newObj1 = { keys: '123' };
  const newObj2 = { keys: '456', obj1: newObj1 };

  const objectSpreadStrategyOutput = objectMerger.combineObjects(
    newObj1,
    newObj2,
  );
  console.assert(
    objectSpreadStrategyOutput.keys === '456',
    '%o has keys = 456',
    objectSpreadStrategyOutput,
  );
  console.assert(
    newObj1.keys === '123' && newObj2.keys === '456',
    'Does not mutate the original object newObj1 %o, newObj2 %o',
    newObj1,
    newObj2,
  );

  console.assert(
    objectSpreadStrategyOutput.obj1 === newObj1,
    'Does a shallow clone so objectSpreadStrategyOutput.obj1 references newObj1',
  );

  objectMerger.setStrategy(deepCloneObjectAssignStrategy);

  const deepCloneStrategyOutput = objectMerger.combineObjects(newObj1, newObj2);
  console.assert(
    deepCloneStrategyOutput.keys === '456',
    '%o has keys = 456',
    deepCloneStrategyOutput,
  );
  console.assert(
    newObj1.keys === '123' && newObj2.keys === '456',
    'Does not mutate the original object newObj1 %o, newObj2 %o',
    newObj1,
    newObj2,
  );

  console.assert(
    deepCloneStrategyOutput.obj1 !== newObj1 &&
      deepCloneStrategyOutput.obj1.keys === newObj1.keys,
    'Does a shallow clone so deepCloneStrategyOutput.obj1 references newObj1',
  );
}
stateStrategyModern();

function visitorClassical() {
  class BankAccount {
    /**
     *
     * @param {'CURRENT' | 'SAVINGS'} accountType
     * @param {String} currency
     * @param {Number} balance - balance in minor currency unit
     */
    constructor(accountType = 'CURRENT', currency = 'USD', balance = 0) {
      this.accountType = accountType;
      this.currency = currency;
      this.balance = balance;
    }
    setBalance(balance) {
      this.balance = balance;
    }
    accept(visitor) {
      visitor.visit(this);
    }
  }
  class InterestVisitor {
    constructor(interestRate, currency) {
      this.interestRate = interestRate;
      this.currency = currency;
    }
    /**
     * @param {BankAccount} bankAccount
     */
    visit(bankAccount) {
      if (
        bankAccount.currency === this.currency &&
        bankAccount.accountType === 'SAVINGS'
      ) {
        bankAccount.setBalance((bankAccount.balance * this.interestRate) / 100);
      }
    }
  }
  const accounts = [
    new BankAccount('SAVINGS', 'GBP', 500),
    new BankAccount('SAVINGS', 'USD', 500),
    new BankAccount('CURRENT', 'USD', 10000),
  ];

  const usdInterestVisitor = new InterestVisitor(105, 'USD');
  const gbpInterestVisitor = new InterestVisitor(110, 'GBP');

  accounts.forEach((account) => {
    account.accept(usdInterestVisitor);
    account.accept(gbpInterestVisitor);
  });

  console.assert(
    accounts[0].balance === 550 &&
      accounts[1].balance === 525 &&
      accounts[2].balance === 10000,
    '%o',
    accounts,
  );
}
visitorClassical();

// Babel visitor
import * as parser from '@babel/parser';
// import traverse from '@babel/traverse';
// workaround native ESM vs "fake" ESM default export
import traverseMod from '@babel/traverse';
const traverse = traverseMod.default;

const ast = parser.parse(`function triple(n) {
  return n * 3;
}`);

const CustomVisitor = {
  FunctionDeclaration(path) {
    console.assert(path.node.id.name === 'triple');
  },
};

traverse(ast, CustomVisitor);
