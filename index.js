/**
 * Plugin factory
 *
 * @param {string} pkgName - NPM package name
 * @returns {class}
 */
async function factory (pkgName) {
  const me = this

  /**
   * MasohiMqtt class
   *
   * @class
   */
  class MasohiMqtt extends this.app.baseClass.Base {
    constructor () {
      super(pkgName, me.app)
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
        const { generateId } = this.app.lib.aneka
        const { isString, has } = this.app.lib._
        if (isString(item)) item = { url: item }
        if (!has(item, 'url')) throw this.error('connMustHave%s', 'url')
        item.options = item.options ?? {}
        item.topic = item.topic ?? []
        if (isString(item.topic)) item.topic = [item.topic]
        if (!item.options.clientId) item.options.clientId = generateId()
      }
      this.connections = await buildCollections({ ns: this.ns, handler: connHandler, container: 'connections' })
    }

    getStationData = ({ payload, source }) => {
      const { breakNsPath } = this.app.bajo
      const { find } = this.app.lib._
      const { subNs: connection, path } = breakNsPath(source)
      const [cid, , lid] = path.split('/')
      return find(this.config.stations, { connection, id: `${cid}-${lid}` })
    }
  }

  return MasohiMqtt
}

export default factory
