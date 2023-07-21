// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "hardhat/console.sol";

error ZeroAddress();
error CannotInvite();
error AlreadyInvited();

contract Invitations is Initializable, AccessControlUpgradeable {
    bytes32 public constant INVITER_ROLE = keccak256("INVITER_ROLE");

    mapping(address => address) inviters;
    mapping(address => address[]) invitees;

    event Invited(address indexed inviter, address indexed invitee);

    constructor() {
    }

    function initialize(address _inviter) public initializer {
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(INVITER_ROLE, msg.sender);
        if (_inviter != address(0)) {
            _setupRole(INVITER_ROLE, _inviter);
        }
    }

    function getInviter(address _invitee) external view returns (address) {
        return inviters[_invitee];
    }

    function getInvitees(address _inviter) external view returns (address[] memory) {
        return invitees[_inviter];
    }

    // function admInvite(address _invitee) external onlyRole(INVITER_ROLE) {
    //     address inviter = msg.sender;
    //     if (_invitee == address(0)) revert ZeroAddress();
    //     if (inviters[_invitee] != address(0)) revert AlreadyInvited();
    //     inviters[_invitee] = inviter;
    //     invitees[inviter].push(_invitee);
    //     emit Invited(inviter, _invitee);
    // }

    function canInvite(address _inviter, address _invitee) public view returns (bool) {
        if (_inviter == address(0)) return false;
        if (_inviter == _invitee) return false;
        // any account can invite others
        // if (inviters[_inviter] == address(0)) return false;
        // an address cannot be invited twice
        if (inviters[_invitee] != address(0)) return false;

        return true;
    }

    function createInvitation(address _inviter, address _invitee) external onlyRole(INVITER_ROLE) {
        if (_invitee == address(0)) revert ZeroAddress();
        if (!canInvite(_inviter, _invitee)) revert CannotInvite();
        inviters[_invitee] = _inviter;
        invitees[msg.sender].push(_invitee);
        emit Invited(_inviter, _invitee);
    }

    function invite(address _invitee) external {
        address inviter = msg.sender;
        if (_invitee == address(0)) revert ZeroAddress();
        if (!canInvite(inviter, _invitee)) revert CannotInvite();
        inviters[_invitee] = inviter;
        invitees[msg.sender].push(_invitee);
        emit Invited(inviter, _invitee);
    }
}
