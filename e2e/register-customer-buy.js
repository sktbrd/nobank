/*
    Create market maker account
    register

    go online

 */
require("dotenv").config()
require("dotenv").config({path:'../.env'})
const Bankless = require("@pioneer-platform/pioneer-client").default;

const { randomBytes, Wallet, Mnemonic } = require('ethers');
const ethers = require('ethers');
const axios = require('axios');

// let spec = "https://cash2btc.com/spec/swagger.json"

let QUERY_KEY = 'tester-customer-mobile-2-e2e'
const apiClient = axios.create({
    // baseURL: spec, // Your base URL
    headers: {
        'Content-Type': 'application/json',
        'Authorization':  QUERY_KEY// Replace 'YOUR_AUTH_TOKEN' with your actual token
    }
});


// let signer = require("eth-token-wallet")
// let signer = require("eth_mnemonic_signer")
const log = require('@pioneer-platform/loggerdog')();
let Events = require("@pioneer-platform/pioneer-events")

// import { TokenWallet } from 'eth-token-wallet'
let seed = process.env['WALLET_CUSTOMER']
console.log("seed: ",seed)
if(!seed) throw Error("invalid ENV:  WALLET_CUSTOMER required")
let GLOBAL_SESSION = "unset"

// let spec = "http://127.0.0.1:4000/spec/swagger.json"
let spec = "http://127.0.0.1:9001/spec/swagger.json"
let PIONEER_WS = 'ws://127.0.0.1:9001'

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
            queryKey:QUERY_KEY,
            username:"customer:"+address,
            wss:PIONEER_WS
        }
        //build register payload


        // Initialize the Pioneer instance
        let bankless = new Bankless(spec, config);
        bankless = await bankless.init();

        //get all functions
        // console.log("bankless: ",bankless)
        let result = await bankless.Health();
        console.log("result: ",result.data)

        //sub ALL events
        let clientEvents = new Events.Events(config)
        clientEvents.init()
        clientEvents.setUsername(config.username)

        //sub to events
        clientEvents.events.on('message', async (event) => {
            let tag = TAG + " | events | "
            try{
                log.info(tag,"message: ",message)
                //is online

                //if match
                if(event.payload && event.payload.type == "match"){
                    //handle match
                    log.info(tag,"event: ",event)
                }

                //

            }catch(e){
                log.error(e)
            }
        })

        //get all events
        let body = {
            user:address,
            event:"order",
            type:"sell",
            pair:"USDC_USD",
            amount:100,
            amountOutMin:90,
        };
        console.log("body: ",body)
        // const resultSubmit = await apiClient.post('https://cash2btc.com/api/v1/bankless/order/submit', body);
        const resultSubmit = await apiClient.post('http://127.0.0.1:9001/api/v1/bankless/order/submit', body);
        console.log("resultSubmit: ", resultSubmit);


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
