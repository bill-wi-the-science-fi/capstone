'use strict'

const db = require('../server/db')
const {User, Nomination} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'}),
    User.create({email: 'Alan@email.com', password: '123'}),
  ])
  const cody = users[0]
  const murphy = users[1]
  const alan = users[2]

  let cole = await User.findOrCreate({
    where: {
      email: 'cole@email.com',
    },
  })
  cole = cole[0]

  await cody.addRecipient(murphy)
  //setRecipient is BASICALLY nominate a user.
  await murphy.addRecipient(alan)
  await alan.addRecipient(murphy)
  await alan.addRecipient(cole)

  let throughRow = await Nomination.findOne({
    where: {userId: cody.id, recipientId: murphy.id},
  })
  let throughRow2 = await Nomination.findOne({
    where: {userId: murphy.id, recipientId: alan.id},
  })
  let throughRow3 = await Nomination.findOne({
    where: {userId: alan.id, recipientId: murphy.id},
  })

  let throughRow4 = await Nomination.findOne({
    where: {userId: alan.id, recipientId: cole.id},
  })

  let maybeAward = await throughRow.createAward({title: 'coleaward'})
  let maybeAward2 = await throughRow2.createAward({title: 'alanAward'})
  let maybeAward3 = await throughRow.createAward({title: 'test'})
  let maybeAward4 = await throughRow3.createAward({title: 'test 2'})
  let maybeAward5 = await throughRow4.createAward({title: 'test Guest'})

  console.log('\n --------🚀 \n seed \n throughRow', maybeAward)

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
