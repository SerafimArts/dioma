/**
 *
 */
import Resolver from "./Resolvers/Resolver";
import FactoryResolver from "./Resolvers/FactoryResolver";
import InstanceResolver from "./Resolvers/InstanceResolver";
import SingletonResolver from "./Resolvers/SingletonResolver";
import Container from "./Container";

export default class Registrar {
    /**
     * @type {*}
     * @private
     */
    _service: any;

    /**
     * @type {Container}
     * @private
     */
    _container: Container;

    /**
     * @type {string}
     * @private
     */
    _name: string;

    /**
     * @type {Function}
     * @private
     */
    _resolvedEvent: Function = (() => {});

    /**
     * @param {Container} container
     * @param {string} name
     * @param {*} service
     */
    constructor(container: Container, name: string, service: any) {
        this._name = name;
        this._service = service;
        this._container = container;
    }

    /**
     * @param {Function} callback
     * @return {Registrar}
     */
    resolved(callback: Function): Registrar {
        this._resolvedEvent = callback;

        return this;
    }

    /**
     * @param {string} alias
     * @return {Registrar}
     */
    alias(alias: string): Registrar {
        this._container.alias(this._name, alias);

        return this;
    }

    /**
     * @return {Registrar}
     */
    singleton(): Registrar {
        this._container.register(this._name, this._createResolver(SingletonResolver));

        return this;
    }

    /**
     * @return {Registrar}
     */
    factory(): Registrar {
        this._container.register(this._name, this._createResolver(FactoryResolver));

        return this;
    }

    /**
     * @return {Registrar}
     */
    instance(): Registrar {
        this._container.register(this._name, this._createResolver(InstanceResolver));

        return this;
    }

    /**
     * @param {Function} resolver
     * @return {Resolver}
     * @private
     */
    _createResolver(resolver: Function): Resolver {
        return (new resolver(this._container, this._service))
            .resolved(item => this._resolvedEvent(this._name, item));
    }
}