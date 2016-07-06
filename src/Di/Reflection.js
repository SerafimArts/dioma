class ReflectionException extends Error {

}


export class ReflectionFunction {
    constructor(closure:Function) {
        this._closure = closure;
    }

    _getMatches():Array<string> {
        return this._closure.toString().match(/function\s*\((.*?)\)\s*\{/) || [];
    }

    getArguments():Array<string> {
        return (this._getMatches()[1] || '').replace(/\s+/g, '').split(',');
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

    getName():string {
        return `${super.getName()} class`;
    }

    invoke(...args):any {
        return new this._class(...args);
    }
}
