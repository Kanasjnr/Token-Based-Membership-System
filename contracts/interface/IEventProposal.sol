// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;
import {PropsLibrary} from "./../library/PropsLibrary.sol";



interface IEventProposal {

        function createProposal(string memory _name, string memory _desc, uint16 _quorum) external ;

        function voteOnProposal(uint8 _index, bool _votingPower, address _by) external ;

        function getAllProposals() external view returns (PropsLibrary.Proposal[] memory);

        function getAProposal(uint8 _index) external  view  returns (string memory name_, string memory desc_, uint16 count_, address[] memory voters_, uint16 quorum_, PropsLibrary.PropsStatus status_);

    
}