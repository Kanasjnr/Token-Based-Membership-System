// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

library PropsLibrary {
    enum PropsStatus {None, Created, pending, Accepted}


     struct Proposal {
        string name;
        string description;
        uint16 voteCount;
        address[] voters;
        uint16 quorum;
        PropsStatus status;

    }
}