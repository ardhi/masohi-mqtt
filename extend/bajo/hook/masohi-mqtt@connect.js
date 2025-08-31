async function connect ({ source }) {
  const { find } = this.app.lib._
  const { breakNsPath } = this.app.bajo
  const opts = breakNsPath(source)
  const { subNs } = opts
  this.log.debug('connIs%s%s', subNs, 'connected')
  const conn = find(this.connections, { name: subNs })
  if (!conn) return
  for (const topic of conn.topic) {
    conn.instance.subscribe(topic, err => {
      if (err) this.log.error('cantSubscribeTo%s%s%s', subNs, topic, err.message)
    })
  }
}

export default connect
