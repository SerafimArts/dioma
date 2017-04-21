import Registrar from "./Registrar";
import Inject from "./Annotations/Inject";
import Resolver from "./Resolvers/Resolver";
import InvalidAliasError from "./Exceptions/InvalidAliasError";
import {default as Support, ServiceIdentifier} from "./Support";
import InvalidDefinitionError from "./Exceptions/InvalidDefinitionError";

/**
 * @type {Symbol}
 */
export const CONTAINER_IDENTIFIER = Symbol('Container');

/**
 * @type {Symbol}
 */
const RESOLVED_ANY = Symbol('*');

/**
 * Container is a dependency injection container. It gives
 * access to object instances (services). Services and parameters
 * are simple key/pair stores. Parameter and service
 * keys are case insensitive.
 */
export default class Container {
    /**
     * The container's services.
     *
     * @type {Object.<string, Resolver>}
     * @private
     */
    _services = {};

    /**
     * @type {Object.<string, string>}
     * @private
     */
    _aliases = {};

    /**
     * @type {{}}
     * @private
     */
    _resolvedEvents = {};

    /**
     * @param {boolean} exportAnnotations
     * @constructor
     */
    constructor(exportAnnotations: boolean = true) {
        if (exportAnnotations) {
            (global || window).Inject = Inject;
        }

        this.instance(CONTAINER_IDENTIFIER, this);
    }

    /**
     * @param {ServiceIdentifier} nameOrService
     * @param {*|null} service
     * @return {Container}
     * @throws {TypeError}
     */
    instance(nameOrService: ServiceIdentifier, service: ?any = null): Container {
        this._define(nameOrService, service).instance();

        return this;
    }

    /**
     * @param {ServiceIdentifier} nameOrService
     * @param {*|null} service
     * @return {Container}
     * @throws {TypeError}
     */
    factory(nameOrService: ServiceIdentifier, service: ?any = null): Container {
        this._define(nameOrService, service).factory();

        return this;
    }

    /**
     * @param {ServiceIdentifier} nameOrService
     * @param {*|null} service
     * @return {Container}
     * @throws {TypeError}
     */
    singleton(nameOrService: ServiceIdentifier, service: ?any = null): Container {
        this._define(nameOrService, service).singleton();

        return this;
    }

    /**
     * @param {ServiceIdentifier} nameOrService
     * @param {Function} callback
     * @return {Container}
     */
    resolving(nameOrService: ServiceIdentifier, callback: ?Function = null): Container {
        if (callback === null && nameOrService instanceof Function) {
            return this.resolving(RESOLVED_ANY, nameOrService);
        }

        this._getEvents(Support.getName(nameOrService))
            .push(callback);

        return this;
    }

    /**
     * @param {string} serviceName
     * @param {*} value
     * @private
     */
    _fireResolvedEvents(serviceName: string, value: any) {
        for (let observer of this._getEvents(serviceName)) {
            observer(value);
        }

        for (let observer of this._getEvents(RESOLVED_ANY)) {
            observer(serviceName, value);
        }
    }

    /**
     * @param {string} name
     * @return {Array}
     * @private
     */
    _getEvents(name: string): Array {
        if (!this._resolvedEvents[name]) {
            this._resolvedEvents[name] = [];
        }

        return this._resolvedEvents[name];
    }

    /**
     * @param {ServiceIdentifier} nameOrService
     * @param {*|null} service
     * @return {Registrar}
     * @throws {TypeError}
     * @private
     */
    _define(nameOrService: ServiceIdentifier, service: ?any = null): Registrar {
        [nameOrService, service] = Container._normaliseBindArguments(nameOrService, service);

        return (new Registrar(this, nameOrService, service))
            .resolved((name, value) => this._fireResolvedEvents(name, value));
    }

    /**
     * @param {string} name
     * @param {Resolver} resolver
     * @return {Container}
     */
    register(name: string, resolver: Resolver): Container {
        this._services[name] = resolver;

        return this;
    }

    /**
     * @param {string} original
     * @param {...string} aliases
     * @return {Container}
     */
    alias(original: string, ...aliases: string): Container {
        for (let alias of aliases) {
            if (typeof alias === 'string' && this.isAlias(alias)) {
                throw InvalidAliasError.create(alias);
            }

            if (this._services[alias]) {
                throw new InvalidAliasError(`Can not create alias ${alias}. Service ${alias} already defined.`);
            }

            this._aliases[alias] = original;
        }

        return this;
    }

    /**
     * @param {string} alias
     * @return {boolean}
     */
    isAlias(alias: string): boolean {
        return !!this._aliases[alias];
    }

    /**
     * @param {ServiceIdentifier} name
     * @return {Resolver}
     * @private
     */
    _getResolver(name: ServiceIdentifier): Resolver {
        name = Support.getName(name);

        if (!name) {
            throw new TypeError('Wrong service name.');
        }

        if (this.isAlias(name)) {
            return this._getResolver(this._aliases[name]);
        }

        if (!this.has(name)) {
            throw new TypeError(`Service ${name} is not defined.`);
        }

        return this._services[name];
    }

    /**
     * @param {ServiceIdentifier} name
     * @return {boolean}
     */
    has(name: ServiceIdentifier): boolean {
        return !!this._services[Support.getName(name)];
    }

    /**
     * @param name
     * @return {*}
     */
    get(name: ServiceIdentifier): any {
        return this._getResolver(name).resolve();
    }

    /**
     * @param {ServiceIdentifier} name
     * @return {*}
     */
    make(name: ServiceIdentifier): any {
        return this.makeWith(name);
    }

    /**
     * @param {ServiceIdentifier} name
     * @param {Array} args
     * @return {*}
     */
    makeWith(name: ServiceIdentifier, args: Array = []): any {
        if (!this.has(name) && !this.isAlias(name)) {
            this._define(name).factory();
        }

        return this._getResolver(name).resolve(...args);
    }

    /**
     * @param {ServiceIdentifier} nameOrService
     * @param {ServiceIdentifier|null} service
     * @return {[*,*]}
     * @private
     */
    static _normaliseBindArguments(nameOrService: ServiceIdentifier, service: ?ServiceIdentifier = null): Array {
        if (service === null || typeof service === 'undefined') {
            if (!Support.isClass(nameOrService) && !Support.isObject(nameOrService)) {
                throw InvalidDefinitionError.create(nameOrService);
            }

            return [Support.getName(nameOrService), nameOrService];
        }

        return [nameOrService, service];
    }
}
