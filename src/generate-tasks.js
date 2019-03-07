import getTask from "./get-task";

/**
 * Function for generate array of tasks data
 * @param {Number} amount
 * @return {Object[]}
 */
export default (amount) => {
  let tasks = [];
  for (let i = 0; i < amount; i++) {
    tasks.push(getTask());
  }
  return tasks;
};
