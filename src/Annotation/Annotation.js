import Reader from './Reader';
import {default as Target, check, TargetType} from './Target';

/**
 * This is default annotation property for automatic type casting:
 * <code>
 *     @Annotation({ some: any })
 *      // => will be casts "as is" {some: any}
 *
 *     @Annotation("any")
 *      // => will be casts to object {DEFAULT_ANNOTATION_PROPERTY: any}
 * </code>
 *
 * @type {string}
 */
const DEFAULT_ANNOTATION_PROPERTY = 'default';

/**
 * This is helper class for define annotations. Example:
 *
 * <code>
 * @Target("Class")
 * export default class MyAnnotation {
 *     a = 42;
 *     b = 23;
 *
 *     call constructor(args) {
 *         return new Annotation(args).delegate(MyAnnotation);
 *     }
 * }
 *
 * // Usage:
 *
 * @MyAnnotation({ a: "new value" })
 * class Some {}
 *
 * // (new Reader(Some)).getClassAnnotations(); // returns [ AnnotationClass { a = "new value", b = 23 } ]
 * </code>
 */
export default class Annotation {
    /**
     * @param ctx
     * @param name
     * @param descr
     * @return {string}
     */
    static getTarget(ctx, name, descr): string {
        if (ctx instanceof Function) {
            return TargetType.Class;
        }

        if (descr && typeof descr.value === 'function') {
            return TargetType.Method;
        }

        return TargetType.Property;
    }

    /**
     * @param ctx
     * @param name
     * @param descr
     * @return {string}
     */
    static getName(ctx, name, descr): string {
        let type = this.getTarget(ctx, name, descr);

        return type === TargetType.Class ? ctx.name : name;
    }

    /**
     * @param ctx
     * @param name
     * @param descr
     * @return {Function}
     */
    static getClassContext(ctx, name, descr): Function {
        let type = this.getTarget(ctx, name, descr);

        return type === TargetType.Class ? ctx : ctx.constructor;
    }

    /**
     * @param ctx
     * @param name
     * @param descr
     * @return {{target: string, name: string, class: Function}}
     */
    static info(ctx, name, descr) {
        return {
            target: this.getTarget(ctx, name, descr),
            name:   this.getName(ctx, name, descr),
            class:  this.getClassContext(ctx, name, descr)
        }
    }

    /**
     * @param ctx
     * @param descr
     * @return {Reader}
     */
    static reader(ctx, descr): Reader {
        return new Reader(this.getClassContext(ctx, descr));
    }

    /**
     * @type {{}}
     * @private
     */
    _args: Object = {};

    /**
     * @param {Object|*} args
     * @param {string} _defaultProperty
     */
    constructor(args: Object = {}, _defaultProperty: string = DEFAULT_ANNOTATION_PROPERTY) {
        if (typeof args !== 'object' || args instanceof Array) {
            args = {
                [_defaultProperty]: args
            };
        }

        this._args = args;
    }

    /**
     * @param {Function} targetAnnotation
     * @return {Function}
     */
    delegate(targetAnnotation: Function): Function {
        let annotation = this.constructor._fill(targetAnnotation, this._args);

        return function (ctx, name, descr) {
            let info = Annotation.info(ctx, name, descr);
            let meta = Annotation.reader(ctx, descr);

            check(targetAnnotation, info);

            switch (info.target) {
                case TargetType.Class:
                    meta.addClassAnnotation(annotation);
                    break;

                case TargetType.Property:
                    meta.addPropertyAnnotation(info.name, annotation);
                    break;

                case TargetType.Method:
                    meta.addMethodAnnotation(info.name, annotation);
                    break;
            }

            return descr;
        };
    }

    /**
     * @param _class
     * @param args
     * @return {Object}
     * @private
     */
    static _fill(_class: Function, args: Object = {}): Object {
        let instance = new _class(args);

        for (let key of Object.keys(args)) {
            instance[key] = args[key];
        }

        return instance;
    }
}
