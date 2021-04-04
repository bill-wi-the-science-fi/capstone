// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.8.0;

/**
* @title Storage
* @dev Store & retrieve value in a variable
* BASE UNITS on ETHEREUM BC: wei
* onlyOwner safety check - if we fund the recipient address setting, then we can set ourselves as the only ppl to modify the smart contract (securing our smart contract via admin access)
* Methods/modifiers needed --------------------------------------------------------------------------------
* set recipient address
* check if recipient address is default or has been set
* platform pays gas fee WHEN RECIPIENT SETS ADDRESS
*
* v14 --------------------------------------------------------------------------------------------
* ToDo --------------------------------------------------------------------------------------------
* check for sufficient balance on SC before deactivating an award (before distributing funds)

*/
contract Nominate {
   address public owner;
   uint internal donationLimitValue;
   uint8 awardDurationDays;
   address relayerAddress;

   constructor() {
      owner = msg.sender;
      donationLimitValue = 5 ether;
      awardDurationDays = 14;
      relayerAddress = 0x7714E9182799cE2f92B26E70c9CD55cD1b3c1d38;
   }

   //**struct are like models in dbs, we can make instances of the Award Struct each time a person is nominated
   struct Award {
      address payable recipientAddress;
      uint donationLimit;
      uint donationTotal;
      address nominatorAddress;
      uint expires;
      bool active;
   }

   //**all awards will be our data structure. it is an object with they key as the award id, and the information of the award struct as the pair in key-pair
  mapping(uint => Award) public allAwards;
  function setRelayerAddress (address _newRelayerAddress) public onlyOwner() {
      relayerAddress = _newRelayerAddress;
  }
  function donateFunds (uint _awardId) public payable aboveMinimum() awardExist(_awardId) {
      require(allAwards[_awardId].recipientAddress != allAwards[_awardId].nominatorAddress, 'this award can not accept any donations until recipient address has been set');
      // add donation amount to award
      allAwards[_awardId].donationTotal += msg.value;

      // log donation
      emit Emit_Funds_Donated(msg.sender, address(this), msg.value, _awardId);

      // check if award donations has reached amount limit
      checkLimit(_awardId);
  }
  //Notes--This function is invoked only if we are creating a new award (nominator makes a nomination)
  function startAwardAndDonate(uint _awardId, address payable _recipientAddress, uint _donationLimit) public payable aboveMinimum() {
      require(allAwards[_awardId].active == false && allAwards[_awardId].recipientAddress == address(0), 'this award has already been added to the smart contract');

      // createAwardStruct
      //createAwardStruct(_awardId, _nominatorAddress, _recipientAddress);
      createAwardStruct(_awardId, msg.sender, _recipientAddress, _donationLimit);

      // log donation
      emit Emit_Funds_Donated(msg.sender, address(this), msg.value, _awardId);

      // check if award donations has reached amount limit
      checkLimit(_awardId);
  }
  //Notes--This function is invoked to set the award winners address
  function setRecipient(uint _awardId, address payable _recipientAddress) public awardExist(_awardId) {
      require(msg.sender == relayerAddress, 'msg.sender is not the designated sender for setting recipient');
      //check to see if award id in the object if not reject donation….I.e. person tries to claim award after its expired
      //modifier to check if there is an award
      //set the award
      allAwards[_awardId].recipientAddress = _recipientAddress;
      //allAwards[_awardId].recipientAddress = msg.sender; // attached recipientAddress to .send()
      // allAwards[_awardId].donationTotal += msg.value; // would an excess amount be sent to pay for gas fee?
      emit Set_Recipient(_recipientAddress, _awardId);
  }
  function setRecipients(uint[] memory _awardIdList, address payable _recipientAddress) public {
      require(msg.sender == relayerAddress, 'msg.sender is not the designated sender for setting recipient');
      for (uint i = 0; i < _awardIdList.length; i++) {
          if (allAwards[_awardIdList[i]].active) {
              allAwards[_awardIdList[i]].recipientAddress = _recipientAddress;
          }
      }
  }
  //claim reward idea?-when time runs out user logs in and presses claim my award-might
  // expiration check made on app
  // check for expiration on SC before invoking expireAward?
  function expireAward(uint _awardId) public awardExist(_awardId) {
      // onlyOwner modifier?
      deactivateAward(_awardId);
  }
  // Helpper Functions -----------------------------------------------------------------------------------------------------
  function checkLimit(uint _awardId) internal {
      if (allAwards[_awardId].donationLimit <= allAwards[_awardId].donationTotal) {
          // emit goal reached
          emit Award_Goal_Reached(allAwards[_awardId].recipientAddress, address(this), allAwards[_awardId].donationTotal, _awardId);
          // end lifecycle of award
          deactivateAward(_awardId);
      }
  }
  function deactivateAward(uint _awardId) public awardExist(_awardId) {
      //donationTotal back to 0
      uint amount = allAwards[_awardId].donationTotal;
      allAwards[_awardId].donationTotal = 0;

      // execute distribution of donations (amount sent to recipient == amount donated to respective award)
      allAwards[_awardId].recipientAddress.transfer(amount);
      // emit distribution
      emit Award_Distributed(allAwards[_awardId].recipientAddress, address(this), allAwards[_awardId].donationTotal, _awardId);

      // set struct property
      allAwards[_awardId].active = false;
      // emit award deactivated
      emit Award_Deactivated(allAwards[_awardId].recipientAddress, address(this), allAwards[_awardId].donationTotal, _awardId);
  }
  function createAwardStruct(uint _awardId, address _nominatorAddress, address payable _recipientAddress, uint _donationLimit ) internal {
      Award memory newAward = Award ({
          recipientAddress: _recipientAddress,
          donationLimit: _donationLimit,
          donationTotal: msg.value,
          nominatorAddress: _nominatorAddress,
          expires: block.timestamp + awardDurationDays * 1 days,
          active: true

      });
      allAwards[_awardId] = newAward;
  }
   function balanceOfContract() external view returns(uint) {
       return address(this).balance;
   }
   receive() external payable {}
   fallback() external {
       revert('not actionable');
   }
  // Modifiers -----------------------------------------------------------------------------------------------------

  //used by expireAward as a safety check to make sure that contract is expired before paying the recipient
  modifier timeCheck (uint _awardId) {
    require(block.timestamp > allAwards[_awardId].expires, "this contract is not expired and payout will not happen");
    _;
  }
  modifier aboveMinimum () {
      require( msg.value > 0 ether, "please donate an amount greater than 0 ether");
      _;
  }
  // does award exist?
  modifier awardExist (uint _awardId) {
      require(allAwards[_awardId].active, 'award is not active');
      _;
  }
  modifier onlyOwner () {
      require( msg.sender == owner, 'only the owner may set the relayer address');
      _;
  }

  // Events Emitters -----------------------------------------------------------------------------------------------------
  // the "index" keyword lets the log be filtered by those parameters
  event Emit_Funds_Donated (
      address indexed _from,
      address indexed _contract,
      uint _value,
      uint _awardId
  );
  event Award_Goal_Reached (
      address indexed _to,
      address indexed _contract,
      uint _value,
      uint _awardId
  );
  event Award_Deactivated (
      address indexed _to,
      address indexed _contract,
      uint _value,
      uint _awardId
  );
  event Award_Distributed (
      address indexed _to,
      address indexed _contract,
      uint _value,
      uint _awardId
  );
  event Set_Recipient (
      address indexed _newRecipient,
      uint _awardId
  );
}
