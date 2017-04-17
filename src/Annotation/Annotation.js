import Reader from './Reader';
import {check, default as Target} from './Target';

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
     * @param descr
     * @return {string}
     */
    static getTarget(ctx, descr): string {
        if (ctx instanceof Function) {
            return Target.TARGET_CLASS;
        }

        if (typeof descr.value === 'function') {
            return Target.TARGET_METHOD;
        }

        return Target.TARGET_PROPERTY;
    }

    /**
     * @param ctx
     * @param name
     * @param descr
     * @return {string}
     */
    static getName(ctx, name, descr): string {
        let type = this.getTarget(ctx, descr);

        return type === Target.TARGET_CLASS ? ctx.name : name;
    }

    /**
     * @param ctx
     * @param descr
     * @return {Function}
     */
    static getClassContext(ctx, descr): Function {
        let type = this.getTarget(ctx, descr);

        return type === Target.TARGET_CLASS ? ctx : ctx.constructor;
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
            class:  this.getClassContext(ctx, descr)
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
                case Target.TARGET_CLASS:
                    meta.addClassAnnotation(annotation);
                    break;

                case Target.TARGET_PROPERTY:
                    meta.addPropertyAnnotation(info.name, annotation);
                    break;

                case Target.TARGET_METHOD:
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
