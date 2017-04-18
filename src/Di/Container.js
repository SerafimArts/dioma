import Inject from "./Inject";
import Support from "./Support";
import { Resolver, FactoryResolver, InstanceResolver, SingletonResolver } from "./Resolvers";

/**
 * Service identifier type. It can be string or function.
 *  - Strings:  "string" -> "string"
 *  - Functions: SomeFoo -> "SomeFoo"
 */
type ServiceIdentifier = string | Function;

/**
 *
 */
export default class Container {
    /**
     * The container's bindings.
     *
     * @type {Object.<string, Resolver>}
     * @private
     */
    _bindings = {};

    /**
     * @param {boolean} exportInjections
     */
    constructor(exportInjections: boolean = true) {
        if (exportInjections) {
            window.Inject = Inject;
        }
    }

    /**
     * Define a service as singleton from class.
     *
     * <code>
     *     container.singleton('locator', ClassName);
     *      // > app.make('locator')
     *
     *     container.singleton(ClassName);
     *      // > app.make('ClassName')
     * </code>
     *
     * @param {ServiceIdentifier} classOrName
     * @param {Function} __class
     * @return {Container}
     */
    singleton(classOrName: ServiceIdentifier, __class: ?Function = null): Container {
        [classOrName, __class] = Container._resolveServiceDefineArguments(classOrName, __class);

        this._bindings[classOrName] = new SingletonResolver(__class);

        return this;
    }

    /**
     * Define a service as factory from class.
     *
     * <code>
     *     container.factory('locator', ClassName);
     *      // > app.make('locator')
     *
     *     container.factory(ClassName);
     *      // > app.make('ClassName')
     * </code>
     *
     * @param {ServiceIdentifier} classOrName
     * @param {Function|null} __class
     * @return {Container}
     */
    factory(classOrName: ServiceIdentifier, __class: ?Function = null): Container {
        [classOrName, __class] = Container._resolveServiceDefineArguments(classOrName, __class);

        this._bindings[classOrName] = new FactoryResolver(__class);

        return this;
    }

    /**
     * Define an instance.
     *
     * <code>
     *     container.instance('locator', new ClassName);
     *      // > app.make('locator')
     *
     *     container.instance(new ClassName);
     *      // > app.make('ClassName')
     * </code>
     *
     * @param {ServiceIdentifier} instanceOrName
     * @param {Object|null} __instance
     * @return {Container}
     */
    instance(instanceOrName: ServiceIdentifier, __instance: ?Object = null): Container {
        if (__instance === null) {
            __instance = instanceOrName;
        }

        if (!Support.isObject(__instance)) {
            throw new ReferenceError(`${Support.getName(__instance)} is not a valid object.`);
        }

        this._bindings[Support.getName(__instance)] = new InstanceResolver(__instance);
    }

    /**
     * @param {ServiceIdentifier} classOrName
     * @return {Resolver|null}
     */
    getResolver(classOrName: ServiceIdentifier): ?Resolver {
        classOrName = Support.getName(classOrName);

        return this._bindings[classOrName] || null;
    }

    /**
     * @param {ServiceIdentifier} classOrName
     * @return {boolean}
     */
    has(classOrName: ServiceIdentifier) {
        return !!this.getResolver(classOrName);
    }

    /**
     * @param {ServiceIdentifier} locator
     * @return {Object}
     */
    make(locator: ServiceIdentifier): Object {
        if (!this.has(locator)) {
            if (locator instanceof Function) {
                this.factory(Support.getName(locator), locator);
            } else {
                throw new ReferenceError(`Invalid container reference ${locator}`);
            }
        }

        return this.getResolver(locator).resolve(this);
    }

    /**
     * Support method for defining services.
     *
     * @param {ServiceIdentifier} classOrName
     * @param {Function|null} __class
     * @return {Array}
     */
    static _resolveServiceDefineArguments(classOrName: ServiceIdentifier,  __class: ?Function = null): Array {
        if (__class === null) {
            __class = classOrName;
        }

        if (!Support.isClass(__class)) {
            throw new ReferenceError(`${Support.getName(__class)} is not a valid class.`);
        }

        return [Support.getName(classOrName), __class];
    }
}
