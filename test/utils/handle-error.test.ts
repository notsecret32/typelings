import { TypelingsError } from '@/utils/errors';
import { handleError } from '@/utils/handle-error';
import { logger } from '@/utils/logger';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { z } from 'zod';

jest.mock('@/utils/logger');

describe('error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(process, 'exit').mockImplementation();
  });

  it('if error is string', () => {
    const errorMessage = 'This is a string error';
    handleError(errorMessage);

    expect(logger.error).toHaveBeenCalledWith(errorMessage);
    expect(logger.break).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('if error is ZodError', () => {
    const zodError = new z.ZodError([
      {
        path: ['email'],
        message: 'Invalid email',
        code: 'invalid_type',
        expected: 'string',
        received: 'array',
      },
    ]);
    handleError(zodError);

    expect(logger.error).toHaveBeenCalledWith('Validation failed:');

    // TODO: Fix next line
    //expect(logger.error).toHaveBeenCalledWith('- info(email): Invalid email');

    expect(logger.break).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('if error is Typelings', () => {
    const typelingsError = new TypelingsError('ERR_DIR_ALREADY_EXISTS');
    handleError(typelingsError);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('ERR_DIR_ALREADY_EXISTS'),
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Process terminated with error.'),
    );
    expect(logger.break).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('if error is Error', () => {
    const error = new Error('This is a Error error');
    handleError(error);

    expect(logger.error).toHaveBeenCalledWith('This is a Error error');
    expect(logger.break).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('if error is unknown', () => {
    const unknownError = {};
    handleError(unknownError);

    expect(logger.break).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
