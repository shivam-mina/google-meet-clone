const { emailToSocketMapping } = require('../socketIo')

const onlineUsers = async (req, res) => {
  try {
    const mapObject = {}
    for (let [key, value] of emailToSocketMapping) mapObject[key] = value

    res.status(200).json(mapObject)
  } catch (error) {
    console.log(error)
  }
}
module.exports = { onlineUsers }
