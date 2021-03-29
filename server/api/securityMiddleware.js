const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.status(403).send('Permission denied')
  }
}

const checkAwardRelation = async (req, res, next) => {
  if (req.user) {
    /// awards/:id/edit
    /// we want to  check if they are a nominator or nominatee
    const awardID = req.params.id
    const award = await Award.findOne({
      where: {
        id: awardID
      }
    })
    const pair = Nomination.findAll({
      where: {
        id: award.pairId
      }
    })

    // check if they are a nominator or nominatee
    if (pair.recipientId === req.user.id || pair.userId === req.user.id) {
      next()
    } else {
      res.status(403).send('Permission denied')
    }
  } else {
    res.status(403).send('Permission denied')
  }
}

module.exports = {isLoggedIn, checkAwardRelation}
