'use strict'

const db = require('../server/db')
const {User, Nomination, Transaction} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      email: 'cody@email.com',
      firstName: 'Alan',
      lastName: 'Watson',
      password: '123',
      pin: '215019'
    }),
    User.create({
      email: 'murphy@email.com',
      firstName: 'Alan',
      lastName: 'Watson',
      password: '123',
      pin: '215019'
    }),
    User.create({
      email: 'alanowatson@gmail.com',
      firstName: 'Alan',
      lastName: 'Watson',
      password: 'Ether2TheMoon!',
      ethPublicAddress: '0x4c5f05721bbcfabec7a5a2f58760d0a0ef20d0e6',
      imgUrl:
        'https://tisch.nyu.edu/content/dam/tisch/clive-davis-institute/alanwatson_crop.jpg',
      pin: '230419'
    })
  ])
  const cody = users[0]
  const murphy = users[1]
  const alan = users[2]

  let cole = await User.findOrCreate({
    where: {
      email: 'cole@email.com',
      firstName: 'Alan',
      lastName: 'Watson'
    }
  })

  cole = cole[0]

  let alansTrx = await Transaction.findOrCreate({
    where: {
      transactionHash:
        '0x05cbd37d856b8a5fb78799c023c132d8feace6d319e1c7d5391bb36fce86a59f',
      smartContractAddress: '0x60f80121c31a0d46b5279700f9df786054aa5ee5',
      amountEther: 1000
    }
  })
  alansTrx = alansTrx[0]
  await cody.addRecipient(murphy)
  //setRecipient is BASICALLY nominate a user.
  await murphy.addRecipient(alan)
  await alan.addRecipient(murphy)
  await alan.addRecipient(cole)

  let throughRow = await Nomination.findOne({
    where: {
      userId: cody.id,
      recipientId: murphy.id
    }
  })
  let throughRow2 = await Nomination.findOne({
    where: {userId: murphy.id, recipientId: alan.id}
  })
  let throughRow3 = await Nomination.findOne({
    where: {userId: alan.id, recipientId: murphy.id}
  })

  let throughRow4 = await Nomination.findOne({
    where: {userId: alan.id, recipientId: cole.id}
  })

  let maybeAward = await throughRow.createAward({
    title: 'coleaward',
    donationLimit: 1000,
    donationTotal: 60
  })
  let maybeAward2 = await throughRow2.createAward({
    title: 'alanAward',
    donationLimit: 1000,
    donationTotal: 50
  })
  let maybeAward3 = await throughRow.createAward({
    title: 'test',
    donationLimit: 1000,
    donationTotal: 40
  })
  let maybeAward4 = await throughRow3.createAward({
    title: 'test 2',
    donationLimit: 1000,
    donationTotal: 30
  })
  let maybeAward5 = await throughRow4.createAward({
    title: 'test Guest',
    donationLimit: 1000,
    donationTotal: 20
  })
  await alansTrx.setAward(maybeAward4)
  await alansTrx.setUser(alan)
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
