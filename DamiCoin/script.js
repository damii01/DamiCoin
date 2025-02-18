let web3 = new Web3("http://127.0.0.1:8545");
const contractAddress = "0x8D621A957530c1A844A1e9Ef0ced72856cFF24E6"; 

const contractABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "initialSupply",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Burn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Mint",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

let contract = new web3.eth.Contract(contractABI, contractAddress);

console.log("Contract Instance:", contract);
console.log("Available Methods:", contract.methods);

async function loadAccounts() {
    let accounts = await web3.eth.getAccounts();
	currentAccount = accounts[0];  
    let accountSelect = document.getElementById("account");
    let toAddressSelect = document.getElementById("toAddress");

	let tokenName = document.getElementById("token-name");
    
    accountSelect.innerHTML = "";
    toAddressSelect.innerHTML = "";
    
    accounts.forEach(acc => {
        let option = new Option(acc, acc);
        accountSelect.add(option.cloneNode(true));
        toAddressSelect.add(option.cloneNode(true));
    });


	if (toAddressSelect.value === accountSelect.value) {
        toAddressSelect.value = ""; 
    }

	let options = toAddressSelect.querySelectorAll("option");

	options.forEach(option => {
        if (option.value === accountSelect.value) {
            option.setAttribute("disabled", "true"); 
        } else {
            option.removeAttribute("disabled"); 
        }
    });

	tokenName.innerText = await contract.methods.name().call()

    updateBalance();
	updateBalanceReceiver();
	updateTotalBalance();
}

async function updateBalance() {
    let account = document.getElementById("account").value;
    let balance = await contract.methods.balanceOf(account).call();
    document.getElementById("balance").innerText = (balance) + " $" + (await contract.methods.symbol().call());
}

async function updateBalanceReceiver() {
    let receiver = document.getElementById("toAddress").value;
	if(receiver != "")
	{
		let balance = await contract.methods.balanceOf(receiver).call();
		document.getElementById("balance-receiver").innerText = (balance) + " $" + (await contract.methods.symbol().call());
	}
	else{
		document.getElementById("balance-receiver").innerText = "0" + " $" + (await contract.methods.symbol().call());
	}
}

async function updateTotalBalance(){
	document.getElementById("total-balance").innerText = 
    (await contract.methods.totalSupply().call()) + " $" + (await contract.methods.symbol().call());
}

async function sendTokens() {
    let from = document.getElementById("account").value;
    let to = document.getElementById("toAddress").value;
    let amount = document.getElementById("amount").value;
    await contract.methods.transfer(to, amount).send({ from });
    updateBalance();
	updateBalanceReceiver();
}

async function mintTokens() {
    let amount = document.getElementById("amount-burn-mint").value;

    let owner = await contract.methods.owner().call();

    if (currentAccount.toLowerCase() === owner.toLowerCase()) {
        await contract.methods.mint(amount).send({ from: currentAccount });
        updateBalance();
		updateTotalBalance();
    } else {
        alert("You are not the owner! Only the contract owner can mint tokens.");
    }
}

async function burnTokens() {
    let amount = document.getElementById("amount-burn-mint").value;

    let owner = await contract.methods.owner().call();

    if (currentAccount.toLowerCase() === owner.toLowerCase()) {
        await contract.methods.burn(amount).send({ from: currentAccount });
        updateBalance();
		updateTotalBalance();
    } else {
        alert("You are not the owner! Only the contract owner can burn tokens.");
    }
}

function changeAmount(value) {
    let amountInput = document.getElementById("amount");
    amountInput.value = Math.max(1, parseInt(amountInput.value) + value);
}

function changeAmountBM(value) {
    let amountInput = document.getElementById("amount-burn-mint");
    amountInput.value = Math.max(1, parseInt(amountInput.value) + value);
}


document.getElementById("account").addEventListener("change", function() {
    let accountSelect = document.getElementById("account");
    let toAddressSelect = document.getElementById("toAddress");
    
    let selectedAccount = accountSelect.value;
    let options = toAddressSelect.querySelectorAll("option");

    options.forEach(option => {
        if (option.value === selectedAccount) {
            option.setAttribute("disabled", "true"); 
        } else {
            option.removeAttribute("disabled"); 
        }
    });

	if (toAddressSelect.value === selectedAccount) {
        toAddressSelect.value = ""; 
    }
});

document.getElementById("toAddress").addEventListener("change", updateBalanceReceiver);

window.onload = loadAccounts;
