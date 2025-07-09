export const createElement = (tag, className, innerHTML = '') => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
};

export const querySelector = selector => document.querySelector(selector);
export const querySelectorAll = selector => Array.from(document.querySelectorAll(selector));

export const addEventListeners = (selector, event, handler) => 
  querySelectorAll(selector).forEach(el => el.addEventListener(event, handler));