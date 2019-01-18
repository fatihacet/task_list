(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TaskList"] = factory();
	else
		root["TaskList"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var NodeArray, TaskList, closest, createEvent,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

NodeArray = function(nodeList) {
  return Array.prototype.slice.apply(nodeList);
};

closest = function(el, className) {
  while (el && !el.classList.contains(className)) {
    el = el.parentNode;
  }
  return el;
};

createEvent = function(eventName, detail) {
  var event;
  if (typeof Event === 'function') {
    event = new Event(eventName, {
      bubbles: true,
      cancelable: true
    });
    event.detail = detail;
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, true, true, detail);
  }
  return event;
};

TaskList = (function() {
  function TaskList(el1) {
    this.el = el1;
    this.container = closest(this.el, 'js-task-list-container');
    this.field = this.container.querySelector('.js-task-list-field');
    this.container.addEventListener('change', (function(_this) {
      return function(event) {
        if (event.target.classList.contains('task-list-item-checkbox')) {
          return _this.updateTaskList(event.target);
        }
      };
    })(this));
    this.enable();
  }

  TaskList.prototype.enable = function() {
    var event;
    if (this.container.querySelectorAll('.js-task-list-field').length > 0) {
      NodeArray(this.container.querySelectorAll('.task-list-item')).forEach(function(item) {
        return item.classList.add('enabled');
      });
      NodeArray(this.container.querySelectorAll('.task-list-item-checkbox')).forEach(function(checkbox) {
        return checkbox.disabled = false;
      });
      this.container.classList.add('is-task-list-enabled');
      event = createEvent('tasklist:enabled');
      return this.container.dispatchEvent(event);
    }
  };

  TaskList.prototype.disable = function() {
    var event;
    NodeArray(this.container.querySelectorAll('.task-list-item')).forEach(function(item) {
      return item.classList.remove('enabled');
    });
    NodeArray(this.container.querySelectorAll('.task-list-item-checkbox')).forEach(function(checkbox) {
      return checkbox.disabled = true;
    });
    this.container.classList.remove('is-task-list-enabled');
    event = createEvent('tasklist:disabled');
    return this.container.dispatchEvent(event);
  };

  TaskList.prototype.updateTaskList = function(item) {
    var changeEvent, changedEvent, checkboxes, index, lineNumber, lineSource, ref, result;
    checkboxes = this.container.querySelectorAll('.task-list-item-checkbox');
    index = 1 + NodeArray(checkboxes).indexOf(item);
    changeEvent = createEvent('tasklist:change', {
      index: index,
      checked: item.checked
    });
    this.field.dispatchEvent(changeEvent);
    if (!changeEvent.defaultPrevented) {
      ref = TaskList.updateSource(this.field.value, index, item.checked), result = ref.result, lineNumber = ref.lineNumber, lineSource = ref.lineSource;
      this.field.value = result;
      changeEvent = createEvent('change');
      this.field.dispatchEvent(changeEvent);
      changedEvent = createEvent('tasklist:changed', {
        index: index,
        checked: item.checked,
        lineNumber: lineNumber,
        lineSource: lineSource
      });
      return this.field.dispatchEvent(changedEvent);
    }
  };

  TaskList.incomplete = "[ ]";

  TaskList.complete = "[x]";

  TaskList.escapePattern = function(str) {
    return str.replace(/([\[\]])/g, "\\$1").replace(/\s/, "\\s").replace("x", "[xX]");
  };

  TaskList.incompletePattern = RegExp("" + (TaskList.escapePattern(TaskList.incomplete)));

  TaskList.completePattern = RegExp("" + (TaskList.escapePattern(TaskList.complete)));

  TaskList.itemPattern = RegExp("^(?:\\s*(?:>\\s*)*(?:[-+*]|(?:\\d+\\.)))\\s*(" + (TaskList.escapePattern(TaskList.complete)) + "|" + (TaskList.escapePattern(TaskList.incomplete)) + ")\\s");

  TaskList.startFencesPattern = /^`{3}.*$/;

  TaskList.endFencesPattern = /^`{3}$/;

  TaskList.itemsInParasPattern = RegExp("^(" + (TaskList.escapePattern(TaskList.complete)) + "|" + (TaskList.escapePattern(TaskList.incomplete)) + ").+$", "g");

  TaskList.updateSource = function(source, itemIndex, checked) {
    var clean, i, inCodeBlock, index, line, lineNumber, lineSource, result;
    clean = source.replace(/\r/g, '').replace(this.itemsInParasPattern, '').split("\n");
    index = 0;
    inCodeBlock = false;
    lineNumber;
    lineSource;
    result = (function() {
      var j, len, ref, results;
      ref = source.split("\n");
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        line = ref[i];
        if (inCodeBlock) {
          if (line.match(this.endFencesPattern)) {
            inCodeBlock = false;
          }
        } else if (line.match(this.startFencesPattern)) {
          inCodeBlock = true;
        } else if (indexOf.call(clean, line) >= 0 && line.match(this.itemPattern)) {
          index += 1;
          if (index === itemIndex) {
            lineNumber = i + 1;
            lineSource = line;
            line = checked ? line.replace(this.incompletePattern, this.complete) : line.replace(this.completePattern, this.incomplete);
          }
        }
        results.push(line);
      }
      return results;
    }).call(this);
    return {
      result: result.join("\n"),
      lineNumber: lineNumber,
      lineSource: lineSource
    };
  };

  return TaskList;

})();

if (typeof jQuery !== 'undefined') {
  jQuery.fn.taskList = function(method) {
    return this.each(function(index, el) {
      var taskList;
      taskList = jQuery(el).data('task-list');
      if (!taskList) {
        taskList = new TaskList(el);
        jQuery(el).data('task-list', taskList);
        if (!method || method === 'enable') {
          return;
        }
      }
      return taskList[method || 'enable']();
    });
  };
}

module.exports = TaskList;


/***/ })
/******/ ]);
});