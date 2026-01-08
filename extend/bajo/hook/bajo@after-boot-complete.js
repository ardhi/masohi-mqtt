import mqtt from 'mqtt'

async function afterBootComplete () {
  const { runHook } = this.app.bajo

  for (const c of this.connections ?? []) {
    const client = mqtt.connect(c.url, c.options)
    for (const evt of this.events) {
      client.on(evt, async (...args) => {
        let source = `${this.ns}.${c.name}` // <ns>.<connName>[:<topic>]
        let payload
        let error
        let path = evt
        if (evt === 'message') {
          path = 'data'
          source += `:${args[0]}` // see above format, args[0] is MQTT topic
          payload = args[1].toString()
          if (c.payloadType === 'json') payload = JSON.parse(payload)
        } else if (evt === 'error') {
          error = args[0]
        }
        await runHook(`${this.ns}:${path}`, { payload, source, error }, c)
        await runHook(`${this.ns}.${c.name}:${path}`, { payload, source, error })
      })
    }
    c.instance = client
  }
}

export default afterBootComplete
