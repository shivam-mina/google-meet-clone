const userHome = async (req, res) => {
  try {
    res.json({ message: 'user home' })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  userHome,
}
