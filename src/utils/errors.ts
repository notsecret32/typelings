type TypelingsErrorName = 'ERR_DIR_ALREADY_EXISTS';

interface TypelingsErrorImpl {
  name: TypelingsErrorName;
  message: string;
  code: number;
}

interface TypelingsErrorOptions {
  name: TypelingsErrorName;
}

export class TypelingsError extends Error implements TypelingsErrorImpl {
  name: TypelingsErrorName;
  code: number;

  constructor(message: string, options: TypelingsErrorOptions) {
    super(message);

    this.name = options.name;
    this.message = message;
    this.code = errorCodes[options.name];

    Object.setPrototypeOf(this, TypelingsError.prototype);
  }
}

const errorCodes: Record<TypelingsErrorName, number> = {
  ERR_DIR_ALREADY_EXISTS: 1,
};
