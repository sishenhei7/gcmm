import { execSync } from 'child_process'
import configstore from 'configstore'

const store = new configstore('gcmm')

export function actionAdd(alias: string, name: string, email: string) {
  store.set(alias, JSON.stringify({ name, email }))
  log(['', `Add ${alias}: ${name} ${email} success!`, ''])
}

export async function actionLs() {
  const infos = ['']
  const allConfigs = store.all as Record<string, string>
  const allAliases = Object.keys(allConfigs)
  const maxAliasLen = Math.max(...allAliases.map(alias => alias.length))
  const allNames = Object.values(allConfigs).map(str => JSON.parse(str).name)
  const maxNameLen = Math.max(...allNames.map(name => name.length))
  const currentName = execSync('git config user.name', { encoding: 'utf-8' }).toString().trim()
  const currentEmail = execSync('git config user.email', { encoding: 'utf-8' }).toString().trim()

  allAliases.forEach(alias => {
    const { name, email } = JSON.parse(allConfigs[alias])
    const prefix = currentName === name && currentEmail === email ? '*' : ' '
    const aliasInfo = `${alias}: ${drawBlank(alias, maxAliasLen)}`
    const nameInfo = `${name} ${drawLine(name, maxNameLen)}`
    infos.push(`${prefix} ${aliasInfo} ${nameInfo} ${email}`)
  })

  infos.push('')
  log(infos)
}

export function actionUse(alias: string, { global = false, replace = false }) {
  if (store.has(alias)) {
    const { name, email } = JSON.parse(store.get(alias))
    const globalMsg = global ? ' --global ' : ''
    const replaceMsg = replace ? ' --replace-all ' : ''
    execSync(`git config ${globalMsg}${replaceMsg}user.name ${name}`)
    execSync(`git config ${globalMsg}${replaceMsg}user.email ${email}`)
    log(['', `Git config has been set to ${name} ${email}${global ? ' globally' : ''}`, ''])
  }
}

export function actionRemove(alias: string) {
  if (store.has(alias)) {
    store.delete(alias)
    log(['', `Delete ${alias} success!`, ''])
  }
}

export function log(infos: string[]) {
  infos.forEach(info => console.log(info))
}

export function drawBlank(key: string, maxLen: number) {
  const len = maxLen - key.length + 1
  return Array(len).join(' ')
}

export function drawLine(key: string, maxLen: number) {
  const len = maxLen - key.length + 3
  return Array(len).join('-')
}
