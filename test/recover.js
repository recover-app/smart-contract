const { expect } = require("chai");

const provider = ethers.provider;
let recover, arbitrator;
let deployer, governor, owner0, owner1, finder0, finder1, qrCode0, qrCode1;
let contractAsSignerDeployer,
    contractAsSignerGovernor,
    contractAsSignerOwner0,
    contractAsSignerOwner1,
    contractAsSignerFinder0,
    contractAsSignerFinder1,
    contractAsSignerQrCode0,
    contractAsSignerQrCode1;

beforeEach(async function () {
  // Get the ContractFactory and Signers here.
  // TODO: deploy an Arbitrator
  const Recover = await ethers.getContractFactory("Recover");

  [deployer, governor, owner0, owner1, finder0, finder1, qrCode0, qrCode1, ...addrs] = await ethers.getSigners();

  recover = await Recover.deploy();
  await recover.deployed();

  contractAsSignerDeployer = recover.connect(deployer);
  contractAsSignerGovernor = recover.connect(governor);
  contractAsSignerOwner0 = recover.connect(owner0);
  contractAsSignerOwner1 = recover.connect(owner1);
  contractAsSignerFinder0 = recover.connect(finder0);
  contractAsSignerFinder1 = recover.connect(finder1);
  contractAsSignerQrCode0 = recover.connect(qrCode0);
  contractAsSignerQrCode1 = recover.connect(qrCode1);

  const initializeTx = await contractAsSignerDeployer.initialize(
    governor.address, // Governor address
    "0x0000000000000000000000000000000000000000", // FIXME: arbitrator address
    "0x", // FIXME: arbitratorExtraData
    "604800" // Fee Timeout: 604800s => 1 day
  );
});

describe("Recover", function () {
  it("Should return the new governor address once the smart contract is initialized", async function () {
    expect(await recover.governor()).to.equal(governor.address);
  });

  it("Should return the reward once the transaction between the owner0 and the finder0 is succeed.", async function () {
    // TODO:
    const addItemTx = await contractAsSignerOwner0.addItem(
      qrCode0.address, // _addressForEncryption address
      "ipfs://<descriptionEncryptedLink>",
      "1000000000000000000", // 1 eth
      "86400" // Timeout: 86400s => 1 day
    );

    await addItemTx.wait();

    expect(await recover.isItemExist("0")).to.be.true;

    const claimTx = await contractAsSignerQrCode0.claim(
      "0",
      finder0.address,
      "ipfs://<descriptionEncryptedLinkFromFinder>"
    );

    await claimTx.wait();

    expect((await recover.claims("1")).itemID.toString()).to.equal("0");

    const acceptClaimTx = await contractAsSignerOwner0.acceptClaim(
      "1",
      {
        value: "1000000000000000000"
      }
    );

    expect((await recover.claims("1")).isAccepted).is.true;

    const payTx = await contractAsSignerOwner0.pay(
      "1",
      "1000000000000000000",
    );

    await payTx.wait();

    expect((await provider.getBalance(finder0.address)).toString()).to.equal("10001000000000000000000");
  });
});
