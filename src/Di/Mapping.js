function _resolveDependency(obj) {
    return obj && obj.default ? obj.default : obj;
}

var INJECTION = Symbol('[injections]');

export function Inject(...dependencies) {
    return function (target, key, descriptor) {
        Reflect.defineMetadata(
            INJECTION,
            dependencies.map(i => _resolveDependency(i)),
            target.constructor.prototype,
            key
        );

        return descriptor;
    };
}