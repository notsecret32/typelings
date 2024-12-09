import { logger } from '@/utils/logger';

export function handleError(error: unknown) {
  if (typeof error === 'string') {
    logger.error(error);
    logger.break();
    process.exit(1);
  }

  if (error instanceof Error) {
    logger.error(error.message);
    logger.break();
    process.exit(1);
  }

  logger.break();
  process.exit(1);
}
