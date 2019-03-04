import makeTask from "./make-task";
import getTask from "./get-task";

export default (amount) => {
  let tasksTemplate = [];
  for (let i = 0; i < amount; i++) {
    tasksTemplate.push(makeTask(getTask(), i));
  }
  return tasksTemplate;
};
