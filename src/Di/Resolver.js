import Container from '/Di/Container';
import { Reflection, ReflectionClass, ReflectionFunction } from '/Di/Reflection';
import { ServiceResolvingException } from '/Di/Exceptions';

type ContainerConcrete = Object|Function;

export default class Resolver {
    _resolvedArgs:Array<string> = [];

    constructor(container:Container, declaration:ContainerConcrete) {
        this._container   = container;
        this._declaration = declaration;
    }

    getContainer():Container {
        return this._container;
    }

    getConcrete():ContainerConcrete {
        return this._declaration;
    }

    resolve(reflection:ReflectionFunction):any {
        if (this._resolvedArgs.length === 0) {
            var i = 0, args = reflection.getArguments();
            for (var arg of args) {
                i++;
                if (!this.getContainer().has(arg)) {
                    throw new ServiceResolvingException(
                        `Can not resolve argument#${i} "${arg}" for ${reflection.getName()}`
                    );
                }

                var argument = this.getContainer().make(arg);

                this._resolvedArgs.push(argument);
            }
        }

        return reflection.invoke(...this._resolvedArgs);
    }
}

export class FactoryResolver extends Resolver {
    resolve():any {
        switch (true) {
            case Reflection.isInstance(this.getConcrete()):
                return this.getConcrete();
            case Reflection.isClass(this.getConcrete()):
                return super.resolve(new ReflectionClass(this.getConcrete()));
            case Reflection.isClosure(this.getConcrete()):
                return super.resolve(new ReflectionFunction(this.getConcrete()));
        }

        return this.getConcrete();
    }
}

export class SingletonResolver extends FactoryResolver {
    _resolvableInstance:any = null;

    resolve():any {
        if (this._resolvableInstance === null) {
            this._resolvableInstance = super.resolve();
        }

        return this._resolvableInstance;
    }
}