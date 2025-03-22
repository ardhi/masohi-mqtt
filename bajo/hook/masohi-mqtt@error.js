async function error ({ payload }) {
  this.log.error('error%s', payload.data)
}

export default error
