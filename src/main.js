import generateTasks from './generate-tasks';
import filtersData from './filters-data';
import Filter from "./filter";
import Task from './task';
import TaskEdit from './task-edit';
import moment from 'moment';

const MAX_NUMBER_OF_TASKS = 7;

const filterContainer = document.querySelector(`.main__filter`);
const tasksContainer = document.querySelector(`.board__tasks`);


/**
 * Function for generate array with all tasks data
 * @param {Number} amount
 * @return {Object[]}
 */
const generateTasksTemplates = (amount) => generateTasks(amount);

const tasksData = generateTasksTemplates(MAX_NUMBER_OF_TASKS);


/**
 * Function for render all tasks
 * @param {Node} container
 * @param {Object} tasks
 */
const renderTasks = (container, tasks) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();

  tasks.forEach((task, index) => {
    const taskComponent = new Task(task);

    taskComponent.onEdit = () => {
      const editTaskComponent = new TaskEdit(task, index);

      editTaskComponent.onSubmit = (newObject) => {
        taskComponent.update(Object.assign(task, newObject));
        taskComponent.render();
        container.replaceChild(taskComponent.element, editTaskComponent.element);
        editTaskComponent.unrender();
      };

      editTaskComponent.onDelete = () => {
        taskComponent.delete();
        editTaskComponent.unrender();
      };

      editTaskComponent.render();
      container.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    fragment.appendChild(taskComponent.render());
  });

  container.appendChild(fragment);
};


/**
 * Function for filter tasks
 * @param {Object} tasks
 * @param {String} filterName
 * @return {Object}
 */
const filterTasks = (tasks, filterName) => {
  let filteredTasks = tasks;

  switch (filterName) {
    case `all`:
      filteredTasks = tasks;
      break;
    case `overdue`:
      filteredTasks = tasks.filter((it) => it.dueDate < Date.now());
      break;
    case `today`:
      filteredTasks = tasks.filter((it) => moment(it.dueDate).format(`DD`) === moment().format(`DD`));
      break;
    case `repeating`:
      filteredTasks = tasks.filter((it) => Object.values(it.repeatingDays).some((day) => day));
      break;
  }

  return filteredTasks;
};


/**
 * Function for render filters
 * @param {Node} container
 * @param {Object} filters
 * @param {Object} tasks
 */
const renderFilters = (container, filters, tasks) => {
  const fragment = document.createDocumentFragment();

  filters.forEach((filter) => {
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = () => {
      const filterName = filterComponent.filterId;
      const filteredTasks = filterTasks(tasks, filterName);
      renderTasks(tasksContainer, filteredTasks);
    };

    fragment.appendChild(filterComponent.render());
  });

  container.appendChild(fragment);
};


renderTasks(tasksContainer, tasksData);
renderFilters(filterContainer, filtersData, tasksData);
