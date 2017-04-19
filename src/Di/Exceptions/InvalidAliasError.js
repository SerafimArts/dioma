export default class InvalidAliasError extends TypeError {
    /**
     * @param {*} alias
     * @return {InvalidAliasError}
     */
    static create(alias: any): InvalidAliasError {
        let suffix = typeof alias === 'string'
            ? `Alias "${alias}" already defined.`
            : 'Alias must be a string.';

        let message = `Invalid service alias. ${suffix}`;

        return new this(message);
    }
}