const { expect } = require("chai")
//const { ethers } = require("hardhat")

describe("Mint", function () {
    let deployer
    let user1
    let user2
    let nftContract
    let base = "ipfs://base/"
  
    beforeEach(async function() {
      [deployer, user1, user2] = await ethers.getSigners();
      const TestKefirium = await ethers.getContractFactory("TestKefirium", deployer);
      nftContract = await TestKefirium.deploy(base, deployer.address);
    })
  
    it("should be deployed", async function() {
      expect(nftContract.target).to.be.properAddress
    })
  
    it("should have 0 nft by default", async function() {
      const count = await nftContract.balanceOf(deployer.address)
      expect(count).to.eq(0)
    })

    it("should have 1 nft at deployer", async function() {
        const tx = await nftContract.connect(deployer).safeMintPrivileged(deployer.address, 1)
        await tx.wait();
        const count = await nftContract.balanceOf(deployer.address)
        expect(count).to.eq(1)
    })

    it("check is valid baseURI/tokenURI", async function() {
        let tokenId = 15;
        const tx = await nftContract.connect(deployer).safeMintPrivileged(deployer.address, tokenId)
        await tx.wait();
        const count = await nftContract.balanceOf(deployer.address)
        expect(count).to.eq(1)

        const baseURI = await nftContract.baseURI()
        expect(baseURI).to.eq(base)
        const tokenURI = await nftContract.tokenURI(tokenId)
        expect(tokenURI).to.eq(base+tokenId)
        //TODO:  add in contract modifier - exist tokenId
    })

    it("check reverted mint from user1 with 0 eth", async function() {
        await expect(
            nftContract.connect(user1).safeMint(user1.address, 1, {value: ethers.parseEther("0.0")})
       ).to.be.revertedWith('Mint costs 0.01 eth');

        let count = await nftContract.balanceOf(user1.address)
        expect(count).to.eq(0)
    })

    it("check mint from user1 with 0 eth + white list", async function() {
        let white_list_role = await nftContract.WHITE_LIST_ROLE();
        let tx_add = await nftContract.connect(deployer).grantRole(white_list_role, user1.address);
        await tx_add.wait();

        let tx_mint = await nftContract.connect(user1).safeMintPrivileged(user1.address, 1)
        await tx_mint.wait();

        let count = await nftContract.balanceOf(user1.address)
        expect(count).to.eq(1)
    })

    it("check mint from user1 with 0.01 eth", async function() {
        let tx_mint = await nftContract.connect(user1).safeMint(user1.address, 1, {value: ethers.parseEther("0.01")})
        await tx_mint.wait();

        let count = await nftContract.balanceOf(user1.address)
        expect(count).to.eq(1)
    })

    it("check pac-mint from admin", async function() {
        let tokenIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let tx_mint = await nftContract.connect(deployer).mintPac(tokenIds)
        await tx_mint.wait();

        let count = await nftContract.balanceOf(deployer.address)
        expect(count).to.eq(10)
    })

    it("pausable", async function() {
        let tx_pause = await nftContract.connect(deployer).pause();
        await tx_pause.wait();

        await expect(
            nftContract.connect(user1).safeMint(user1.address, 1, {value: ethers.parseEther("0.01")})
       ).to.be.reverted;

        let count = await nftContract.balanceOf(user1.address)
        expect(count).to.eq(0)

        let tx_unpause = await nftContract.connect(deployer).unpause();
        await tx_unpause.wait();

        let tx = await nftContract.connect(user1).safeMint(user1.address, 1, {value: ethers.parseEther("0.01")});
        await tx.wait();

        count = await nftContract.balanceOf(user1.address)
        expect(count).to.eq(1)
    })

    it("withdrawal", async function() {  
        let balance = await ethers.provider.getBalance(deployer.address);
        let tx_mint = await nftContract.connect(user1).safeMint(user1.address, 1, {value: ethers.parseEther("1")})
        await tx_mint.wait();
        let tx_wthdr = await nftContract.connect(deployer).withdrawETH();
        await tx_wthdr.wait();


        let new_balance = await ethers.provider.getBalance(deployer.address);
        expect(new_balance > balance).to.be.true;
    })
})