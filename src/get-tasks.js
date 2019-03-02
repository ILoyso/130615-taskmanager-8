import makeTask from "./make-task";
import generateTask from "./generate-task";

export default (amount) => {
  let tasksTemplate = [];
  for (let i = 0; i < amount; i++) {
    tasksTemplate.push(makeTask(generateTask(), i));
  }
  return tasksTemplate;
};
