import { TypelingsError } from '@/utils/errors';
import { describe, it } from '@jest/globals';

describe('TypelingsError', () => {
  it('should create an instance of TypelingsError with correct properties', () => {
    const errorMessage = 'Directory already exists';
    const errorName = 'ERR_DIR_ALREADY_EXISTS';
    const error = new TypelingsError(errorMessage, { name: errorName });

    expect(error).toBeInstanceOf(TypelingsError);
    expect(error.name).toBe(errorName);
    expect(error.message).toBe(errorMessage);
    expect(error.code).toBe(1);
  });

  it('should throw an error for an invalid error name', () => {
    const errorMessage = 'No installed package managers';
    const invalidErrorName = 'ERR_NO_INSTALLED_PACKAGE_MANAGERS';

    expect(() => {
      throw new TypelingsError(errorMessage, { name: invalidErrorName });
    }).toThrow(TypelingsError);
  });

  it('should preserve the stack trace', () => {
    const errorMessage = 'No installed package managers';
    const errorName = 'ERR_NO_INSTALLED_PACKAGE_MANAGERS';
    const error = new TypelingsError(errorMessage, { name: errorName });

    expect(error.stack).toBeDefined();
  });
});
