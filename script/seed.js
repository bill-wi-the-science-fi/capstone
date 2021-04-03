'use strict';

const db = require('../server/db');
const {User, Nomination, Transaction} = require('../server/db/models');

// async function seed() {
//   await db.sync({force: true});
//   console.log('db synced!');
//   await User.bulkCreate([
//     {
//       email: 'atunamelt@email.com',
//       firstName: 'tuna',
//       lastName: 'melt',
//       password: '123',
//       ethPublicAddress: '0x76a992fdc12221DEade9b0c299C3deDde5414f7d',
//       imageUrl:
//         'https://www.pinclipart.com/picdir/middle/395-3956920_free-download-jake-the-dog-finn-the-human.png',
//       pin: '215019'
//     },
//     {
//       email: 'viral@aol.com',
//       firstName: 'Viral',
//       lastName: 'Patel',
//       password: '123',
//       ethPublicAddress: '0x7Fe1759649DbAAB7ef53543C9896C12cf30883f7',
//       pin: '215019'
//     },
//     {
//       email: 'alanowatson@gmail.com',
//       firstName: 'Alan',
//       lastName: 'Watson',
//       password: 'Ether2TheMoon!',
//       ethPublicAddress: '0x4c5f05721bbcfabec7a5a2f58760d0a0ef20d0e6',
//       imageUrl:
//         'https://tisch.nyu.edu/content/dam/tisch/clive-davis-institute/alanwatson_crop.jpg',
//       pin: '230419'
//     },
//     {
//       email: 'alpay@gmail.com',
//       firstName: 'Alpay',
//       lastName: 'Aldemir',
//       password: '123',
//       ethPublicAddress: '0x7E797cEE6176283375A7b5975493F4fB36b54777',
//       imageUrl:
//         'https://tisch.nyu.edu/content/dam/tisch/clive-davis-institute/alanwatson_crop.jpg',
//       pin: '230419'
//     }
//   ]);
// }

async function seed() {
  await db.sync({force: true});
  console.log('db synced!');

  const users = await Promise.all([
    User.create({
      email: 'atunamelt@email.com',
      firstName: 'Cole',
      lastName: 'Kuntzman',
      password: '123',
      ethPublicAddress: '0x76a992fdc12221DEade9b0c299C3deDde5414f7d',
      imageUrl:
        'https://www.pinclipart.com/picdir/middle/395-3956920_free-download-jake-the-dog-finn-the-human.png',
      pin: '215019'
    }),
    User.create({
      email: 'viral@aol.com',
      firstName: 'Viral',
      lastName: 'Patel',
      password: '123',
      ethPublicAddress: '0x7Fe1759649DbAAB7ef53543C9896C12cf30883f7',
      pin: '215019'
    }),
    User.create({
      email: 'alanowatson@gmail.com',
      firstName: 'Alan',
      lastName: 'Watson',
      password: 'Ether2TheMoon!',
      ethPublicAddress: '0x4c5f05721bbcfabec7a5a2f58760d0a0ef20d0e6',
      imageUrl:
        'https://tisch.nyu.edu/content/dam/tisch/clive-davis-institute/alanwatson_crop.jpg',
      pin: '230419'
    }),
    User.create({
      email: 'alpay@gmail.com',
      firstName: 'Alpay',
      lastName: 'Aldemir',
      password: '123',
      ethPublicAddress: '0x3AFAe04805bB556Ff14A4af4aa7875053D6C3948',
      imageUrl:
        'https://tisch.nyu.edu/content/dam/tisch/clive-davis-institute/alanwatson_crop.jpg',
      pin: '230419'
    })
  ]);
  const cody = users[0];
  const murphy = users[1];
  const alan = users[2];

  let test = await User.findOrCreate({
    where: {
      email: 'test@email.com',
      firstName: 'Test',
      lastName: 'Tester'
    }
  });

  test = test[0];

  let alansTrx = await Transaction.findOrCreate({
    where: {
      transactionHash:
        '0x05cbd37d856b8a5fb78799c023c132d8feace6d319e1c7d5391bb36fce86a59f',
      smartContractAddress: '0x60f80121c31a0d46b5279700f9df786054aa5ee5',
      amountWei: '1000'
    }
  });
  alansTrx = alansTrx[0];
  await cody.addRecipient(murphy);
  //setRecipient is BASICALLY nominate a user.
  await murphy.addRecipient(alan);
  await alan.addRecipient(murphy);
  await alan.addRecipient(test);

  let throughRow = await Nomination.findOne({
    where: {
      userId: cody.id,
      recipientId: murphy.id
    }
  });
  let throughRow2 = await Nomination.findOne({
    where: {userId: murphy.id, recipientId: alan.id}
  });
  let throughRow3 = await Nomination.findOne({
    where: {userId: alan.id, recipientId: murphy.id}
  });

  let throughRow4 = await Nomination.findOne({
    where: {userId: alan.id, recipientId: test.id}
  });

  let maybeAward = await throughRow.createAward({
    title: 'The best trash-picker-upper',
    imageUrl:
      'https://www.confidenceiatry.com/wp-content/uploads/2020/07/Good-Deeds-1-scaled.jpg',
    description: 'Picked up the most trash of any human ever',
    donationLimit: '7000000000000000000',
    donationTotal: '200000000000000000',
    timeConstraint: Date.now()
  });
  let maybeAward2 = await throughRow2.createAward({
    title: 'The Do-Gooder extraordinaire (Who also Dances)',
    imageUrl:
      'https://www.glossycover.com/wp-content/uploads/2016/07/Ballroom-dancing-1068x1068.jpg',
    description: 'Teaching the world how to dance thier way into good deeds',
    donationLimit: '7000000000000000000',
    donationTotal: '2000000000000000000'
  });
  let maybeAward3 = await throughRow.createAward({
    title: 'Viral is so awesome, he gets two awards',
    imageUrl:
      'https://www.imperiumsnow.com/upload/1-udpvcpu7sqlvxgy15zgxrq.jpeg',
    description:
      'If you know Viral, you know he just deserves this second one...',
    donationLimit: '7000000000000000000',
    donationTotal: '100000000000000000'
  });
  let maybeAward4 = await throughRow3.createAward({
    title: 'You know what, he gets a third',
    imageUrl:
      'https://3.bp.blogspot.com/_1lDbkPOXDuY/TKKyRrNp0CI/AAAAAAAAC04/OXBTDZcaMag/s1600/DSC06246.JPG',
    description: 'Obviously this is for testing... or he really that great?',
    donationLimit: '7000000000000000000',
    donationTotal: '500000000000000000'
  });
  let maybeAward5 = await throughRow4.createAward({
    title: 'So... is this a dog or a Hyena',
    description:
      'We have an unresolved group debate on what this animal actully was... Vote "Dog" with 2 ETH or Vote "Hyena" with 1 ETH',
    donationLimit: '7000000000000000000',
    donationTotal: '1000000000000000000'
  });
  let maybeAward6 = await throughRow4.createAward({
    title: 'So... is this a dog or a Hyena',
    description:
      'We have an unresolved group debate on what this animal actully was... Vote "Dog" with 2 ETH or Vote "Hyena" with 1 ETH',
    donationLimit: '7000000000000000000',
    donationTotal: '1000000000000000000'
  });
  let maybeAward7 = await throughRow4.createAward({
    title: 'So... is this a dog or a Hyena',
    description:
      'We have an unresolved group debate on what this animal actully was... Vote "Dog" with 2 ETH or Vote "Hyena" with 1 ETH',
    donationLimit: '7000000000000000000',
    donationTotal: '1000000000000000000'
  });
  let maybeAward8 = await throughRow4.createAward({
    title: 'So... is this a dog or a Hyena',
    description:
      'We have an unresolved group debate on what this animal actully was... Vote "Dog" with 2 ETH or Vote "Hyena" with 1 ETH',
    donationLimit: '7000000000000000000',
    donationTotal: '1000000000000000000'
  });

  await alansTrx.setAward(maybeAward4);
  await alansTrx.setUser(alan);
  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
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
