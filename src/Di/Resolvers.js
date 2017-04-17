import Inject from "./Inject";
import Container from "./Container";
import Reader from "../Annotation/Reader";


export class Resolver {
    /**
     * @param {Function} __class
     */
    constructor(__class: Function) {
        this._item = __class;
        this._reader = new Reader(__class);
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
        let inject: Inject = this._reader.getClassAnnotation('Inject');

        if (inject !== null) {
            let dependencies = [];

            for (let dependency of inject.getDependencies()) {
                dependencies.push(container.make(dependency));
            }

            return dependencies;
        }

        return [];
    }
}

export class FactoryResolver extends Resolver {
    /**
     * @param {Container} container
     * @return {Object}
     */
    resolve(container: Container): Object {
        return new this._item(...super.resolveArguments(container));
    }
}

export class SingletonResolver extends Resolver {
    /**
     * @param {Container} container
     * @return {Object}
     */
    resolve(container: Container): Object {
        if (!this.resolved) {
            this.resolved = new this._item(...super.resolveArguments(container));
        }

        return this.resolved;
    }
}
