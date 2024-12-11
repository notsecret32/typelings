import { TypelingsError } from '@/utils/errors';
import { highlighter } from '@/utils/highlighter';
import { logger } from '@/utils/logger';
import kleur from 'kleur';
import { z } from 'zod';

export function handleError(error: unknown) {
  if (typeof error === 'string') {
    logger.error(error);
    logger.break();
    process.exit(1);
  }

  if (error instanceof z.ZodError) {
    logger.error('Validation failed:');
    for (const [key, value] of Object.entries(error.flatten().fieldErrors)) {
      logger.error(`- ${highlighter.info(key)}: ${value}`);
    }
    logger.break();
    process.exit(1);
  }

  if (error instanceof TypelingsError) {
    logger.error(`${kleur.bgRed().black(error.name)}: ${error.message}`);
    logger.break();

    logger.error(`Process terminated with error. Exit code: ${error.code}.`);
    logger.break();

    process.exit(error.code);
  }

  if (error instanceof Error) {
    logger.error(error.message);
    logger.break();
    process.exit(1);
  }

  logger.break();
  process.exit(1);
}
