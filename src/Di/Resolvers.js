import Inject from "./Inject";
import Container from "./Container";
import Reader from "../Annotation/Reader";
import {default as Support, ServiceIdentifier} from "./Support";

/**
 * Base resolver class
 */
export class Resolver {
    /**
     * @type {*}
     * @private
     */
    _service: any = null;

    /**
     * @type {Array|null}
     * @private
     */
    _args: ?Array = null;

    /**
     * @param {ServiceIdentifier} dependency
     */
    constructor(dependency: ServiceIdentifier) {
        this._service = dependency;
        this._reader = new Reader(Support.getClass(dependency));
    }

    /**
     * @param {...string} dependencies
     * @return {Resolver}
     */
    setDependencies(...dependencies): Resolver {
        this._args = dependencies.length > 0 ? dependencies : null;

        return this;
    }

    /**
     * @return {*}
     */
    getDependency(): any {
        return this._service;
    }

    /**
     * @return {Reader}
     */
    getAnnotationReader(): Reader {
        return this._reader;
    }

    /**
     * @param {Container} container
     * @return {Object}
     */
    create(container: Container): Object {
        if (Support.isClass(this.getDependency)) {
            return new this.getDependency()(...this.resolveArguments(container));
        }

        return this.getDependency();
    }

    /**
     * @param {Container} container
     * @return {Object}
     */
    resolve(container: Container): Object {
        throw new TypeError('Can not call an abstract method');
    }

    /**
     * @param {Container} container
     * @return {Array}
     */
    resolveArguments(container: Container): Array {
        if (this._args !== null && this._args.length > 0) {
            return Resolver._make(container, ...this._args);
        }

        let inject: Inject = this.getAnnotationReader()
            .getClassAnnotation('Inject');

        if (inject !== null) {
            return Resolver._make(container, ...inject.getDependencies());
        }

        return [];
    }

    /**
     * @param {Container} container
     * @param {...string} services
     * @return {Array}
     * @private
     */
    static _make(container: Container, ...services) {
        let dependencies = [];

        for (let dependency of services) {
            dependencies.push(container.make(dependency));
        }

        return dependencies;
    }
}

/**
 * Create service as factory
 */
export class FactoryResolver extends Resolver {
    /**
     * @param {Container} container
     * @return {Object}
     */
    resolve(container: Container): Object {
        return this.create(container);
    }
}

/**
 * Create service as singleton
 */
export class SingletonResolver extends Resolver {
    /**
     * @param {Container} container
     * @return {Object}
     */
    resolve(container: Container): Object {
        if (!this.resolved) {
            this.resolved = this.create(container);
        }

        return this.resolved;
    }
}

/**
 * Create service as instance
 */
export class InstanceResolver extends Resolver {
    /**
     * @param {Container} container
     * @return {Object}
     */
    resolve(container: Container): Object {
        return this.getDependency();
    }
}
