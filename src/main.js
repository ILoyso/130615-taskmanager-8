import filtersData from './filters-data';
import Filter from "./filter";
import Task from './task';
import TaskEdit from './task-edit';
import Statistic from "./statistic";
import moment from 'moment';
import API from './api';

const HIDDEN_CLASS = `visually-hidden`;

const loadingContainer = document.querySelector(`.board__no-tasks`);
const filterContainer = document.querySelector(`.main__filter`);
const tasksContainer = document.querySelector(`.board__tasks`);
const tasksBoard = document.querySelector(`.board`);
const tasksButton = document.querySelector(`#control__task`);
const statisticContainer = document.querySelector(`.statistic`);
const statisticButton = document.querySelector(`#control__statistic`);
const loadMoreButton = document.querySelector(`.load-more`);

const AUTHORIZATION = `Basic lo7y54048s984030o`;
const END_POINT = `https://es8-demo-srv.appspot.com/task-manager`;


/**
 * Create new api for working with server
 * @type {API}
 */
const api = new API({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});


/**
 * Function for render all tasks
 * @param {Object[]} tasks
 * @param {Node} container [container=tasksContainer]
 */
const renderTasks = (tasks, container = tasksContainer) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();

  tasks.forEach((task) => {
    const taskComponent = new Task(task);

    taskComponent.onEdit = () => {
      const editTaskComponent = new TaskEdit(task);

      editTaskComponent.onSubmit = (updatedTask) => {
        task = Object.assign(task, updatedTask);

        api.updateTask({id: task.id, data: task.toRAW()})
          .then((newTask) => {
            editTaskComponent.unblock();
            taskComponent.update(newTask);
            taskComponent.render();
            container.replaceChild(taskComponent.element, editTaskComponent.element);
            editTaskComponent.unrender();
          })
          .catch(() => {
            editTaskComponent.shake();
            editTaskComponent.unblock();
          });
      };

      editTaskComponent.onDelete = () => {
        api.deleteTask({id: task.id})
          .then(() => api.getTasks())
          .then(renderTasks)
          .catch(() => {
            editTaskComponent.shake();
            editTaskComponent.unblock();
          });
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
 * @param {Object[]} tasks
 * @param {String} filterName
 * @return {Object[]}
 */
const filterTasks = (tasks, filterName) => {
  let filteredTasks = tasks;

  switch (filterName) {
    case `all`:
      filteredTasks = tasks;
      break;
    case `overdue`:
      filteredTasks = tasks.filter((task) => task.dueDate ? task.dueDate < Date.now() : false);
      break;
    case `today`:
      filteredTasks = tasks.filter((task) => task.dueDate ? moment(task.dueDate).format(`DD`) === moment().format(`DD`) : false);
      break;
    case `repeating`:
      filteredTasks = tasks.filter((task) => Object.values(task.repeatingDays).some((day) => day));
      break;
  }

  return filteredTasks;
};


/**
 * Function for check should 'Load more' button be visible or no
 * @param {Object[]} tasks
 */
const checkLoadMoreButton = (tasks) => {
  if (tasks.length === 0) {
    loadMoreButton.classList.add(HIDDEN_CLASS);
  } else {
    loadMoreButton.classList.remove(HIDDEN_CLASS);
  }
};


/**
 * Function for render filters
 * @param {Object} filters
 * @param {Object[]} tasks
 * @param {Node} container [container=filterContainer]
 */
const renderFilters = (filters, tasks, container = filterContainer) => {
  const fragment = document.createDocumentFragment();

  filters.forEach((filter) => {
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = () => {
      const filterName = filterComponent.filterId;
      const filteredTasks = filterTasks(tasks, filterName);
      checkLoadMoreButton(filteredTasks);
      renderTasks(filteredTasks);
    };

    fragment.appendChild(filterComponent.render());
  });

  container.appendChild(fragment);
};


/** Function for hide statistic and show tasks */
const showTasks = () => {
  tasksBoard.classList.remove(HIDDEN_CLASS);
  statisticContainer.classList.add(HIDDEN_CLASS);
};


/** Function for hide tasks and show statistic */
const showStatistic = () => {
  tasksBoard.classList.add(HIDDEN_CLASS);
  statisticContainer.classList.remove(HIDDEN_CLASS);
};


/**
 * Function for create statistic
 * @param {Object[]} tasks
 */
const createStatistic = (tasks) => {
  const statisticComponent = new Statistic(tasks);
  statisticContainer.appendChild(statisticComponent.render());
};


/**
 * Function for show loader
 * @param {String} text
 */
const showLoader = (text = `Loading tasks...`) => {
  loadingContainer.textContent = text;
  loadingContainer.classList.remove(HIDDEN_CLASS);
};


/** Function for hide loader */
const hideLoader = () => {
  loadingContainer.textContent = `Loading tasks...`;
  loadingContainer.classList.add(HIDDEN_CLASS);
};


showLoader();

api.getTasks()
  .then((tasks) => {
    hideLoader();
    renderTasks(tasks);
    renderFilters(filtersData, tasks);
    createStatistic(tasks);
  })
  .catch(() => {
    showLoader(`Something went wrong while loading your tasks. Check your connection or try again later`);
  });


tasksButton.addEventListener(`click`, showTasks);
statisticButton.addEventListener(`click`, showStatistic);
