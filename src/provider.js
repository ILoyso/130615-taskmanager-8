import ModelTask from './model-task';

/**
 * Function for convert object to array
 * @param {Object} object
 * @return {Array}
 */
const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

/** Class for organize work API with Store (and localStorage) */
export default class Provider {

  /**
   * Create a provider
   * @param {Object} api
   * @param {Object} store
   * @param {String} generateId
   */
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }

  /**
   * Method for create task on server or on localStorage (if offline)
   * @param {Object} task
   * @return {Promise}
   */
  createTask({task}) {
    if (this._isOnline()) {
      return this._api.createTask({task})
        .then((it) => {
          this._store.setItem({key: it.id, item: it.toRAW()});
          return it;
        });
    } else {
      task.id = this._generateId();
      this._needSync = true;

      this._store.setItem({key: task.id, item: task});
      return Promise.resolve(ModelTask.parseTask(task));
    }
  }

  /**
   * Method for remove task from server or from localStorage (if offline)
   * @param {String} id
   * @return {Promise}
   */
  deleteTask({id}) {
    if (this._isOnline()) {
      return this._api.deleteTask({id})
        .then(() => {
          this._store.removeItem({key: id});
        });
    } else {
      this._needSync = true;
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  /**
   * Method for getting tasks from server or from localStorage (if offline)
   * @return {Promise}
   */
  getTasks() {
    if (this._isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          tasks.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
          return tasks;
        });
    } else {
      const rawTasksMap = this._store.getAll();
      const rawTasks = objectToArray(rawTasksMap);
      const tasks = ModelTask.parseTasks(rawTasks);

      return Promise.resolve(tasks);
    }
  }

  /**
   * Method for sync data between server and localstorage
   * @return {*|Promise<Response|never>}
   */
  syncTasks() {
    return this._api.syncTasks({tasks: objectToArray(this._store.getAll())});
  }

  /**
   * Method for update film on server or on localStorage (if offline)
   * @return {Promise}
   */
  updateTask({id, data}) {
    if (this._isOnline()) {
      return this._api.updateTask({id, data})
        .then((task) => {
          this._store.setItem({key: task.id, item: task.toRAW()});
          return task;
        });
    } else {
      const task = data;
      this._needSync = true;
      this._store.setItem({key: task.id, item: task});
      return Promise.resolve(ModelTask.parseTask(task));
    }
  }

  /**
   * Method for check if internet connect or not
   * @return {Boolean}
   * @private
   */
  _isOnline() {
    return window.navigator.onLine;
  }
}
