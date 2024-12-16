import { execa } from 'execa';
import fg from 'fast-glob';
import fs from 'fs-extra';
import path from 'path';
import { TypelingsError } from './errors';
import { PackageManager } from './package-managers';
import { PACKAGE_JSON, README, TS_CONFIG } from './templates';

type FileGroup = {
  folder: string;
  tsFiles: string[];
  testFiles: string[];
};

export async function createProject() {
  if (fs.existsSync(path.join(process.cwd(), 'typelings'))) {
    throw new TypelingsError('ERR_DIR_ALREADY_EXISTS');
  }

  const projectPath = fs.mkdirSync(path.join(process.cwd(), 'typelings'), {
    recursive: true,
  });

  if (!projectPath) {
    throw new TypelingsError('ERR_FAILED_TO_GENERATE_PROJECT');
  }

  const exercisesPath = path.join(import.meta.dirname, 'exercises');
  const utilsPath = path.join(import.meta.dirname, 'utils');

  const folders = await fg(['**/*'], {
    cwd: exercisesPath,
    onlyDirectories: true,
  });

  const fileGroups: Record<string, FileGroup> = {};

  for (const folder of folders) {
    const chapterPath = path.join(exercisesPath, folder);

    const files = await fg(['**/*.ts', '**/*.test.ts'], {
      cwd: chapterPath,
      ignore: ['**/*.solution.ts'],
    });

    for (const file of files) {
      const baseName = path.basename(file).replace(/\.(ts|test\.ts)$/, '');
      const fileType = file.endsWith('.test.ts') ? 'testFiles' : 'tsFiles';

      if (!fileGroups[baseName]) {
        fileGroups[baseName] = { folder, tsFiles: [], testFiles: [] };
      }

      fileGroups[baseName][fileType].push(path.join(chapterPath, file));
    }
  }

  for (const [baseName, { folder, tsFiles, testFiles }] of Object.entries(
    fileGroups,
  )) {
    const chapterPath = path.join(process.cwd(), 'typelings', folder);
    fs.ensureDirSync(chapterPath);

    const outputFilePath = path.join(chapterPath, `${baseName}.ts`);
    const writeStream = fs.createWriteStream(outputFilePath);

    for (const tsFile of tsFiles) {
      const content = await fs.readFile(tsFile, 'utf-8');
      writeStream.write(content + '\n');
    }

    for (const testFile of testFiles) {
      const content = await fs.readFile(testFile, 'utf-8');
      writeStream.write(content + '\n');
    }

    writeStream.end();
  }

  const projectFiles = {
    'package.json': PACKAGE_JSON,
    'tsconfig.json': TS_CONFIG,
    'README.md': README,
    'index.d.ts': fs.readFileSync(path.join(utilsPath, 'index.d.ts')),
  };

  for (const [fileName, content] of Object.entries(projectFiles)) {
    await fs.writeFile(path.join(projectPath, fileName), content);
  }
}

export async function downloadDependencies(packageManager: PackageManager) {
  await execa(packageManager, ['install'], {
    cwd: path.join(process.cwd(), 'typelings'),
  });
}
