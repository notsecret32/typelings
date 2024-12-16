import { TypelingsError } from '@/utils/errors';
import { handleError } from '@/utils/handle-error';
import { highlighter } from '@/utils/highlighter';
import { logger } from '@/utils/logger';
import {
  getInstalledPackageManagers,
  getInstalledPackageManagersPrompt,
} from '@/utils/package-managers';
import { spinner } from '@/utils/spinner';
import { PACKAGE_JSON, README, TS_CONFIG } from '@/utils/templates';
import { Command } from 'commander';
import { execa } from 'execa';
import fs from 'fs-extra';
import kleur from 'kleur';
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
    throw new TypelingsError('ERR_DIR_ALREADY_EXISTS');
  }

  const { proceed } = await prompts({
    name: 'proceed',
    type: 'confirm',
    message:
      kleur.reset('This command will create the directory ') +
      kleur.bold('`typelings/`') +
      kleur.reset('.\nDo you agree?'),
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

  await fs.writeFile(path.join(projectPath, 'package.json'), PACKAGE_JSON);
  await fs.writeFile(path.join(projectPath, 'tsconfig.json'), TS_CONFIG);
  await fs.writeFile(path.join(projectPath, 'README.md'), README);

  initSpinner.succeed();

  const installedPackageManagers = await getInstalledPackageManagers();

  if (installedPackageManagers.length === 0) {
    throw new TypelingsError('ERR_NO_INSTALLED_PACKAGE_MANAGERS');
  }

  const { packageManager } = await prompts({
    name: 'packageManager',
    type: 'select',
    message: kleur.reset('Select package manager'),
    choices: getInstalledPackageManagersPrompt(installedPackageManagers),
  });

  if (!packageManager) {
    throw new TypelingsError('ERR_NO_SELECTED_PACKAGE_MANAGER');
  }

  const installDependenciesSpinner = spinner(
    'Installing dependencies...',
  ).start();

  await execa`${packageManager} install`;

  installDependenciesSpinner.succeed();
}
