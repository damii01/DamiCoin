// SPDX-License-Identifier: GPL-3.0
pragma solidity  >=0.7.0 <=0.8.0;

contract DamiCoin {
    string public name = "DamiCoin";   
    string public symbol = "DCO";        
                
    uint256 public totalSupply;     
    
    address public owner;

    mapping(address => uint256) private balances;
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Samo vlasnik moze izvrsiti ovu funkciju");
        _;
    }

    constructor(uint256 initialSupply) {
        owner = msg.sender;
        totalSupply = initialSupply;
        balances[owner] = initialSupply;
        emit Transfer(address(0), owner, initialSupply);
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(recipient != address(0), "Nevaljana adresa");
        require(balances[msg.sender] >= amount, "Nedovoljno tokena za transfer");

        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function mint(uint256 amount) public onlyOwner returns (bool) {
        totalSupply += amount;
        balances[owner] += amount;
        emit Mint(owner, amount);
        return true;
    }

    function burn(uint256 amount) public onlyOwner returns (bool) {
        require(balances[owner] >= amount, "Nedovoljno tokena za burn");
        totalSupply -= amount;
        balances[owner] -= amount;
        emit Burn(owner, amount);
        return true;
    }
}
