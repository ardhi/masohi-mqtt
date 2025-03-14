import mqtt from 'mqtt'

async function masohiAfterStart () {
  const { camelCase } = this.lib._
  const { publish } = this.app.masohi

  for (const c of this.connections ?? []) {
    const client = mqtt.connect(c.url, c.options)
    for (const evt of this.events) {
      client.on(evt, async (...args) => {
        const opts = { topic: camelCase(evt), options: { ns: this.name, nsConn: c.name } }
        const payload = args.length <= 1 ? args[0] : args
        if (evt === 'error') opts.payload = { type: 'error', data: payload.message }
        else if (evt === 'message') opts.payload = { type: 'string', data: payload[1].toString(), topic: payload[0] }
        else opts.payload = { type: 'string', data: undefined }
        await publish(opts)
      })
    }
    c.instance = client
  }
}

export default masohiAfterStart
