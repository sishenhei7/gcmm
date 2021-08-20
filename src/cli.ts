#!/usr/bin/env node
import { Command, Option } from 'commander'
import chalk from 'chalk'
import leven from 'leven'
import figlet from 'figlet'
import { ActionAdd, ActionLs, ActionUse, ActionRemove } from './actions'

console.log(chalk.yellow(figlet.textSync('Gcmm', { horizontalLayout: 'full' })))

const program = new Command()

program.version(`gcmm ${require('../package.json').version}`).usage('<command> [options]')

program
  .command('add')
  .description('Add one custom git registry')
  .action(async cmd => {
    // const options = cleanArgs(cmd)
    const creator = new ActionLs()
    await creator.run()
  })

program
  .command('ls')
  .description('List all the git registries')
  .action(async (cmd) => {
    // const options = cleanArgs(cmd)
    const creator = new ActionLs()
    await creator.run()
  })

program
  .command('use')
  .description('Change registry to registry')
  .action(async cmd => {
    // const options = cleanArgs(cmd)
    const creator = new ActionLs()
    await creator.run()
  })

program
  .command('remove')
  .description('Remove one custom registry')
  .action(async cmd => {
    // const options = cleanArgs(cmd)
    const creator = new ActionLs()
    await creator.run()
  })

// output help information on unknown commands
program.arguments('<command>').action(cmd => {
  program.outputHelp()
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
  console.log()
  suggestCommands(cmd)
})

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`gcmm <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))
program.parse(process.argv)

function suggestCommands(unknownCommand: string) {
  const availableCommands = program.commands.map(cmd => cmd._name)

  let suggestion = ''

  availableCommands.forEach(cmd => {
    const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand)
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd
    }
  })

  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
  }
}

function camelize(str: string) {
  return str.replace(/-(\w)/g, (_: string, c: string) => (c ? c.toUpperCase() : ''))
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd: Command) {
  const args = {} as Record<string, any>
  cmd.options.forEach((o: Option) => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
