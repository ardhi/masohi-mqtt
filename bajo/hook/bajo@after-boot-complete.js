import mqtt from 'mqtt'

async function afterBootComplete () {
  const { runHook } = this.app.bajo

  for (const c of this.connections ?? []) {
    const client = mqtt.connect(c.url, c.options)
    for (const evt of this.events) {
      client.on(evt, async (...args) => {
        const opts = { source: `${this.name}.${c.name}`, payload: { type: 'string', data: undefined } }
        let path = evt
        if (evt === 'message') {
          path = 'data'
          opts.source += `:${args[0]}`
          opts.payload.data = args[1].toString()
        }
        if (evt === 'error') opts.payload = { type: 'error', data: args[0].message }
        await runHook(`${this.name}:${path}`, opts, c.name)
        await runHook(`${this.name}.${c.name}:${path}`, opts)
      })
    }
    c.instance = client
  }
}

export default afterBootComplete
