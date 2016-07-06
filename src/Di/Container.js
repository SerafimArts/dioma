import {FactoryResolver, SingletonResolver, default as Resolver} from "/Di/Resolver";
import {ServiceNotFoundException} from "/Di/Exceptions";

type ContainerAlias = string|Function;
type ContainerConcrete = Object|Function;

export default class Container {
    _dependencies:Map<Resolver> = new Map;

    bind(alias:ContainerAlias, concrete:ContainerConcrete) {
        this._dependencies.set(alias, new FactoryResolver(this, concrete));
        
        return this;
    }

    singleton(alias:ContainerAlias, concrete:ContainerConcrete) {
        this._dependencies.set(alias, new SingletonResolver(this, concrete));

        return this;
    }

    has(alias:ContainerAlias):boolean {
        return this._dependencies.has(alias);
    }

    make(alias:ContainerAlias) {
        if (!this.has(alias)) {
            throw new ServiceNotFoundException(alias);
        }

        return this._dependencies.get(alias).resolve();
    }
}