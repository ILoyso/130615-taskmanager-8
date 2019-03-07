import {generateRandomNumber} from './utils';
import makeFilter from './make-filter';
import generateTasks from './generate-tasks';
import filters from './filters';

import Task from './task';
import TaskEdit from './task-edit';

const MAX_NUMBER_OF_TASKS = 7;

const filterContainer = document.querySelector(`.main__filter`);
const tasksContainer = document.querySelector(`.board__tasks`);

const createFiltersTemplate = (filtersData) => {
  let filtersTemplate = ``;
  for (const filter of filtersData) {
    const isChecked = filter.isChecked;
    const randomNumber = isChecked ? generateRandomNumber(30, 1) : generateRandomNumber(30);
    filtersTemplate += makeFilter(filter.name, randomNumber, isChecked);
  }
  return filtersTemplate;
};

const generateTasksTemplates = (amount) => generateTasks(amount);

const renderFilters = (filtersData) => filterContainer.insertAdjacentHTML(`beforeend`, createFiltersTemplate(filtersData));

const renderTasks = (dist, tasks) => {
  const fragment = document.createDocumentFragment();

  tasks.forEach((task, index) => {
    const taskComponent = new Task(task);
    const editTaskComponent = new TaskEdit(task, index);

    taskComponent.onEdit = () => {
      editTaskComponent.render();
      dist.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    editTaskComponent.onSubmit = () => {
      taskComponent.render();
      dist.replaceChild(taskComponent.element, editTaskComponent.element);
      editTaskComponent.unrender();
    };

    fragment.appendChild(taskComponent.render());
  });

  dist.appendChild(fragment);
};

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
