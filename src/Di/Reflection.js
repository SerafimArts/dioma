export class Reflection {
    static isFunction(value) {
        return value && value instanceof Function && value.constructor.name === 'Function';
    }

    static isClass(value) {
        return value &&
            typeof value.name === 'string' &&
            value.name.length > 0 &&
            this.isFunction(value);
    }

    static isClosure(value) {
        return value && !value.name && this.isFunction(value);
    }
}

export class ReflectionFunction {
    constructor(closure:Function) {
        this._closure = closure;
    }

    _getMatches():Array<string> {
        return this._closure.toString().match(/function\s*\((.*?)\)\s*\{/) || [];
    }

    getArguments():Array<string> {
        return (this._getMatches()[1] || '').replace(/\s+/g, '').split(',').filter(i => i.length > 0);
    }

    getName():string {
        return this._closure.name || 'Function@Anonymous';
    }

    invoke(...args):any {
        return this._closure(...args);
    }
}

export class ReflectionClass extends ReflectionFunction {
    constructor(cls:Function) {
        super(cls);
        this._class = cls;
    }

    _getMatches():Array<string> {
        return this._closure.toString().match(/function\s*.*?\s*\((.*?)\)\s*\{/) || [];
    }

    invoke(...args):any {
        return new this._class(...args);
    }
}
