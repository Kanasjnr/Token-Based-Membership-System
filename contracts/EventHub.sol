// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import {IERC20} from "./interface/IERC20.sol";
import {IEventProposal} from "./interface/IEventProposal.sol";
import {IEVHTokenPurchase} from "./interface/IEVHTokenPurchase.sol";
import {PropsLibrary} from "./library/PropsLibrary.sol";

contract EventHub {

    address public owner;
    IERC20 public eventHubToken;
    IEventProposal public eventProposal;
    IEVHTokenPurchase public eVHTokenPurchase;
    uint256 private constant HIGH_VOTING_POWER = 100_000 * 10**18;


    

    struct Event {
        string title;              
        string description;       
        uint256 date;               
        uint256 tokenRequirement;   
        uint256 attendeeLimit;      
        uint256 attendeeCount;      
        address[] attendees;        
        bool isActive;   
    }

    Event[] public allEvents;

    event EventCreated(string indexed title, uint256 date);
    event EventJoined(address indexed user, uint256 eventIndex);
    event TokensPurchased(address indexed buyer, uint256 amount);
    constructor(IERC20 _eventHubToken, IEventProposal _eventProposal, IEVHTokenPurchase _eVHTokenPurchase) {
        owner = msg.sender;
        eventHubToken = _eventHubToken;
        eventProposal = _eventProposal;
        eVHTokenPurchase = _eVHTokenPurchase;
    }

    modifier onlyOwner() {
        require(msg.sender != address(0), "Zero not allowed");
        require(msg.sender == owner, "Only owner can access");
        _;
    }

    function createEvent(
        string memory _title, 
        string memory _description, 
        uint256 _date, 
        uint256 _tokenRequirement, 
        uint256 _attendeeLimit
    ) external onlyOwner {

        Event memory newEvent; 
            newEvent.title  =  _title;
            newEvent.description  =   _description;
            newEvent.date  =   block.timestamp + _date;
            newEvent.tokenRequirement  =   _tokenRequirement;
            newEvent.attendeeLimit  =   _attendeeLimit;
            newEvent.isActive  =   true;
    

        allEvents.push(newEvent);
        emit EventCreated(newEvent.title, newEvent.date);
    }

    function purchaseEVHToken(uint256 _amount) external {
        require(msg.sender != address(0), "Invalid address");
        require(_amount > 0, "Cannot swap zero amount for EVH token");

        eVHTokenPurchase.swapUsdtToEVH(msg.sender, _amount);
        
        require(eventHubToken.balanceOf(msg.sender) > 0, "Purchase failed");

        emit TokensPurchased(msg.sender, _amount);
    }

    function joinEvent(uint8 _index) external {
        require(_index < allEvents.length, "Invalid event index");
        Event storage eventInstance = allEvents[_index];
        
        require(eventInstance.isActive, "Event is not active");
        require(eventInstance.date > block.timestamp, "Event already occurred");
        require(eventInstance.attendeeCount < eventInstance.attendeeLimit, "Event is full");
        require(eventHubToken.balanceOf(msg.sender) >= eventInstance.tokenRequirement, "Insufficient token balance");

        eventInstance.attendees.push(msg.sender);
        eventInstance.attendeeCount++;
        
        emit EventJoined(msg.sender, _index);
    }

    function createEventHubProposal(
        string memory _name, 
        string memory _desc, 
        uint16 _quorum
    ) external {
        require(msg.sender != address(0), "Invalid address");
        eventProposal.createProposal(_name, _desc, _quorum);
    }


    function voteOnEventProposal(uint8 _index) external {
        require(msg.sender != address(0), "Invalid address");
        require( _index > eventProposal.getAllProposals().length, "Such proposal does not exist");
        require(eventHubToken.balanceOf(msg.sender) > 0, "You must hold tokent to vote");
        if(eventHubToken.balanceOf(msg.sender) >  HIGH_VOTING_POWER) {
            eventProposal.voteOnProposal(_index, true, msg.sender);
        }else{
            eventProposal.voteOnProposal(_index, false, msg.sender);
        }
        

    }

    function getAnEventProposal(uint8 _index) external   view returns (string memory, string memory, uint16, address[] memory voters_, uint16, PropsLibrary.PropsStatus status_) {
        
          return  eventProposal.getAProposal(_index);

    }


    function getAllEventProposals() external view onlyOwner returns(PropsLibrary.Proposal[] memory) {
       return  eventProposal.getAllProposals();
    }


    function cancelEvent(uint8 _index) external  onlyOwner {
        require(msg.sender != address(0));
        require(_index < allEvents.length, "Out of bound");
        allEvents[_index].isActive = false;
    }

    function getAnEvent(uint8 _index) external  view  returns(Event memory) {
        require(msg.sender != address(0));
        require(_index < allEvents.length, "Out of bound");
        return allEvents[_index];
    }

    function getAllEvents() external  view returns(Event[] memory) {
        return  allEvents;
    }

}
