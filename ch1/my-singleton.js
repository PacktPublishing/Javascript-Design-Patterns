class MySingleton {
  constructor(value) {
    this.value = value;
  }
}
export default new MySingleton('my-value');
