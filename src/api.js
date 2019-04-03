import ModelTask from './model-task';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};


/**
 * Function for check if response from server is Ok (200-300)
 * @param {Response} response
 * @return {*}
 */
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};


/**
 * Function for check that data from server is json
 * @param {Response} response
 * @return {Promise<json>}
 */
const toJSON = (response) => {
  return response.json();
};


/**
 * Class representing a API for working with server
 * @type {API}
 */
export default class API {

  /**
   * Create api for working with server
   * @param {String} endPoint - server url
   * @param {String} authorization
   */
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  /**
   * Method for getting tasks from server
   * @return {Promise<Response>}
   */
  getTasks() {
    return this._load({url: `tasks`})
      .then(toJSON)
      .then(ModelTask.parseTasks);
  }

  /**
   * Method for create new task on server
   * @param {Object} task
   * @return {Promise<Response>}
   */
  createTask({task}) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTask.parseTask);
  }

  /**
   * Method for sync data between server and localStorage
   * @param {Object[]} tasks
   * @return {Promise<Response | never>}
   */
  syncTasks({tasks}) {
    return this._load({
      url: `tasks/sync`,
      method: `POST`,
      body: JSON.stringify(tasks),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  /**
   * Method for update task on server
   * @param {Number} id
   * @param {Object} data
   * @return {Promise<Response>}
   */
  updateTask({id, data}) {
    return this._load({
      url: `tasks/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTask.parseTask);
  }

  /**
   * Method for delete task on server
   * @param {Number} id
   * @return {Promise<Response>}
   */
  deleteTask({id}) {
    return this._load({url: `tasks/${id}`, method: Method.DELETE});
  }

  /**
   * Method for load data
   * @param {String} url
   * @param {String} method
   * @param {Body} body
   * @param {Headers} headers
   * @return {Promise<Response>}
   * @private
   */
  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
