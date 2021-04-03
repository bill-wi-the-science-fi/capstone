'use strict';

const db = require('../server/db');
const {User, Nomination, Transaction} = require('../server/db/models');

async function seed() {
  await db.sync({force: true});
  console.log('db synced!');
  await User.bulkCreate([
    {
      email: 'atunamelt@email.com',
      firstName: 'tuna',
      lastName: 'melt',
      password: '123',
      ethPublicAddress: '0x76a992fdc12221DEade9b0c299C3deDde5414f7d',
      imageUrl:
        'https://www.pinclipart.com/picdir/middle/395-3956920_free-download-jake-the-dog-finn-the-human.png',
      pin: '215019'
    },
    {
      email: 'viral@aol.com',
      firstName: 'Viral',
      lastName: 'Patel',
      password: '123',
      ethPublicAddress: '0x7Fe1759649DbAAB7ef53543C9896C12cf30883f7',
      pin: '215019'
    },
    {
      email: 'alanowatson@gmail.com',
      firstName: 'Alan',
      lastName: 'Watson',
      password: 'Ether2TheMoon!',
      ethPublicAddress: '0x4c5f05721bbcfabec7a5a2f58760d0a0ef20d0e6',
      imageUrl:
        'https://tisch.nyu.edu/content/dam/tisch/clive-davis-institute/alanwatson_crop.jpg',
      pin: '230419'
    },
    {
      email: 'alpay@gmail.com',
      firstName: 'Alpay',
      lastName: 'Aldemir',
      password: '123',
      ethPublicAddress: '0x7E797cEE6176283375A7b5975493F4fB36b54777',
      imageUrl:
        'https://tisch.nyu.edu/content/dam/tisch/clive-davis-institute/alanwatson_crop.jpg',
      pin: '230419'
    }
  ]);
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
