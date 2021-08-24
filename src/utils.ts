import chalk from 'chalk'
import figlet from 'figlet'
import { Command } from 'commander'
import leven from './leven'

export function drawBanner(text: string) {
  console.log(chalk.yellow(figlet.textSync(text, { horizontalLayout: 'full' })))
}

export function suggestCommands(commands: Command['commands'], unknownCommand: Command) {
  let suggestion = ''

  const availableCommands = commands.map(cmd => cmd.name())
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

export function camelize(str: string) {
  return str.replace(/-(\w)/g, (_: string, c: string) => (c ? c.toUpperCase() : ''))
}

// export function cleanArgs(cmd: Command) {
//   const args = {} as Record<string, any>
//   cmd.options.forEach((o: Option) => {
//     const key = camelize(o.long.replace(/^--/, ''))
//     // if an option is not present and Command has a method with the same name
//     // it should not be copied
//     if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
//       args[key] = cmd[key]
//     }
//   })
//   return args
// }


