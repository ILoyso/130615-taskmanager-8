import getTask from "./get-task";

export default (amount) => {
  let tasks = [];
  for (let i = 0; i < amount; i++) {
    tasks.push(getTask());
  }
  return tasks;
};
