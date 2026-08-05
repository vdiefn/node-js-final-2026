const healthcheck = (req, res) => {
  res.status(200).send("OK")
}

module.exports = { healthcheck }