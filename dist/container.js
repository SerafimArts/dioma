require.register("Di/Container", function(exports, require, module){
  "use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Resolver = require("/Di/Resolver");

var _Resolver2 = _interopRequireDefault(_Resolver);

var _Exceptions = require("/Di/Exceptions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container = function () {
    function Container() {
        _classCallCheck(this, Container);

        this._dependencies = new Map();
    }

    _createClass(Container, [{
        key: "bind",
        value: function bind(alias, concrete) {
            this._dependencies.set(alias, new _Resolver.FactoryResolver(this, concrete));

            return this;
        }
    }, {
        key: "singleton",
        value: function singleton(alias, concrete) {
            this._dependencies.set(alias, new _Resolver.SingletonResolver(this, concrete));

            return this;
        }
    }, {
        key: "has",
        value: function has(alias) {
            return this._dependencies.has(alias);
        }
    }, {
        key: "make",
        value: function make(alias) {
            if (!this.has(alias)) {
                throw new _Exceptions.ServiceNotFoundException(alias);
            }

            return this._dependencies.get(alias).resolve();
        }
    }]);

    return Container;
}();

exports.default = Container;
  
});


require.register("Di/Exceptions", function(exports, require, module){
  "use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContainerException = exports.ContainerException = function (_Error) {
    _inherits(ContainerException, _Error);

    function ContainerException() {
        _classCallCheck(this, ContainerException);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ContainerException).apply(this, arguments));
    }

    return ContainerException;
}(Error);

var ServiceNotFoundException = exports.ServiceNotFoundException = function (_ContainerException) {
    _inherits(ServiceNotFoundException, _ContainerException);

    function ServiceNotFoundException(name) {
        _classCallCheck(this, ServiceNotFoundException);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ServiceNotFoundException).call(this, "Service \"" + (name.name || name).toString() + "\" not found"));
    }

    return ServiceNotFoundException;
}(ContainerException);

var ServiceResolvingException = exports.ServiceResolvingException = function (_ContainerException2) {
    _inherits(ServiceResolvingException, _ContainerException2);

    function ServiceResolvingException() {
        _classCallCheck(this, ServiceResolvingException);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ServiceResolvingException).apply(this, arguments));
    }

    return ServiceResolvingException;
}(ContainerException);
  
});


require.register("Di/Reflection", function(exports, require, module){
  'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReflectionException = function (_Error) {
    _inherits(ReflectionException, _Error);

    function ReflectionException() {
        _classCallCheck(this, ReflectionException);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ReflectionException).apply(this, arguments));
    }

    return ReflectionException;
}(Error);

var ReflectionFunction = exports.ReflectionFunction = function () {
    function ReflectionFunction(closure) {
        _classCallCheck(this, ReflectionFunction);

        this._closure = closure;
    }

    _createClass(ReflectionFunction, [{
        key: '_getMatches',
        value: function _getMatches() {
            return this._closure.toString().match(/function\s*\((.*?)\)\s*\{/) || [];
        }
    }, {
        key: 'getArguments',
        value: function getArguments() {
            return (this._getMatches()[1] || '').replace(/\s+/g, '').split(',');
        }
    }, {
        key: 'getName',
        value: function getName() {
            return this._closure.name || 'Function@Anonymous';
        }
    }, {
        key: 'invoke',
        value: function invoke() {
            return this._closure.apply(this, arguments);
        }
    }]);

    return ReflectionFunction;
}();

var ReflectionClass = exports.ReflectionClass = function (_ReflectionFunction) {
    _inherits(ReflectionClass, _ReflectionFunction);

    function ReflectionClass(cls) {
        _classCallCheck(this, ReflectionClass);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(ReflectionClass).call(this, cls));

        _this2._class = cls;
        return _this2;
    }

    _createClass(ReflectionClass, [{
        key: '_getMatches',
        value: function _getMatches() {
            return this._closure.toString().match(/function\s*.*?\s*\((.*?)\)\s*\{/) || [];
        }
    }, {
        key: 'getName',
        value: function getName() {
            return _get(Object.getPrototypeOf(ReflectionClass.prototype), 'getName', this).call(this) + ' class';
        }
    }, {
        key: 'invoke',
        value: function invoke() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return new (Function.prototype.bind.apply(this._class, [null].concat(args)))();
        }
    }]);

    return ReflectionClass;
}(ReflectionFunction);
  
});


require.register("Di/Resolver", function(exports, require, module){
  'use strict';

exports.SingletonResolver = exports.FactoryResolver = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Container = require('/Di/Container');

var _Container2 = _interopRequireDefault(_Container);

var _Reflection = require('/Di/Reflection');

var _Exceptions = require('/Di/Exceptions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Resolver = function () {
    function Resolver(container, declaration) {
        _classCallCheck(this, Resolver);

        this._resolvedArgs = [];

        this._container = container;
        this._declaration = declaration;
    }

    _createClass(Resolver, [{
        key: 'isFunction',
        value: function isFunction() {
            return this._declaration instanceof Function && (!this._declaration.name || this._declaration.name === 'Function');
        }
    }, {
        key: 'isInstance',
        value: function isInstance() {
            return this._declaration !== null && _typeof(this._declaration) === 'object';
        }
    }, {
        key: 'isClass',
        value: function isClass() {
            return this._declaration.name && this._declaration.name !== 'Function' && this._declaration instanceof Function;
        }
    }, {
        key: 'getContainer',
        value: function getContainer() {
            return this._container;
        }
    }, {
        key: 'getConcrete',
        value: function getConcrete() {
            return this._declaration;
        }
    }, {
        key: 'resolve',
        value: function resolve(reflection) {
            if (this._resolvedArgs.length === 0) {
                var i = 0,
                    args = reflection.getArguments();
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var arg = _step.value;

                        i++;
                        if (!this.getContainer().has(arg)) {
                            throw new _Exceptions.ServiceResolvingException('Can not resolve argument#' + i + ' "' + arg + '" for ' + reflection.getName());
                        }

                        var argument = this.getContainer().make(arg);

                        this._resolvedArgs.push(argument);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }

            return reflection.invoke.apply(reflection, _toConsumableArray(this._resolvedArgs));
        }
    }]);

    return Resolver;
}();

exports.default = Resolver;

var FactoryResolver = exports.FactoryResolver = function (_Resolver) {
    _inherits(FactoryResolver, _Resolver);

    function FactoryResolver() {
        _classCallCheck(this, FactoryResolver);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(FactoryResolver).apply(this, arguments));
    }

    _createClass(FactoryResolver, [{
        key: 'resolve',
        value: function resolve() {
            switch (true) {
                case this.isInstance():
                    return this.getConcrete();
                case this.isClass():
                    return _get(Object.getPrototypeOf(FactoryResolver.prototype), 'resolve', this).call(this, new _Reflection.ReflectionClass(this.getConcrete()));
                case this.isFunction():
                    return _get(Object.getPrototypeOf(FactoryResolver.prototype), 'resolve', this).call(this, new _Reflection.ReflectionFunction(this.getConcrete()));
            }

            return this.getConcrete();
        }
    }]);

    return FactoryResolver;
}(Resolver);

var SingletonResolver = exports.SingletonResolver = function (_FactoryResolver) {
    _inherits(SingletonResolver, _FactoryResolver);

    function SingletonResolver() {
        var _Object$getPrototypeO;

        var _temp, _this2, _ret;

        _classCallCheck(this, SingletonResolver);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(SingletonResolver)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this2), _this2._resolvableInstance = null, _temp), _possibleConstructorReturn(_this2, _ret);
    }

    _createClass(SingletonResolver, [{
        key: 'resolve',
        value: function resolve() {
            if (this._resolvableInstance === null) {
                this._resolvableInstance = _get(Object.getPrototypeOf(SingletonResolver.prototype), 'resolve', this).call(this);
            }

            return this._resolvableInstance;
        }
    }]);

    return SingletonResolver;
}(FactoryResolver);
  
});


//# sourceMappingURL=container.js.map
