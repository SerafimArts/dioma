import Inject from "./Inject";
import {Resolver, FactoryResolver, SingletonResolver} from "./Resolvers";

export default class Container {
    /**
     * @type {Object.<string, Resolver>}
     * @private
     */
    _items = {};

    /**
     * @constructor
     */
    constructor() {
        window.Inject = Inject;
    }

    /**
     * @param {string|Function} classOrName
     * @param {Function} __class
     * @return {Container}
     */
    singleton(classOrName, __class: ?Function = null): Container {
        [classOrName, __class] = this._resolveArguments(classOrName, __class);

        this._items[classOrName] = new SingletonResolver(__class);

        return this;
    }

    /**
     * @param {string|Function} classOrName
     * @param __class
     * @return {Container}
     */
    factory(classOrName, __class: ?Function = null): Container {
        [classOrName, __class] = this._resolveArguments(classOrName, __class);

        this._items[classOrName] = new FactoryResolver(__class);

        return this;
    }

    /**
     * @param {string|Function} classOrName
     * @param {Function|null} __class
     * @return {Container}
     */
    _resolveArguments(classOrName,  __class: ?Function = null) {
        if (__class === null) {
            __class = classOrName;
        }

        return [this._getName(classOrName), this._getDependency(__class)];

    }

    /**
     * @param {Function|string} dependency
     * @return {Function}
     * @private
     */
    _getDependency(dependency): Function {
        if (dependency instanceof Function) {
            return dependency;
        }

        return require(`./../${dependency}`).default;
    }

    /**
     * @param {Function|string} classOrName
     * @return {string}
     * @private
     */
    _getName(classOrName): string {
        if (classOrName instanceof Function) {
            return classOrName.name;
        }

        return classOrName;
    }

    /**
     * @param {string|Function} classOrName
     * @return {Resolver|null}
     * @private
     */
    _getResolver(classOrName) {
        classOrName = this._getName(classOrName);

        return this._items[classOrName] || null;
    }

    /**
     * @param {string|Function} classOrName
     * @return {boolean}
     */
    has(classOrName) {
        return !!this._getResolver(classOrName);
    }

    /**
     * @param {string|Function} classOrName
     * @return {*}
     */
    get(classOrName) {
        if (!this.has(classOrName)) {
            if (classOrName instanceof Function) {
                this.factory(classOrName.name, classOrName);
            } else {
                throw new ReferenceError(`Invalid container reference ${classOrName}`);
            }
        }

        return this._getResolver(classOrName).resolve(this);
    }
}
