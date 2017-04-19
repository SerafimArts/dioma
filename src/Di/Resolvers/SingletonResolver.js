import Resolver from "./Resolver";
import Support from "../Support";

export default class SingletonResolver extends Resolver {
    /**
     * @type {Object|null}
     * @private
     */
    _instance: ?Object = null;

    /**
     * @param args
     * @return {Object|*}
     */
    resolve(...args: any): any {
        if (this._instance === null) {
            let dependencies = this.getDependencies(...args);

            this._instance = Support.isAnonymous(this.service)
                ? this.service(...dependencies)
                : new this.service(...dependencies);

            this.fireResolvedEvent(this._instance);
        }

        return this._instance;
    }
}