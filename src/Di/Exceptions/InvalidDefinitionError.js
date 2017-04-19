export default class InvalidDefinitionError extends TypeError {
    /**
     * @param {*} definition
     * @return {InvalidDefinitionError}
     */
    static create(definition: any): InvalidDefinitionError {
        let suffix = `${typeof definition} (${definition})`;

        switch (true) {
            case definition instanceof Function:
                suffix = 'anonymous function';
                break;

            case typeof definition === 'undefined' || isNaN(definition) || definition === null:
                suffix = `${definition}`;
                break;
        }

        let message = `Invalid service definition: Class or Object required, ${suffix} given.`;

        return new this(message);
    }
}