import { createProject, downloadDependencies } from '@/utils/create-project';
import { TypelingsError } from '@/utils/errors';
import { handleError } from '@/utils/handle-error';
import { highlighter } from '@/utils/highlighter';
import { logger } from '@/utils/logger';
import {
  createPackageManagerChoices,
  getInstalledPackageManagers,
} from '@/utils/package-managers';
import { spinner } from '@/utils/spinner';
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';

export const init = new Command()
  .name('init')
  .description('initialize your project and install dependencies')
  .action(async () => {
    try {
      await runInit();

      logger.log(
        `${highlighter.success('Success!')} Project initialization completed.`,
      );
    } catch (error) {
      logger.break();
      handleError(error);
    }
  });

async function runInit() {
  if (fs.existsSync(path.join(process.cwd(), 'typelings'))) {
    throw new TypelingsError('ERR_DIR_ALREADY_EXISTS');
  }

  const installedPackageManagers = await getInstalledPackageManagers();

  if (installedPackageManagers.length === 0) {
    throw new TypelingsError('ERR_NO_INSTALLED_PACKAGE_MANAGERS');
  }

  const { proceed, packageManager } = await prompts([
    {
      name: 'proceed',
      type: 'confirm',
      message:
        'This command will create the directory `typelings/`. Do you agree?',
      initial: true,
    },
    {
      name: 'packageManager',
      type: 'select',
      message: 'Select package manager',
      choices: createPackageManagerChoices(installedPackageManagers),
    },
  ]);

  if (!proceed) {
    process.exit(0);
  }

  if (!packageManager) {
    throw new TypelingsError('ERR_NO_SELECTED_PACKAGE_MANAGER');
  }

  const projectSpinner = spinner('Initializing project...').start();
  await createProject();
  projectSpinner.succeed();

  const dependenciesSpinner = spinner('Downloading dependencies...').start();
  await downloadDependencies(packageManager);
  dependenciesSpinner.succeed();
}
