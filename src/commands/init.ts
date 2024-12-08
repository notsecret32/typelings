import { Command } from 'commander';

export const init = new Command().name('init').action(async () => {
  console.log('Init command');
});
