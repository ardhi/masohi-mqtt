async function factory (pkgName) {
  const me = this

  return class MasohiMqtt extends this.lib.BajoPlugin {
    constructor () {
      super(pkgName, me.app)
      this.alias = 'mqtt'
      this.dependencies = ['masohi']
      this.config = {
        connections: [],
        subscribers: []
      }
      this.events = ['connect', 'reconnect', 'close', 'disconnect', 'offline',
        'error', 'end', 'message']
    }

    init = async () => {
      const { buildCollections } = this.app.bajo

      const connHandler = ({ item, options }) => {
        const { generateId } = this.app.bajo
        const { isString, has } = this.lib._
        if (isString(item)) item = { url: item }
        if (!has(item, 'url')) throw this.error('connMustHave%s', 'url')
        item.options = item.options ?? {}
        item.topic = item.topic ?? []
        if (isString(item.topic)) item.topic = [item.topic]
        if (!item.options.clientId) item.options.clientId = generateId()
      }
      this.connections = await buildCollections({ ns: this.name, handler: connHandler, container: 'connections' })
    }
  }
}

export default factory
