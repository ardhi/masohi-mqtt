async function reconnect ({ source }) {
  const { breakNsPath } = this.app.bajo
  const { subNs } = breakNsPath(source)
  this.log.debug('connIs%s%s', subNs, 'reconnecting')
}

export default reconnect
