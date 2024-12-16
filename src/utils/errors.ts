type TypelingsErrorType =
  | 'ERR_DIR_ALREADY_EXISTS'
  | 'ERR_NO_INSTALLED_PACKAGE_MANAGERS'
  | 'ERR_NO_SELECTED_PACKAGE_MANAGER'
  | 'ERR_FAILED_TO_GENERATE_PROJECT';

interface TypelingsErrorImpl {
  readonly type: TypelingsErrorType;
  readonly message: string;
  readonly code: number;
}

interface TypelingsErrorOptions {
  message?: string;
}

export class TypelingsError extends Error implements TypelingsErrorImpl {
  readonly name: string;
  readonly type: TypelingsErrorType;
  readonly code: number;

  constructor(type: TypelingsErrorType, options?: TypelingsErrorOptions) {
    super(options?.message ?? errorMessages[type]);

    this.name = 'TypelingsError';
    this.type = type;
    this.code = errorCodes[type];

    Object.setPrototypeOf(this, TypelingsError.prototype);
  }
}

const errorCodes: Record<TypelingsErrorType, number> = {
  ERR_DIR_ALREADY_EXISTS: 1,
  ERR_NO_INSTALLED_PACKAGE_MANAGERS: 2,
  ERR_NO_SELECTED_PACKAGE_MANAGER: 3,
  ERR_FAILED_TO_GENERATE_PROJECT: 4,
} as const;

const errorMessages: Record<TypelingsErrorType, string> = {
  ERR_DIR_ALREADY_EXISTS:
    'Looks like the `typelings/` folder exists. Delete it and repeat the process.',
  ERR_NO_INSTALLED_PACKAGE_MANAGERS:
    "You don't have any package manager installed. Install it and repeat the process.",
  ERR_NO_SELECTED_PACKAGE_MANAGER: 'You have not selected a package manager.',
  ERR_FAILED_TO_GENERATE_PROJECT: 'The project could not be generated.',
} as const;
