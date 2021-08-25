import configstore from 'configstore'

const store = new configstore('gcmm')

export function actionAdd(name: string, email: string) {
  store.set(name, email)
}

export function actionLs() {

}

export function actionUse(name: string, args: Record<string, string>) {
  console.log('args', args)
}

export function actionRemove(name: string) {

}


