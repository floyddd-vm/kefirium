const { task, types } = require('hardhat/config');

task("count_nft","Show count Nft")
    .addParam("contract", "The contract address")
    .addParam("account", "The account address")
    .setAction(async (taskArgs,{ethers, getNamedAccounts}) => {   
        const [deployer] = await ethers.getSigners();
        const TestKefirium = await ethers.getContractAt("TestKefirium", taskArgs.contract);

        console.log(await TestKefirium.balanceOf(taskArgs.account));
    });

task("mint", "mint nft")
    .addParam("contract", "The contract address")
    .addParam("to", "The account address for recive nft")
    .addParam("tokenid", " new token id",0, types.int)
    .setAction(async (taskArgs) => {
      const user1 = (await ethers.getSigners())[1];
      const TestKefirium = await ethers.getContractAt("TestKefirium", taskArgs.contract);

      const tx = await TestKefirium.connect(user1).safeMint(taskArgs.to, taskArgs.tokenid, {value: ethers.parseEther("0.01")})
      await tx.wait();
    });

task("mint_pac", "Mint pac nft")
    .addParam("contract", "The contract address")
    .addParam("ids", "tokenIds array (string:\" , , , \")")
    .setAction(async (taskArgs) => {   
        const [deployer] = await ethers.getSigners();
        const TestKefirium = await ethers.getContractAt("TestKefirium", taskArgs.contract);
        const ids = taskArgs.ids.split(',');

        const tx = await TestKefirium.mintPac(ids);
        await tx.wait();

        console.log(await TestKefirium.balanceOf(deployer.address));
    });