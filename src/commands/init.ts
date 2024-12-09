import { handleError } from '@/utils/handle-error';
import { logger } from '@/utils/logger';
import { Command } from 'commander';

export const init = new Command().name('init').action(async () => {
  try {
    logger.log('Init command');
  } catch (error) {
    logger.break();
    handleError(error);
  }
});
