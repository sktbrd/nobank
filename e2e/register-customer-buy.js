/*
    Create market maker account
    register

    go online

 */
const TAG = " | Customer e2e | "
require("dotenv").config()
require("dotenv").config({ path: '../.env' })
const Bankless = require("@pioneer-platform/pioneer-client").default;

const { randomBytes, Mnemonic, Wallet, JsonRpcProvider, formatUnits, toBeHex, parseUnits, Interface } = require('ethers');
const ethers = require('ethers');

const axios = require('axios');

// let spec = "https://cash2btc.com/spec/swagger.json"

let QUERY_KEY = 'tester-customer-mobile-2-e2e'
const apiClient = axios.create({
    // baseURL: spec, // Your base URL
    headers: {
        'Content-Type': 'application/json',
        'Authorization': QUERY_KEY// Replace 'YOUR_AUTH_TOKEN' with your actual token
    }
});


// let signer = require("eth-token-wallet")
// let signer = require("eth_mnemonic_signer")
const log = require('@pioneer-platform/loggerdog')();
let Events = require("@pioneer-platform/pioneer-events");
const { default: AsyncStorage } = require("@react-native-async-storage/async-storage");

// import { TokenWallet } from 'eth-token-wallet'
let seed = AsyncStorage.getItem('mnemonic')
console.log("seed: ", seed)
if (!seed) throw Error("invalid ENV:  WALLET_CUSTOMER required")
let GLOBAL_SESSION = "unset"

// let spec = "http://127.0.0.1:4000/spec/swagger.json"
let spec = "http://127.0.0.1:9001/spec/swagger.json"
let PIONEER_WS = 'ws://127.0.0.1:9001'

let USDT_CONTRACT_POLYGON = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
const service = "https://polygon.rpc.blxrbdn.com"
const provider = new JsonRpcProvider(service);

let send_to_address = async function (address, amount, wallet) {
    let tag = " | send_to_address | ";
    try {
        console.log(tag, "address:", address);
        console.log(tag, "amount:", amount);

        // Convert amount to the correct unit considering the token's decimals (assuming 6 for USDT in this example)
        let value = parseUnits(amount.toString(), 6);
        console.log(tag, "value:", value.toString());

        // The address sending the tokens is derived from the wallet
        let addressFrom = wallet.address;
        console.log(tag, "addressFrom:", addressFrom);

        // Get nonce for the transaction
        console.log(tag, "provider:", provider);
        let nonce = await provider.getTransactionCount(addressFrom);
        console.log(tag, "nonce:", nonce);

        // Correct handling of BigInt for gasPrice
        let feeData = await provider.getFeeData();
        console.log(tag, "feeData:", feeData);

        // Assuming you're using EIP-1559, which uses maxFeePerGas and maxPriorityFeePerGas
        let maxFeePerGas = feeData.maxFeePerGas;
        let maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;

        // If you need to use gasPrice for networks not supporting EIP-1559, convert BigInt to string
        let gasPrice = feeData.gasPrice ? feeData.gasPrice.toString() : undefined;

        const tokenAbiFragment = [
            "function transfer(address to, uint256 amount) returns (bool)"
        ];

        // Creating an Interface instance with the ERC-20 ABI fragment
        const tokenInterface = new Interface(tokenAbiFragment);


        // Encoding the function data for the `transfer` function call
        const data = tokenInterface.encodeFunctionData("transfer", [address, value.toString()]); // Ensure value is a string if it's a BigInt

        // Create transaction object, specifying gasPrice or EIP-1559 fields as needed
        let tx = {
            from: addressFrom,
            to: USDT_CONTRACT_POLYGON,
            value: 0, // For token transfer, the value is 0
            nonce: nonce,
            // Use either gasPrice or maxFeePerGas and maxPriorityFeePerGas depending on your network
            // gasPrice: gasPrice, // For non-EIP-1559, ensure this is a string if originally a BigInt
            maxFeePerGas: maxFeePerGas?.toString(), // Convert BigInt to string for EIP-1559 transactions
            maxPriorityFeePerGas: maxPriorityFeePerGas?.toString(), // Convert BigInt to string for EIP-1559 transactions
            data: data,
        };

        // Estimate gas limit for the transaction, ensuring to convert BigInt to Number if necessary
        tx.gasLimit = (await provider.estimateGas(tx)); // This might need adjustment based on your logic and BigInt handling


        // Sign and send the transaction
        // let signedTx = await wallet.signTransaction(tx);
        let txResponse = await wallet.sendTransaction(tx);
        console.log("Transaction sent! Hash:", txResponse.hash);

        // Wait for the transaction to be confirmed
        let receipt = await txResponse.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);

        return receipt; // Or any other information you want to return
    } catch (e) {
        console.error(tag, "Error:", e);
        throw e; // Rethrow the error after logging
    }
};

// Define an async function to run the test
const runTest = async () => {
    let tag = " | test | "
    try {

        const wallet = Wallet.fromPhrase(seed);
        console.log("Wallet address: ", wallet.address);
        let address = wallet.address.toLowerCase()

        // let index = 1
        // let path = "m/44'/60'/"+index+"'/0/0"
        // let address = await signer.getAddress(seed,path)
        // address = address.toLowerCase()
        // console.log("address: ",address)

        //get dollars local
        let config = {
            queryKey: QUERY_KEY,
            username: "customer:" + address,
            wss: PIONEER_WS
        }
        //build register payload


        // Initialize the Pioneer instance
        let bankless = new Bankless(spec, config);
        bankless = await bankless.init();

        //get all functions
        // console.log("bankless: ",bankless)
        let result = await bankless.Health();
        console.log("result: ", result.data)

        //sub ALL events
        let clientEvents = new Events.Events(config)
        clientEvents.init()
        clientEvents.setUsername(config.username)

        //sub to events
        clientEvents.events.on('message', async (event) => {
            let tag = TAG + " | events | "
            try {
                event = JSON.parse(event)
                log.info(tag, "event: ", event)

                //is online

                //if match
                if (event && event.type == "match") {
                    //handle match
                    log.info(tag, "event: ", event)
                    log.info(tag, "terminalWallet: ", event.terminalWallet)

                    //on match send crypto market maker
                    let txid = await send_to_address(event.terminalWallet, 1, wallet)
                    console.log("txid: ", txid)
                    //post to server update orderId with txid

                }
                //state 0 - seller sends crypto to market maker

                //stage 1 - driver arrives at market maker

                //stage 2 - driver leaves market maker with cash

                //stage 3 - driver give cash to seller



            } catch (e) {
                log.error(e)
            }
        })

        //get all events
        let body = {
            customerId: "customer:" + address,
            user: address,
            event: "order",
            type: "sell",
            pair: "USDC_USD",
            amount: 100,
            amountOutMin: 90,
        };
        console.log("body: ", body)
        // const resultSubmit = await apiClient.post('https://cash2btc.com/api/v1/bankless/order/submit', body);
        const resultSubmit = await apiClient.post('http://127.0.0.1:9001/api/v1/bankless/order/submit', body);
        console.log("resultSubmit: ", resultSubmit.data);


        //push sell order
        // // Intercept and log requests using Axios interceptors
        // axios.interceptors.request.use(request => {
        //     console.log('Starting Request', JSON.stringify(request, null, 2))
        //     return request
        // })
        //
        // let sellOrder = {
        //     user:address,
        //     event:"order",
        //     type:"sell",
        //     pair:"USDC_USD",
        //     amount:100,
        //     amountOutMin:90,
        // }
        // console.log("sellOrder: ",sellOrder)
        // console.log("bankless: ",bankless)
        // console.log("bankless: ",bankless.SubmitOrder)
        // console.log("bankless: ",JSON.stringify(bankless))
        // let resultSubmit = await bankless.SubmitOrder(sellOrder)
        // log.info(tag,"resultSubmit: ",resultSubmit)


    } catch (e) {
        console.error(e);
    }
};

runTest();
