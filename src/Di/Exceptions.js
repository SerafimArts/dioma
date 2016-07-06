export class ContainerException extends Error {
}

export class ServiceNotFoundException extends ContainerException {
    constructor(name:string) {
        super(`Service "${(name.name || name).toString()}" not found`);
    }
}

export class ServiceResolvingException extends ContainerException {
}
