import {generateRandomNumber} from './utils';
import makeFilter from './make-filter';
import generateTasks from './generate-tasks';
import filters from './filters';
import Task from './task';
import TaskEdit from './task-edit';

const MAX_NUMBER_OF_TASKS = 7;

const filterContainer = document.querySelector(`.main__filter`);
const tasksContainer = document.querySelector(`.board__tasks`);


/**
 * Function for generate all filters template
 * @param {Object[]} filtersData
 * @return {String}
 */
const createFiltersTemplate = (filtersData) => {
  let filtersTemplate = ``;
  for (const filter of filtersData) {
    const isChecked = filter.isChecked;
    const randomNumber = isChecked ? generateRandomNumber(30, 1) : generateRandomNumber(30);
    filtersTemplate += makeFilter(filter.name, randomNumber, isChecked);
  }
  return filtersTemplate;
};


/**
 * Function for generate array with all tasks data
 * @param {Number} amount
 * @return {Object[]}
 */
const generateTasksTemplates = (amount) => generateTasks(amount);


/**
 * Function for render all filters
 * @param {Object[]} filtersData
 * @return {HTMLElement}
 */
const renderFilters = (filtersData) => filterContainer.insertAdjacentHTML(`beforeend`, createFiltersTemplate(filtersData));


/**
 * Function for render all tasks
 * @param {Node} container
 * @param {Number} tasks
 */
const renderTasks = (container, tasks) => {
  const fragment = document.createDocumentFragment();

  tasks.forEach((task, index) => {
    const taskComponent = new Task(task);
    const editTaskComponent = new TaskEdit(task, index);

    taskComponent.onEdit = () => {
      editTaskComponent.render();
      container.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    editTaskComponent.onSubmit = () => {
      taskComponent.render();
      container.replaceChild(taskComponent.element, editTaskComponent.element);
      editTaskComponent.unrender();
    };

    fragment.appendChild(taskComponent.render());
  });

  container.appendChild(fragment);
};


/**
 * Function on filter click - generate new tasks
 * @param {Event} evt
 */
const onFilterClick = (evt) => {
  const clickedTagName = evt.target.tagName.toLowerCase();
  if (clickedTagName === `input`) {
    tasksContainer.innerHTML = ``;
    renderTasks(tasksContainer, generateTasksTemplates(generateRandomNumber(10)));
  }
};


renderTasks(tasksContainer, generateTasksTemplates(MAX_NUMBER_OF_TASKS));
renderFilters(filters);

filterContainer.addEventListener(`click`, onFilterClick);
