#!/usr/bin/env node
import chalk from 'chalk'
import { Command } from 'commander'
import { ActionAdd, ActionLs, ActionUse, ActionRemove } from './actions'
import { drawBanner, suggestCommands } from './utils'

drawBanner('GCMM')

const program = new Command()
program.version(`gcmm ${require('../package.json').version}`).usage('<command> [options]')

program
  .command('add')
  .description('Add one custom git registry')
  // .option('-t, --template <templateName>', 'Template name for the project')
  .action(async (cmd: Command) => {
    const options = cmd.opts()
    console.log('options', options)
    const creator = new ActionAdd()
    await creator.run()
  })

program
  .command('ls')
  .description('List all the git registries')
  .action(async (cmd: Command) => {
    // const options = cleanArgs(cmd)
    const creator = new ActionLs()
    await creator.run()
  })

program
  .command('use')
  .description('Change registry to registry')
  .action(async (cmd: Command) => {
    // const options = cleanArgs(cmd)
    const creator = new ActionUse()
    await creator.run()
  })

program
  .command('remove')
  .description('Remove one custom registry')
  .action(async (cmd: Command) => {
    // const options = cleanArgs(cmd)
    const creator = new ActionRemove()
    await creator.run()
  })

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
