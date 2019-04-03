/** Class for working with localStorage */
export default class Store {

  /**
   * Create a Store
   * @param {String} key
   * @param {localStorage} storage
   */
  constructor({key, storage}) {
    this._storage = storage;
    this._storeKey = key;
  }

  /**
   * Method for update task in localStorage
   * @param {String} key
   * @param {Object} item
   */
  setItem({key, item}) {
    const items = this.getAll();
    items[key] = item;

    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  /**
   * Method for getting task from localStorage
   * @param {String} key
   * @return {*}
   */
  getItem({key}) {
    const items = this.getAll();
    return items[key];
  }

  /**
   * Method for remove task from localStorage
   * @param {String} key
   */
  removeItem({key}) {
    const items = this.getAll();
    delete items[key];

    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  /**
   * Method for getting tasks from localStorage
   * @return {any}
   */
  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._storeKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (e) {
      return emptyItems;
    }
  }
}
