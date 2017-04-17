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
     * @return {Array}
     */
    resolve(container: Container): Array {
        let inject: Inject = this._reader.getClassAnnotation('Inject');

        if (inject !== null) {
            let dependencies = [];

            for (let dependency of inject.getDependencies()) {
                dependencies.push(container.get(dependency));
            }

            return dependencies;
        }

        return [];
    }
}

export class FactoryResolver extends Resolver {
    resolve(container: Container) {
        return new this._item(...super.resolve(container));
    }
}

export class SingletonResolver extends Resolver {
    resolve(container: Container) {
        if (!this.resolved) {
            this.resolved = new this._item(...super.resolve(container));
        }

        return this.resolved;
    }
}
