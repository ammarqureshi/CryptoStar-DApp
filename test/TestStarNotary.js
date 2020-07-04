const StarNotary = artifacts.require('StarNotary');

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async () => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, { from: accounts[0] });
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!');
});

it('lets user1 put up their star for sale', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei('.01', 'ether');
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei('.01', 'ether');
    let balance = web3.utils.toWei('.05', 'ether');
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, { from: user2, value: balance });
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei('.01', 'ether');
    let balance = web3.utils.toWei('.05', 'ether');
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, { from: user2, value: balance });
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei('.01', 'ether');
    let balance = web3.utils.toWei('.05', 'ether');
    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, { from: user2, value: balance, gasPrice: 0 });
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value =
        Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});


it('can add the star name and star symbol properly', async () => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();

    //token name
    let tokenName = await instance.name();
    //symbol
    let symbol = await instance.symbol();

    assert.equal(tokenName, "Star Notary Token");
    assert.equal(symbol, "SNT");
});

it('lets 2 users exchange stars', async () => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let star1Id = 6;
    let star2Id = 7;

    //create two stars
    await instance.createStar('star 1 ', star1Id, { from: user1 });
    await instance.createStar('star 2 ', star2Id, { from: user2 });

    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(star1Id, star2Id, { from: user1 });

    // 3. Verify that the owners changed

    assert.equal(await instance.ownerOf.call(star1Id), user2);
    assert.equal(await instance.ownerOf.call(star2Id), user1);
});

it('lets a user transfer a star', async () => {
    // 1. create a Star with different tokenId

    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let star1Id = 8;

    //create star
    await instance.createStar('star 1 ', star1Id, { from: user1 });

    // use the transferStar function implemented in the Smart Contract
    await instance.transferStar(user2, star1Id, { from: user1 });

    //Verify the star owner changed.
    assert.equal(await instance.ownerOf.call(star1Id), user2);
});

it('lookUptokenIdToStarInfo should return star name if star id exists', async () => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let star1Id = 9;
    let starName = 'star-1';

    await instance.createStar(starName, star1Id, { from: user1 });

    let returnedStarName = await instance.lookUptokenIdToStarInfo(star1Id, { from: user1, });

    assert.equal(returnedStarName, starName);
});

it('lookUptokenIdToStarInfo should return empty string if star id does not exist', async () => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let star1Id = 10;
    let starName = 'star-1';

    await instance.createStar(starName, star1Id, { from: user1 });

    let returnedStarName = await instance.lookUptokenIdToStarInfo(100, {
        from: user1,
    });

    assert.isEmpty(returnedStarName);
});
