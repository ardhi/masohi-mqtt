async function connect ({ nsConn }) {
  const { find } = this.lib._
  this.log.debug('connIs%s%s', nsConn, 'connected')
  const conn = find(this.connections, { name: nsConn })
  for (const topic of conn.topic) {
    conn.instance.subscribe(topic, err => {
      if (err) this.log.error('cantSubscribeTo%s%s%s', nsConn, topic, err.message)
    })
  }
}

export default connect
