async function error ({ payload }) {
  this.log.error('error%s', payload)
}

export default error
