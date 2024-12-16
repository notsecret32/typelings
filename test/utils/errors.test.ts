import { TypelingsError } from '@/utils/errors';
import { describe, it } from '@jest/globals';

describe('TypelingsError', () => {
  it('should create an instance of TypelingsError with correct properties', () => {
    const errorType = 'ERR_DIR_ALREADY_EXISTS';
    const error = new TypelingsError(errorType);

    expect(error).toBeInstanceOf(TypelingsError);
    expect(error.type).toBe(errorType);
    expect(error.code).toBe(1);
  });

  it('should create an instance of TypelingsError with custom message', () => {
    const customMessage = 'Directory already exists';
    const errorType = 'ERR_DIR_ALREADY_EXISTS';
    const error = new TypelingsError(errorType, { message: customMessage });

    expect(error).toBeInstanceOf(TypelingsError);
    expect(error.type).toBe(errorType);
    expect(error.message).toBe(customMessage);
    expect(error.code).toBe(1);
  });

  it('should throw an error for an invalid error name', () => {
    const invalidErrorType = 'ERR_NO_INSTALLED_PACKAGE_MANAGERS';

    expect(() => {
      throw new TypelingsError(invalidErrorType);
    }).toThrow(TypelingsError);
  });

  it('should preserve the stack trace', () => {
    const errorType = 'ERR_NO_INSTALLED_PACKAGE_MANAGERS';
    const error = new TypelingsError(errorType);

    expect(error.stack).toBeDefined();
  });
});
