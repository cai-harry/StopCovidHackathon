import json
from web3 import Web3, HTTPProvider


class ContractClient:
    """
    Wrapper over the Smart Contract ABI, to gracefully bridge Python data to Solidity.

    The API of this class should match that of the smart contract.
    """

    CONTRACT_JSON_PATH = "build/contracts/Contributions.json"
    IPFS_HASH_PREFIX = bytes.fromhex('1220')

    def __init__(self,
                 web3_provider=HTTPProvider("http://127.0.0.1:7545"),
                 account_idx=0
                 ):
        self._web3 = Web3(web3_provider)
        self._contract = self._deploy_contract()
        self._address = self._web3.eth.accounts[account_idx]
        self._web3.eth.defaultAccount = self._address

    def owner(self):
        return self._contract.functions.owner().call()

    def tokens(self, address):
        return self._contract.functions.tokens(address).call()

    def totalTokens(self, address):
        return self._contract.functions.totalTokens().call()

    def balance(self, address):
        return self._contract.functions.balance(address).call()

    def transfer(self, amount):
        self._contract.functions.receive().transact({'value': amount})

    def giveTokens(self, recipient, num_tokens):
        self._contract.functions.giveTokens(
            recipient, num_tokens).transact()

    def _deploy_contract(self):
        with open(self.CONTRACT_JSON_PATH) as crt_json_file:
            crt_json = json.load(crt_json_file)
            abi = crt_json['abi']
            bytecode = crt_json['bytecode']
        instance = self._web3.eth.contract(
            abi=abi,
            bytecode=bytecode
        )
        return instance


contract = ContractClient()
