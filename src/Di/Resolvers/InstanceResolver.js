import Resolver from "./Resolver";

export default class InstanceResolver extends Resolver {
    /**
     * @param args
     * @return {Object|*}
     */
    resolve(...args: any): any {
        this.fireResolvedEvent(this.service);

        return this.service;
    }
}