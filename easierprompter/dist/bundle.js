/******/ (function(modules) { // webpackBootstrap
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/config/config.ts":
/*!******************************!*\
  !*** ./src/config/config.ts ***!
  \******************************/
/*! exports provided: ConfigManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ConfigManager\", function() { return ConfigManager; });\n/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./save */ \"./src/config/save.ts\");\n\nvar ConfigManager = (function () {\n    function ConfigManager() {\n        this.options = {};\n        this.configSaver = new _save__WEBPACK_IMPORTED_MODULE_0__[\"ConfigSaver\"](this);\n    }\n    ConfigManager.prototype.save = function () {\n        return this.configSaver.save();\n    };\n    ConfigManager.prototype.load = function () {\n        this.configSaver.load();\n    };\n    ConfigManager.prototype.promptReset = function () {\n        var message = [\n            \"Are you sure you want to reset the settings?\",\n            \"This will reset your script, the config, and reload the page.\",\n        ];\n        if (confirm(message.join(\"\\n\\n\"))) {\n            this.configSaver.reset();\n        }\n    };\n    ConfigManager.prototype.hasChanged = function () {\n        var newData = this.configSaver.generateSaveData();\n        var oldData = this.configSaver.lastSaveData;\n        for (var _i = 0, _a = Object.keys(newData); _i < _a.length; _i++) {\n            var key = _a[_i];\n            if (newData[key] !== oldData[key]) {\n                return true;\n            }\n        }\n        return false;\n    };\n    return ConfigManager;\n}());\n\n\n\n//# sourceURL=webpack:///./src/config/config.ts?");

/***/ }),

/***/ "./src/config/option.ts":
/*!******************************!*\
  !*** ./src/config/option.ts ***!
  \******************************/
/*! exports provided: ConfigOption */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ConfigOption\", function() { return ConfigOption; });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/config/utils.ts\");\n\nvar ConfigOption = (function () {\n    function ConfigOption(options) {\n        this.get = Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getterFrom\"])(options.el, options.type);\n        this.set = Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"setterFrom\"])(options.el, options.type || \"text\", options.setterOpts);\n        this.set(options.default);\n    }\n    return ConfigOption;\n}());\n\n\n\n//# sourceURL=webpack:///./src/config/option.ts?");

/***/ }),

/***/ "./src/config/prompterconfig.ts":
/*!**************************************!*\
  !*** ./src/config/prompterconfig.ts ***!
  \**************************************/
/*! exports provided: PrompterConfigManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PrompterConfigManager\", function() { return PrompterConfigManager; });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./src/utils.ts\");\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ \"./src/config/config.ts\");\n/* harmony import */ var _option__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./option */ \"./src/config/option.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\n\n\n\nvar PrompterConfigManager = (function (_super) {\n    __extends(PrompterConfigManager, _super);\n    function PrompterConfigManager() {\n        var _this = _super.call(this) || this;\n        var prompterContainer = Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"prompter-lines-container\");\n        var prompterLines = Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"prompter-lines\");\n        var caret = Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"prompter-caret\");\n        _this.options.speed = new _option__WEBPACK_IMPORTED_MODULE_2__[\"ConfigOption\"]({\n            default: 1.5,\n            el: Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"options-current-speed\"),\n            type: \"number\",\n            setterOpts: {\n                transform: function (value) {\n                    if (value < 0) {\n                        value = 0;\n                    }\n                    return value.toFixed(2);\n                },\n            },\n        });\n        _this.options.fontSize = new _option__WEBPACK_IMPORTED_MODULE_2__[\"ConfigOption\"]({\n            default: 75,\n            el: Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"options-font-size\"),\n            type: \"number\",\n            setterOpts: {\n                onchange: true,\n                callback: function (value) {\n                    prompterContainer.style.fontSize = value + \"px\";\n                },\n            },\n        });\n        _this.options.fontFamily = new _option__WEBPACK_IMPORTED_MODULE_2__[\"ConfigOption\"]({\n            default: \"sans-serif\",\n            el: Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"options-font-family\"),\n            type: \"text\",\n            setterOpts: {\n                onchange: true,\n                callback: function (value) {\n                    prompterContainer.style.fontFamily = value + \", sans-serif\";\n                },\n            },\n        });\n        _this.options.boldText = new _option__WEBPACK_IMPORTED_MODULE_2__[\"ConfigOption\"]({\n            default: true,\n            el: Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"options-bold-text\"),\n            type: \"checkbox\",\n            setterOpts: {\n                onchange: true,\n                callback: function (value) {\n                    prompterLines.style.fontWeight = value ? \"bold\" : \"normal\";\n                },\n            },\n        });\n        _this.options.lineHeight = new _option__WEBPACK_IMPORTED_MODULE_2__[\"ConfigOption\"]({\n            default: 1.15,\n            el: Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"options-line-height\"),\n            type: \"number\",\n            setterOpts: {\n                onchange: true,\n                callback: function (value) {\n                    prompterLines.style.lineHeight = '' + value;\n                },\n            },\n        });\n        _this.options.unsavedChangesWarning = new _option__WEBPACK_IMPORTED_MODULE_2__[\"ConfigOption\"]({\n            default: false,\n            el: Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"options-unsaved-changes-warning\"),\n            type: \"checkbox\",\n        });\n        _this.options.showCaret = new _option__WEBPACK_IMPORTED_MODULE_2__[\"ConfigOption\"]({\n            default: true,\n            el: Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"options-show-caret\"),\n            type: \"checkbox\",\n            setterOpts: {\n                onchange: true,\n                callback: function (value) {\n                    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"setDisplay\"])(caret, value);\n                },\n            },\n        });\n        _this.options.endText = new _option__WEBPACK_IMPORTED_MODULE_2__[\"ConfigOption\"]({\n            default: \"[END]\",\n            el: Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"options-end-text\"),\n            type: \"text\",\n        });\n        _this.options.text = new _option__WEBPACK_IMPORTED_MODULE_2__[\"ConfigOption\"]({\n            default: \"Enter your script here!\",\n            el: Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"text-input\"),\n            type: \"text\",\n        });\n        return _this;\n    }\n    return PrompterConfigManager;\n}(_config__WEBPACK_IMPORTED_MODULE_1__[\"ConfigManager\"]));\n\n\n\n//# sourceURL=webpack:///./src/config/prompterconfig.ts?");

/***/ }),

/***/ "./src/config/save.ts":
/*!****************************!*\
  !*** ./src/config/save.ts ***!
  \****************************/
/*! exports provided: ConfigSaver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ConfigSaver\", function() { return ConfigSaver; });\nvar STORE_VERSION = \"0\";\nvar STORAGE_KEY = \"easierPrompter\" + STORE_VERSION + \"_configStore\";\nvar ConfigSaver = (function () {\n    function ConfigSaver(config) {\n        this.config = config;\n        this.lastSaveData = this.generateSaveData();\n    }\n    ConfigSaver.prototype.getOptions = function () {\n        var localConfig = localStorage.getItem(STORAGE_KEY);\n        if (localConfig === null) {\n            return {};\n        }\n        else {\n            return JSON.parse(localConfig);\n        }\n    };\n    ConfigSaver.prototype.generateSaveData = function () {\n        var res = {};\n        for (var _i = 0, _a = Object.keys(this.config.options); _i < _a.length; _i++) {\n            var key = _a[_i];\n            var value = this.config.options[key];\n            res[key] = value.get();\n        }\n        return res;\n    };\n    ConfigSaver.prototype.reset = function () {\n        localStorage.removeItem(STORAGE_KEY);\n        location.reload();\n    };\n    ConfigSaver.prototype.save = function () {\n        var data = this.generateSaveData();\n        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));\n        this.lastSaveData = data;\n    };\n    ConfigSaver.prototype.load = function () {\n        var options = this.getOptions();\n        for (var _i = 0, _a = Object.keys(options); _i < _a.length; _i++) {\n            var key = _a[_i];\n            var value = options[key];\n            var configOption = this.config.options[key];\n            if (typeof configOption === \"undefined\") {\n                console.warn(\"Unknown item in save:\", key, value);\n                continue;\n            }\n            this.config.options[key].set(value);\n        }\n    };\n    return ConfigSaver;\n}());\n\n\n\n//# sourceURL=webpack:///./src/config/save.ts?");

/***/ }),

/***/ "./src/config/utils.ts":
/*!*****************************!*\
  !*** ./src/config/utils.ts ***!
  \*****************************/
/*! exports provided: getterFrom, setterFrom */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getterFrom\", function() { return getterFrom; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setterFrom\", function() { return setterFrom; });\nfunction getterFrom(el, type) {\n    if (type === void 0) { type = \"text\"; }\n    var getter = function () { return el.textContent || \"\"; };\n    if (el instanceof HTMLTextAreaElement) {\n        getter = function () { return el.value; };\n    }\n    if (el instanceof HTMLInputElement) {\n        if (el.type === \"checkbox\") {\n            getter = function () { return el.checked; };\n        }\n        else {\n            getter = function () { return el.value; };\n        }\n    }\n    if (type === \"number\") {\n        return function () {\n            var val = getter().trim();\n            if (val === \"\") {\n                return 0;\n            }\n            else {\n                return Number(val);\n            }\n        };\n    }\n    return getter;\n}\nfunction setterFrom(el, type, opts) {\n    if (opts === void 0) { opts = {}; }\n    var getBaseSetter = function () {\n        if (el instanceof HTMLTextAreaElement) {\n            return function (value) { return el.value = value; };\n        }\n        if (el instanceof HTMLInputElement) {\n            if (type === \"text\") {\n                return function (value) { return el.value = value; };\n            }\n            else if (type === \"number\") {\n                return function (value) { return el.value = value.toString(); };\n            }\n            else if (type === \"checkbox\") {\n                return function (value) { return el.checked = value; };\n            }\n            else {\n                console.warn(\"Unsupported input type: \" + type);\n            }\n        }\n        return function (value) { return el.textContent = value; };\n    };\n    var setter = getBaseSetter();\n    var stack = [];\n    if (opts.transform) {\n        stack.push(opts.transform);\n    }\n    stack.push(setter);\n    if (opts.callback) {\n        stack.push(opts.callback);\n    }\n    var functionStack = createFunctionPipe(stack);\n    if (opts.onchange) {\n        var getter_1 = getterFrom(el);\n        el.onchange = function () {\n            functionStack(getter_1());\n        };\n    }\n    return functionStack;\n}\nfunction createFunctionPipe(functions) {\n    if (functions === void 0) { functions = []; }\n    return function (value) {\n        for (var _i = 0, functions_1 = functions; _i < functions_1.length; _i++) {\n            var func = functions_1[_i];\n            value = func(value);\n        }\n        return value;\n    };\n}\n\n\n//# sourceURL=webpack:///./src/config/utils.ts?");

/***/ }),

/***/ "./src/email.ts":
/*!**********************!*\
  !*** ./src/email.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar emailEncoded = [\n    \"o\", \"m\", \"m\", \"y\", \"w\", \"e\", \"b\", \"e\", \"r\", \"3\", \"3\", \"@\", \"g\", \"m\", \"a\", \"i\", \"l\", \".\", \"c\", \"o\", \"m\", \"t\",\n].join(\"\");\nvar email = emailEncoded[emailEncoded.length - 1];\nfor (var i = 0; i < emailEncoded.length - 1; i++) {\n    email += emailEncoded[i];\n}\nvar els = document.getElementsByClassName(\"email\");\nfor (var i = 0; i < els.length; i++) {\n    var el = els[i];\n    el.textContent = email;\n    el.href = \"mailto:\" + email;\n}\n\n\n//# sourceURL=webpack:///./src/email.ts?");

/***/ }),

/***/ "./src/error/idnotfound.ts":
/*!*********************************!*\
  !*** ./src/error/idnotfound.ts ***!
  \*********************************/
/*! exports provided: ElementIDNotFoundError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ElementIDNotFoundError\", function() { return ElementIDNotFoundError; });\nvar __extends = (undefined && undefined.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nvar ElementIDNotFoundError = (function (_super) {\n    __extends(ElementIDNotFoundError, _super);\n    function ElementIDNotFoundError(id) {\n        return _super.call(this, \"Element with id '\" + id + \"' not found.\") || this;\n    }\n    return ElementIDNotFoundError;\n}(Error));\n\n\n\n//# sourceURL=webpack:///./src/error/idnotfound.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _email__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./email */ \"./src/email.ts\");\n/* harmony import */ var _email__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_email__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _sw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sw */ \"./src/sw.ts\");\n/* harmony import */ var _config_prompterconfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config/prompterconfig */ \"./src/config/prompterconfig.ts\");\n/* harmony import */ var _prompter_prompter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./prompter/prompter */ \"./src/prompter/prompter.ts\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n\n\n\n\n\nfunction getConfig() {\n    return new _config_prompterconfig__WEBPACK_IMPORTED_MODULE_2__[\"PrompterConfigManager\"]();\n}\nfunction getPrompter(cfg) {\n    return new _prompter_prompter__WEBPACK_IMPORTED_MODULE_3__[\"Prompter\"](cfg);\n}\nvar config = getConfig();\nconfig.load();\nconfig.save();\nObject(_utils__WEBPACK_IMPORTED_MODULE_4__[\"getElement\"])(\"save-button\").onclick = function () { return config.save(); };\nObject(_utils__WEBPACK_IMPORTED_MODULE_4__[\"getElement\"])(\"reset-button\").onclick = function () { return config.promptReset(); };\nvar prompter = getPrompter(config);\nwindow.addEventListener('beforeunload', function (e) {\n    if (config.options.unsavedChangesWarning.get() && prompter.config.hasChanged()) {\n        var text = [\n            \"You have unsaved changes to your config!\",\n            \"If you leave these changes will be reset!\",\n            \"(disable this warning by unchecking \\\"Unsaved changes warning\\\")\",\n        ].join(\"\\n\");\n        e.returnValue = text;\n        return text;\n    }\n}, true);\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/keyboard/keyboard.ts":
/*!**********************************!*\
  !*** ./src/keyboard/keyboard.ts ***!
  \**********************************/
/*! exports provided: Keyboard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Keyboard\", function() { return Keyboard; });\nvar Keyboard = (function () {\n    function Keyboard() {\n        this.handlers = [];\n        this.requirements = [];\n        this.keyDownHandlers = [];\n        this.keyPressHandlers = [];\n        this.keyUpHandlers = [];\n        document.addEventListener(\"keydown\", this._createEventHandler(this.keyDownHandlers));\n        document.addEventListener(\"keyup\", this._createEventHandler(this.keyUpHandlers));\n        document.addEventListener(\"keypress\", this._createEventHandler(this.keyPressHandlers));\n    }\n    Keyboard.prototype.require = function (func) {\n        this.requirements.push(func);\n    };\n    Keyboard.prototype.onKeyDown = function (keyCode, handler) {\n        this._addHandler(keyCode, handler, this.keyDownHandlers);\n    };\n    Keyboard.prototype.onKeyUp = function (keyCode, handler) {\n        this._addHandler(keyCode, handler, this.keyUpHandlers);\n    };\n    Keyboard.prototype.onKeyPress = function (keyCode, handler) {\n        this._addHandler(keyCode, handler, this.keyPressHandlers);\n    };\n    Keyboard.prototype.testRequirements = function (e) {\n        for (var _i = 0, _a = this.requirements; _i < _a.length; _i++) {\n            var func = _a[_i];\n            if (!func(e)) {\n                return false;\n            }\n        }\n        return true;\n    };\n    Keyboard.prototype._addHandler = function (keyCode, handler, eventHandlers) {\n        if (!eventHandlers[keyCode]) {\n            eventHandlers[keyCode] = [];\n        }\n        var existingHandlers = eventHandlers[keyCode];\n        existingHandlers.push(handler);\n    };\n    Keyboard.prototype._createEventHandler = function (eventHandlers) {\n        var _this = this;\n        return function (e) {\n            if (!_this.testRequirements(e)) {\n                return;\n            }\n            var keyCode = e.keyCode;\n            var handlers = eventHandlers[keyCode];\n            if (!handlers) {\n                return;\n            }\n            var preventDefault = false;\n            for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {\n                var handler = handlers_1[_i];\n                var result = handler();\n                if (result) {\n                    preventDefault = true;\n                    break;\n                }\n            }\n            if (preventDefault) {\n                e.preventDefault();\n            }\n        };\n    };\n    return Keyboard;\n}());\n\n\n\n//# sourceURL=webpack:///./src/keyboard/keyboard.ts?");

/***/ }),

/***/ "./src/prompter/abstract.ts":
/*!**********************************!*\
  !*** ./src/prompter/abstract.ts ***!
  \**********************************/
/*! exports provided: Direction, AbstractPrompter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Direction\", function() { return Direction; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AbstractPrompter\", function() { return AbstractPrompter; });\nvar ONE_FRAME = 1000 / 60;\nvar Direction;\n(function (Direction) {\n    Direction[Direction[\"Up\"] = -1] = \"Up\";\n    Direction[Direction[\"Down\"] = 1] = \"Down\";\n})(Direction || (Direction = {}));\nvar AbstractPrompter = (function () {\n    function AbstractPrompter(config) {\n        this._scrollDistance = 0;\n        this.lastFrameTime = 0;\n        this.maxScrollDistance = Infinity;\n        this.direction = Direction.Down;\n        this.showing = false;\n        this.scrolling = false;\n        this.config = config;\n        this.loop = this.loop.bind(this);\n        this.loop(0);\n    }\n    AbstractPrompter.prototype.start = function () {\n        this.scrolling = true;\n    };\n    AbstractPrompter.prototype.stop = function () {\n        this.scrolling = false;\n    };\n    AbstractPrompter.prototype.show = function () {\n        this.showing = true;\n        this.scrollDistance = 0;\n        this.loadScript(this.getScript());\n    };\n    AbstractPrompter.prototype.hide = function () {\n        this.stop();\n        this.showing = false;\n    };\n    AbstractPrompter.prototype.reverseDirection = function () {\n        if (this.direction === Direction.Up) {\n            this.direction = Direction.Down;\n        }\n        else {\n            this.direction = Direction.Up;\n        }\n    };\n    AbstractPrompter.prototype.loop = function (currentTime) {\n        requestAnimationFrame(this.loop);\n        if (!this.showing) {\n            return;\n        }\n        var timeSinceLastFrame = Math.min(currentTime - this.lastFrameTime, 1000);\n        if (this.scrolling) {\n            this.scroll(timeSinceLastFrame / ONE_FRAME);\n        }\n        this.lastFrameTime = currentTime;\n        this.render(Math.floor(this.scrollDistance));\n    };\n    AbstractPrompter.prototype.scroll = function (frames) {\n        this.scrollDistance += this.config.options.speed.get() * this.direction * frames;\n    };\n    AbstractPrompter.prototype.toggleScrolling = function () {\n        if (this.scrolling) {\n            this.stop();\n        }\n        else {\n            this.start();\n        }\n    };\n    Object.defineProperty(AbstractPrompter.prototype, \"scrollDistance\", {\n        get: function () {\n            return this._scrollDistance;\n        },\n        set: function (scrollDistance) {\n            if (scrollDistance < 0) {\n                scrollDistance = 0;\n            }\n            if (scrollDistance > this.maxScrollDistance) {\n                scrollDistance = this.maxScrollDistance;\n            }\n            this._scrollDistance = scrollDistance;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    return AbstractPrompter;\n}());\n\n\n\n//# sourceURL=webpack:///./src/prompter/abstract.ts?");

/***/ }),

/***/ "./src/prompter/prompter.ts":
/*!**********************************!*\
  !*** ./src/prompter/prompter.ts ***!
  \**********************************/
/*! exports provided: Prompter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Prompter\", function() { return Prompter; });\n/* harmony import */ var _keyboard_keyboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../keyboard/keyboard */ \"./src/keyboard/keyboard.ts\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ \"./src/utils.ts\");\n/* harmony import */ var _abstract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./abstract */ \"./src/prompter/abstract.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\n\n\n\nvar SPEED_INCREMENT = 0.25;\nvar MIN_SPEED = 0;\nvar MAX_SPEED = 10;\nvar Prompter = (function (_super) {\n    __extends(Prompter, _super);\n    function Prompter(config) {\n        var _this = _super.call(this, config) || this;\n        _this.prompterLines = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"prompter-lines\");\n        _this.prompterText = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"prompter-lines-text\");\n        _this.prompterEndText = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"prompter-lines-end-text\");\n        _this.addListeners();\n        _this.addKeyboardHandlers();\n        return _this;\n    }\n    Prompter.prototype.addListeners = function () {\n        var _this = this;\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"start-button\").addEventListener(\"click\", function (e) { return _this.show(); });\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"options-toggle-run\").addEventListener(\"click\", function (e) { return _this.toggleScrolling(); });\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"options-toggle-direction\").addEventListener(\"click\", function (e) { return _this.reverseDirection(); });\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"options-exit\").addEventListener(\"click\", function (e) { return _this.hide(); });\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"options-speed-up\").addEventListener(\"click\", function (e) { return _this.speedUp(); });\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"options-speed-down\").addEventListener(\"click\", function (e) { return _this.speedDown(); });\n        window.addEventListener(\"wheel\", function (e) {\n            if (_this.showing) {\n                _this.scrollDistance += e.deltaY;\n            }\n        });\n        window.addEventListener(\"resize\", function (e) {\n            if (_this.showing) {\n                _this.maxScrollDistance = _this.getTextLength();\n            }\n        });\n    };\n    Prompter.prototype.addKeyboardHandlers = function () {\n        var _this = this;\n        var keyboard = new _keyboard_keyboard__WEBPACK_IMPORTED_MODULE_0__[\"Keyboard\"]();\n        keyboard.require(function () { return _this.showing; });\n        keyboard.onKeyDown(32, function () { return _this.toggleScrolling(); });\n        keyboard.onKeyPress(32, function () { return _this.showing; });\n        keyboard.onKeyUp(32, function () { return _this.showing; });\n        keyboard.onKeyDown(27, function () {\n            if (_this.scrollDistance === 0) {\n                _this.hide();\n            }\n            else {\n                _this.scrollDistance = 0;\n                _this.stop();\n            }\n        });\n        keyboard.onKeyDown(38, function () { return _this.speedUp(); });\n        keyboard.onKeyDown(40, function () { return _this.speedDown(); });\n        keyboard.onKeyDown(82, function () { return _this.setDirection(_abstract__WEBPACK_IMPORTED_MODULE_2__[\"Direction\"].Up); });\n        keyboard.onKeyUp(82, function () { return _this.setDirection(_abstract__WEBPACK_IMPORTED_MODULE_2__[\"Direction\"].Down); });\n    };\n    Prompter.prototype.reverseDirection = function () {\n        _super.prototype.reverseDirection.call(this);\n        if (this.direction === _abstract__WEBPACK_IMPORTED_MODULE_2__[\"Direction\"].Up) {\n            Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"options-toggle-direction\").textContent = \"Moving Up\";\n        }\n        else {\n            Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"options-toggle-direction\").textContent = \"Moving Down\";\n        }\n    };\n    Prompter.prototype.start = function () {\n        _super.prototype.start.call(this);\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"options-toggle-run\").textContent = \"Stop\";\n    };\n    Prompter.prototype.stop = function () {\n        _super.prototype.stop.call(this);\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"options-toggle-run\").textContent = \"Start\";\n    };\n    Prompter.prototype.show = function () {\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"setDisplay\"])(Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"main\"), false);\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"setDisplay\"])(Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"prompter\"), true);\n        _super.prototype.show.call(this);\n    };\n    Prompter.prototype.hide = function () {\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"setDisplay\"])(Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"main\"), true);\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"setDisplay\"])(Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"prompter\"), false);\n        _super.prototype.hide.call(this);\n    };\n    Prompter.prototype.render = function (distance) {\n        var lines = this.prompterLines;\n        lines.style.transform = \"translateY(-\" + distance + \"px)\";\n    };\n    Prompter.prototype.loadScript = function (script) {\n        this.resetScript();\n        var scriptLines = script.split(\"\\n\");\n        for (var _i = 0, scriptLines_1 = scriptLines; _i < scriptLines_1.length; _i++) {\n            var line = scriptLines_1[_i];\n            this.addLine(line);\n        }\n        this.maxScrollDistance = this.getTextLength();\n        this.addLine(this.config.options.endText.get(), Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"prompter-lines-end-text\"));\n    };\n    Prompter.prototype.getScript = function () {\n        return Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getElement\"])(\"text-input\").value;\n    };\n    Prompter.prototype.getTextLength = function () {\n        return this.prompterText.scrollHeight;\n    };\n    Prompter.prototype.addLine = function (text, container) {\n        if (container === void 0) { container = this.prompterText; }\n        var item = document.createElement(\"p\");\n        item.textContent = text;\n        container.appendChild(item);\n    };\n    Prompter.prototype.resetScript = function () {\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"emptyElement\"])(this.prompterText);\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"emptyElement\"])(this.prompterEndText);\n    };\n    Prompter.prototype.setSpeed = function (speed) {\n        this.config.options.speed.set(Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"clamp\"])(speed, MIN_SPEED, MAX_SPEED));\n    };\n    Prompter.prototype.speedUp = function () {\n        if (this.showing) {\n            this.setSpeed(this.config.options.speed.get() + SPEED_INCREMENT);\n        }\n    };\n    Prompter.prototype.speedDown = function () {\n        if (this.showing) {\n            this.setSpeed(this.config.options.speed.get() - SPEED_INCREMENT);\n        }\n    };\n    Prompter.prototype.setDirection = function (direction) {\n        this.direction = direction;\n    };\n    return Prompter;\n}(_abstract__WEBPACK_IMPORTED_MODULE_2__[\"AbstractPrompter\"]));\n\n\n\n//# sourceURL=webpack:///./src/prompter/prompter.ts?");

/***/ }),

/***/ "./src/sw.ts":
/*!*******************!*\
  !*** ./src/sw.ts ***!
  \*******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n\nfunction serviceWorkersSupported(supported) {\n    var element = Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getElement\"])(\"sw-support\");\n    element.classList.remove(\"maybe\");\n    if (supported) {\n        element.classList.add(\"yes\");\n        element.textContent = \"is probably\";\n    }\n    else {\n        element.classList.add(\"no\");\n        element.textContent = \"is not\";\n    }\n}\nif (\"serviceWorker\" in navigator) {\n    window.addEventListener(\"load\", function () {\n        navigator.serviceWorker.register(\"sw.js\").then(function () {\n            console.log(\"Registered Service Worker\");\n            serviceWorkersSupported(true);\n        }).catch(function (err) {\n            console.error(\"Service worker registration failed:\", err);\n            serviceWorkersSupported(false);\n        });\n    });\n}\nelse {\n    serviceWorkersSupported(false);\n}\n\n\n//# sourceURL=webpack:///./src/sw.ts?");

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: getElement, setDisplay, emptyElement, clamp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getElement\", function() { return getElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setDisplay\", function() { return setDisplay; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"emptyElement\", function() { return emptyElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"clamp\", function() { return clamp; });\n/* harmony import */ var _error_idnotfound__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error/idnotfound */ \"./src/error/idnotfound.ts\");\n\nfunction getElement(id) {\n    var el = document.getElementById(id);\n    if (el === null) {\n        throw new _error_idnotfound__WEBPACK_IMPORTED_MODULE_0__[\"ElementIDNotFoundError\"](id);\n    }\n    return el;\n}\nfunction setDisplay(el, show) {\n    el.style.display = show ? \"block\" : \"none\";\n}\nfunction emptyElement(el) {\n    while (el.firstChild) {\n        el.removeChild(el.firstChild);\n    }\n}\nfunction clamp(i, min, max) {\n    if (i > max) {\n        return max;\n    }\n    else if (i < min) {\n        return min;\n    }\n    else {\n        return i;\n    }\n}\n\n\n//# sourceURL=webpack:///./src/utils.ts?");

/***/ })

/******/ });