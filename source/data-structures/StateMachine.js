import EventEmitter from 'eventemitter3';

export default class extends EventEmitter {
  constructor(initialState) {
    super()
    this._state = initialState;
  }
  get state() {
    return this._state;
  }
  set state(newState) {
    if (newState !== this._state) {
      let oldState = this._state;
      this._state = newState;
      this.emit('state-change', newState, oldState);
    }
  }
}