import { handleError } from '@/utils/handle-error';
import { highlighter } from '@/utils/highlighter';
import { logger } from '@/utils/logger';
import { spinner } from '@/utils/spinner';
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import { z } from 'zod';

const initCommandSchema = z.object({
  cwd: z.string(),
});

type InitCommandOptions = z.infer<typeof initCommandSchema>;

export const init = new Command()
  .name('init')
  .description('initialize your project and install dependencies')
  .action(async () => {
    try {
      const options = initCommandSchema.parse({
        cwd: process.cwd(),
      });

      await runInit(options);

      logger.log(
        `${highlighter.success('Success!')} Project initialization completed.`,
      );
    } catch (error) {
      logger.break();
      handleError(error);
    }
  });

async function runInit(options: InitCommandOptions) {
  const projectPath = path.resolve(options.cwd, 'typelings');

  if (await fs.exists(projectPath)) {
    throw new Error(
      'Looks like the `typelings/` folder exists. Delete it and repeat the process.',
    );
  }

  const { proceed } = await prompts({
    name: 'proceed',
    type: 'confirm',
    message:
      'This command will create the directory `typelings/`.\nDo you agree?',
    initial: true,
  });

  if (!proceed) {
    process.exit(0);
  }

  const initSpinner = spinner('Initializing the project...').start();

  await fs.mkdir(projectPath);
  process.chdir('typelings');
  options.cwd = process.cwd();

  const cliPath = import.meta.dirname;
  const exercisesPath = path.join(cliPath, 'exercises');

  await fs.copy(exercisesPath, options.cwd);

  initSpinner.succeed();
}
