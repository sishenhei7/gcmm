#!/usr/bin/env node
import chalk from 'chalk'
import { Command } from 'commander'
import { actionAdd, actionLs, actionUse, actionRemove } from './actions'
import { drawBanner, suggestCommands } from './utils'

drawBanner('GCMM')

const program = new Command()
program.version(`gcmm ${require('../package.json').version}`).usage('<command> [options]')

// prettier-ignore
program
  .command('add <name> <email>')
  .description('Add one custom git registry')
  .action(actionAdd)

// prettier-ignore
program
  .command('ls')
  .description('List all the git registries')
  .action(actionLs)

// prettier-ignore
program
  .command('use <name>')
  .description('Change registry to registry')
  .option('-g, --global', 'Whether the command is global')
  .action(actionUse)

// prettier-ignore
program
  .command('remove <name>')
  .description('Remove one custom registry')
  .action(actionRemove)

// output help information on unknown commands
program.arguments('<command>').action((cmd: Command) => {
  program.outputHelp()
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
  console.log()
  // suggestCommands.call(this, cmd)
  suggestCommands(program.commands, cmd)
})

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`gcmm <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))
program.parse(process.argv)
