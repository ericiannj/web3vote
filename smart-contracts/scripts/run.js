const main = async () => {
  // const voteContractFactory = await hre.ethers.getContractFactory("VotePortal");
  // const voteContract = await voteContractFactory.deploy();
  // await voteContract.deployed();
  // console.log("Endereço do contrato:", voteContract.address);

  const ballotContractFactory = await hre.ethers.getContractFactory("BallotPortal");
  const ballotContract = await ballotContractFactory.deploy();
  await ballotContract.deployed();
  console.log("Endereço do contrato:", ballotContract.address);

  // let voteCount;
  // voteCount = await voteContract.getTotalVotes();
  // console.log(voteCount.toNumber());

  const ballotExample = {
    title : 'Qual o melhor do mundo?',
    description :'Gostaríamos de saber quem é o maior atleta.',
    p1:{name: 'Pelé', order: 0, numberOfVotes: 0},
    p2: {name: 'Michael Jordan', order: 1, numberOfVotes: 0},
    p3:{name: 'Lewis Hamilton', order: 2, numberOfVotes: 0},
    p4: {name: 'Michael Phelps', order: 3, numberOfVotes: 0},
  }
// ballotExample.p1, ballotExample.p2, ballotExample.p3, ballotExample.p4
  ballotTxn = await ballotContract.createBallot(ballotExample.title, ballotExample.description);
  // ballotTxn = await ballotContract.createBallot({
  //   title: ballotExample.title, 
  //   description: ballotExample.description, 
  //   // p1: ballotExample.p1, 
  //   // p2: ballotExample.p2, 
  //   // p3:ballotExample.p3, 
  //   // p4: ballotExample.p4
  // });
  await ballotTxn.wait(); 
  let ballots = await ballotContract.getAllBallots();
  console.log('1', ballots)

  ballotTxn = await ballotContract.createBallot(ballotExample.title, ballotExample.description);
  await ballotTxn.wait(); 
  let ballots2 = await ballotContract.getAllBallots();
  console.log('2', ballots2)

  // const [_, randomPerson] = await hre.ethers.getSigners();
  // voteTxn = await voteContract.connect(randomPerson).vote(test.title, test.description);
  // await voteTxn.wait(); 

  // let allBallots = await ballotContract.getAllBallots();
  // console.log(allBallots);

  // let voteTxn;
  // voteTxn = await ballotContract.vote(allBallots[0], 2)
  // await voteTxn.wait();

  // console.log('--------RESULTADO---------')
  // let secondBallots = await ballotContract.getAllBallots();
  // console.log(secondBallots);

  // let voteTxn = await voteContract.vote(test.title, test.description);
  // await voteTxn.wait(); 

  // const [_, randomPerson] = await hre.ethers.getSigners();
  // voteTxn = await voteContract.connect(randomPerson).vote(test.title, test.description);
  // await voteTxn.wait(); 

  // let allVotes = await voteContract.getAllVotes();
  // console.log(allVotes);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();