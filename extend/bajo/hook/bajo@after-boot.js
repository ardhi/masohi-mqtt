import mqtt from 'mqtt'

async function afterBoot () {
  const { runHook } = this.app.bajo

  for (const conn of this.connections ?? []) {
    const options = {
      username: conn.user,
      password: conn.password,
      topic: conn.topic,
      options: conn.options ?? {}
    }
    const client = mqtt.connect(conn.url, options)
    for (const evt of this.events) {
      client.on(evt, async (...args) => {
        let source = `${this.ns}.${conn.name}` // <ns>.<connName>[:<topic>]
        let payload
        let error
        let path = evt
        if (evt === 'message') {
          path = 'data'
          source += `:${args[0]}` // see above format, args[0] is MQTT topic
          payload = args[1]
          if (conn.payloadType === 'json') payload = JSON.parse(payload.toString())
        } else if (evt === 'error') {
          error = args[0]
        }
        await runHook(`${this.ns}:${path}`, { payload, source, error }, conn)
        await runHook(`${this.ns}.${conn.name}:${path}`, { payload, source, error })
      })
    }
    conn.client = client
  }
}

export default afterBoot
