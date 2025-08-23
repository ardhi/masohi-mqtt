async function factory (pkgName) {
  const me = this

  return class MasohiMqtt extends this.lib.Plugin {
    constructor () {
      super(pkgName, me.app)
      this.alias = 'mqtt'
      this.dependencies = ['masohi']
      this.config = {
        connections: [],
        subscribers: [],
        stations: []
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

    getStationData = ({ payload, source }) => {
      const { breakNsPath } = this.app.bajo
      const { find } = this.lib._
      const { subNs: connection, path } = breakNsPath(source)
      const [cid, , lid] = path.split('/')
      return find(this.config.stations, { connection, id: `${cid}-${lid}` })
    }
  }
}

export default factory
