/** Class for help transforming data from server to our model */
export default class ModelTask {

  /**
   * Transform data from server to our app
   * @param {Object} data
   */
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`title`] || ``;
    this.dueDate = data[`due_date`];
    this.tags = new Set(data[`tags`] || []);
    this.picture = data[`picture`] || ``;
    this.repeatingDays = data[`repeating_days`];
    this.color = data[`color`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.isDone = Boolean(data[`is_done`]);
  }

  /**
   * Method for transform task data from our data model to server
   * @return {Object}
   */
  toRAW() {
    return {
      'id': this.id,
      'title': this.title,
      'due_date': this.dueDate,
      'tags': [...this.tags.values()],
      'picture': this.picture,
      'repeating_days': this.repeatingDays,
      'color': this.color,
      'is_favorite': this.isFavorite,
      'is_done': this.isDone,
    };
  }

  /**
   * Method for parse task
   * @param {Object} data
   * @return {Object}
   */
  static parseTask(data) {
    return new ModelTask(data);
  }

  /**
   * Method for parse tasks
   * @param {Array} data
   * @return {Array}
   */
  static parseTasks(data) {
    return data.map(ModelTask.parseTask);
  }
}
