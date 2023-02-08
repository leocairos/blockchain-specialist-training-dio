const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')

const argNet = process.argv[2]?.toLowerCase()
let networkName
let network

//Set network by arg. Default: testnet
//bitcoin - mainnet
//testnet - tesnet
switch (argNet) {
    case 'mainnet':
        network = bitcoin.networks.mainnet
        networkName = 'mainnet'
        break;
    default:
        network = bitcoin.networks.testnet
        networkName = 'testnet'
}

//derivation of HD wallets
const path = `m/49'/1'/0'/0`

//creating the mnemonic for the seed (passwords)
let mnemonic = bip39.generateMnemonic()
const seed = bip39.mnemonicToSeedSync(mnemonic)

//creating the HD portfolio root
let root = bip32.fromSeed(seed, network)

//creating an account - pair private-public keys
let account = root.derivePath(path)
let node = account.derive(0).derive(0)

let btcAddress = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: network,
}).address

console.log(`Wallet generated [${networkName}]`)
console.log("Address: ", btcAddress)
console.log("Private key:", node.toWIF())
console.log("Seed:", mnemonic)