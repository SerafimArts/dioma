import Resolver from "./Resolver";
import Support from "../Support";

export default class FactoryResolver extends Resolver {
    /**
     * @param args
     * @return {Object|*}
     */
    resolve(...args: any): any {
        let dependencies = this.getDependencies(...args);

        let result = Support.isAnonymous(this.service)
            ? this.service(...dependencies)
            : new this.service(...dependencies);

        this.fireResolvedEvent(result, true);

        return result;
    }
}