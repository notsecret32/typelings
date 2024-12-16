import { execa } from 'execa';
import { Choice } from 'prompts';

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

const packageManagers: PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun'];

export async function getInstalledPackageManagers() {
  const installed: PackageManager[] = [];

  const checks = packageManagers.map(async (packageManager) => {
    try {
      await execa`${packageManager} --version`;
      installed.push(packageManager);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      /* empty */
    }
  });

  await Promise.all(checks);

  return installed;
}

export function createPackageManagerChoices(
  installedPackageManagers: PackageManager[],
): Choice[] {
  return packageManagers.map<Choice>((packageManager) =>
    installedPackageManagers.includes(packageManager)
      ? {
          title: packageManager,
          value: packageManager,
        }
      : {
          title: `${packageManager} (not installed)`,
          value: packageManager,
          disabled: true,
        },
  );
}
