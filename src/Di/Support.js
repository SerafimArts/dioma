/**
 * Service identifier type. It can be string, object or function.
 *  - String:  "string"           -> "string"
 *  - Function: SomeFoo           -> "SomeFoo"
 *  - Object:   obj = new SomeFoo -> "SomeFoo"
 */
export type ServiceIdentifier = string | Function | Object;


export default class Support {
    /**
     *
     * @param {ServiceIdentifier} nameOrClass
     * @return {string}
     */
    static getName(nameOrClass: ServiceIdentifier): string {
        if (nameOrClass instanceof Function) {
            return nameOrClass.name;
        }

        if (typeof nameOrClass === 'object') {
            return nameOrClass.constructor.name;
        }

        return nameOrClass;
    }

    /**
     * @param {Function} dependency
     * @return {boolean}
     */
    static isClass(dependency: Function): boolean {
        return dependency instanceof Function;
    }

    /**
     * @param {Object} dependency
     * @return {boolean}
     */
    static isObject(dependency: Object): boolean {
        return typeof dependency === 'object' &&
            !(dependency instanceof Array) &&
            dependency !== null;
    }

    /**
     * @param {ServiceIdentifier} dependency
     * @return {Function}
     */
    static getClass(dependency: ServiceIdentifier): Function {
        if (this.isObject(dependency)) {
            return dependency.constructor;
        }

        if (this.isClass(dependency)) {
            return dependency;
        }

        throw new ReferenceError('Can not take class from invalid dependency type.');
    }
}
