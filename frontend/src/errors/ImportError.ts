export class ImportError extends Error {
    constructor(message = "The import failed.", options?: ErrorOptions) {
        super(message, options);
        this.name = new.target.name;
    }
}
