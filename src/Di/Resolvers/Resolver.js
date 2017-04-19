import Support from "../Support";
import Reader from "../../Annotation/Reader";
import {default as Container, CONTAINER_IDENTIFIER} from "../Container";
import InvalidDefinitionError from "../Exceptions/InvalidDefinitionError";

const INJECT_ANNOTATION_NAME = 'Inject';

export default class Resolver {
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
     * @type {Array|null}
     * @private
     */
    _parameters: ?Array = null;

    /**
     * @type {Function}
     * @private
     */
    _resolvedEvent: Function = ((service) => {});

    /**
     * @type {boolean}
     * @private
     */
    _resolved: boolean = false;

    /**
     * @param {Container} container
     * @param {*} service
     */
    constructor(container: Container, service: any) {
        this._container = container;
        this._service = service;
    }

    /**
     * @param {*} service
     * @param {boolean} force
     * @return {Resolver}
     */
    fireResolvedEvent(service: any, force: boolean = false): Resolver {
        if (force) {
            this._resolved = false;
        }

        if (!this._resolved) {
            this._resolvedEvent(service);
            this._resolved = true;
        }

        return this;
    }

    /**
     * @return {*}
     */
    get service(): any {
        return this._service;
    }

    /**
     * @param {Function} callback
     * @return {Resolver}
     */
    resolved(callback: Function): Resolver {
        this._resolvedEvent = callback;

        return this;
    }

    /**
     * @param {*} args
     * @return {*}
     */
    resolve(...args: any): any {
        let service = this._service(this.getDependencies(...args));

        this._resolvedEvent(service);

        return service;
    }

    /**
     * @param {*} args
     * @return {Array}
     */
    getDependencies(...args): Array {
        let result = [];

        for (let dependency of this.getParameters(...args)) {
            try {
                result.push(this._container.make(dependency));
            } catch (e) {
                if (e instanceof TypeError) {
                    let error = `Unresolvable dependency resolving [${dependency}] ` +
                        `while resolving ${Support.getName(this._service)}`;

                    throw new InvalidDefinitionError(error);
                }
                throw e;
            }
        }

        return result;
    }

    /**
     * @param args
     * @return {Array}
     */
    getParameters(...args): Array {
        if (args.length > 0) {
            return args;
        }

        if (this._parameters === null) {
            let reader = this.getReader();

            if (reader === null) {
                return [CONTAINER_IDENTIFIER];
            }

            let annotation = reader.getClassAnnotation(INJECT_ANNOTATION_NAME);

            if (!annotation) {
                return [CONTAINER_IDENTIFIER];
            }

            return annotation.getDependencies();
        }

        return this._parameters;
    }

    /**
     * @return {Reader|null}
     */
    getReader(): ?Reader {
        if (Support.isClass(this.service)) {
            return new Reader(this.service);
        }

        if (Support.isObject(this.service)) {
            return new Reader(this.service.constructor);
        }

        return null;
    }
}