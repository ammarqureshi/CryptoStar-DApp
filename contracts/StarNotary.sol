pragma solidity >=0.4.24;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721, ERC721Full {
    constructor(string memory _name, string memory _symbol)
        public
        ERC721Full(_name, _symbol)
    {}

    // Star data
    struct Star {
        string name;
    }

    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;

    // check if the requestor owns any of the two stars
    modifier ownsEitherStar(uint256 _tokenId1, uint256 _tokenId2) {
        require(
            ownerOf(_tokenId1) == msg.sender ||
                ownerOf(_tokenId2) == msg.sender,
            "You dont own any of the two stars"
        );
        _;
    }

    modifier ownerOfStar(uint256 _tokenId) {
        require(ownerOf(_tokenId) == msg.sender, "You dont own the star");
        _;
    }

    modifier haseEnoughEtherToBuyStar(uint256 _tokenId) {
        uint256 starCost = starsForSale[_tokenId];
        require(msg.value > starCost, "You need to have enough Ether");
        _;
    }

    modifier refundAnyAccessEther(uint256 _tokenId) {
        _;
        //refund any excess
        uint256 starCost = starsForSale[_tokenId];

        if (msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    modifier isStarForSale(uint256 _tokenId) {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        _;
    }

    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public {
        // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(
            ownerOf(_tokenId) == msg.sender,
            "You can't sale the Star you don't owned"
        );
        starsForSale[_tokenId] = _price;
    }

    // Function that allows you to convert an address into a payable address
    function _make_payable(address x) internal pure returns (address payable) {
        return address(uint160(x));
    }

    function buyStar(uint256 _tokenId)
        public
        payable
        isStarForSale(_tokenId)
        haseEnoughEtherToBuyStar(_tokenId)
        refundAnyAccessEther(_tokenId)
    {
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        _transferFrom(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        address payable ownerAddressPayable = _make_payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
    }

    function lookUptokenIdToStarInfo(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        return tokenIdToStarInfo[_tokenId].name;
    }

    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2)
        public
        ownsEitherStar(_tokenId1, _tokenId2)
    {
        //at this point we know the caller has one of the two stars
        address token1AdrOwner = ownerOf(_tokenId1);
        address token2AdrOwner = ownerOf(_tokenId2);

        //exchange the stars between the two star owners
        _transferFrom(token1AdrOwner, token2AdrOwner, _tokenId1);
        _transferFrom(token2AdrOwner, token1AdrOwner, _tokenId2);
    }

    function transferStar(address _to1, uint256 _tokenId)
        public
        ownerOfStar(_tokenId)
    {
        //transfer the star to the address provided
        _transferFrom(msg.sender, _to1, _tokenId);
    }
}
