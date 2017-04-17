import Inject from "./Inject";
import {Resolver, FactoryResolver, SingletonResolver} from "./Resolvers";

type ServiceIdentifier = string | Function;

export default class Container {
    /**
     * @type {Object.<string, Resolver>}
     * @private
     */
    _items = {};

    /**
     * @type {string}
     * @private
     */
    _basePath = '';

    /**
     * @param {string} basePath
     * @param {boolean} exportInjections
     */
    constructor(basePath: string = './..', exportInjections: boolean = true) {
        this._basePath = basePath;

        if (exportInjections) {
            window.Inject = Inject;
        }
    }

    /**
     * @param {ServiceIdentifier} classOrName
     * @param {Function} __class
     * @return {Container}
     */
    singleton(classOrName: ServiceIdentifier, __class: ?Function = null): Container {
        [classOrName, __class] = this._resolveArguments(classOrName, __class);

        this._items[classOrName] = new SingletonResolver(__class);

        return this;
    }

    /**
     * @param {ServiceIdentifier} classOrName
     * @param {Function|null} __class
     * @return {Container}
     */
    factory(classOrName: ServiceIdentifier, __class: ?Function = null): Container {
        [classOrName, __class] = this._resolveArguments(classOrName, __class);

        this._items[classOrName] = new FactoryResolver(__class);

        return this;
    }

    /**
     * @param {ServiceIdentifier} classOrName
     * @param {Function|null} __class
     * @return {Container}
     */
    _resolveArguments(classOrName: ServiceIdentifier,  __class: ?Function = null) {
        if (__class === null) {
            __class = classOrName;
        }

        return [this._getName(classOrName), this._getDependency(__class)];

    }

    /**
     * @param {ServiceIdentifier} dependency
     * @return {Function}
     * @private
     */
    _getDependency(dependency: ServiceIdentifier): Function {
        if (dependency instanceof Function) {
            return dependency;
        }

        return require(`${this._basePath}/${dependency}`).default;
    }

    /**
     * @param {ServiceIdentifier} classOrName
     * @return {string}
     * @private
     */
    _getName(classOrName: ServiceIdentifier): string {
        if (classOrName instanceof Function) {
            return classOrName.name;
        }

        return classOrName;
    }

    /**
     * @param {ServiceIdentifier} classOrName
     * @return {Resolver|null}
     * @private
     */
    _getResolver(classOrName: ServiceIdentifier) {
        classOrName = this._getName(classOrName);

        return this._items[classOrName] || null;
    }

    /**
     * @param {ServiceIdentifier} classOrName
     * @return {boolean}
     */
    has(classOrName: ServiceIdentifier) {
        return !!this._getResolver(classOrName);
    }

    /**
     * @param {ServiceIdentifier} classOrName
     * @return {Object}
     */
    make(classOrName: ServiceIdentifier): Object {
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
