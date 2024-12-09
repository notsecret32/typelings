import { logger } from '@/utils/logger';

export function handleError(error: unknown) {
  logger.error(
    'Something went wrong. Please check the error below for more details.',
  );
  logger.break();

  if (typeof error === 'string') {
    logger.error(error);
    logger.break();
    process.exit(1);
  }

  if (error instanceof Error) {
    logger.error('>', error.message);
    logger.break();
    process.exit(1);
  }

  logger.break();
  process.exit(1);
}
