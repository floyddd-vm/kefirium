async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const TestKefirium = await ethers.getContractFactory("TestKefirium");
  const hardhatKef = await TestKefirium.deploy("ipfs://base/", deployer.address);

  console.log("TestKefirium address:", hardhatKef.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
