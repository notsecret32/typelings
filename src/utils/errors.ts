type TypelingsErrorName =
  | 'ERR_DIR_ALREADY_EXISTS'
  | 'ERR_NO_INSTALLED_PACKAGE_MANAGERS'
  | 'ERR_NO_SELECTED_PACKAGE_MANAGER';

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
  ERR_NO_INSTALLED_PACKAGE_MANAGERS: 2,
  ERR_NO_SELECTED_PACKAGE_MANAGER: 3,
};
