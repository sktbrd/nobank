/*
    Create market maker account
    register

    go online

 */
require("dotenv").config()
require("dotenv").config({path:'../.env'})
const Bankless = require("@pioneer-platform/pioneer-client").default;
// let signer = require("eth-token-wallet")
// let signer = require("eth_mnemonic_signer")

const { randomBytes, Wallet, Mnemonic } = require('ethers');
const ethers = require('ethers');

const log = require('@pioneer-platform/loggerdog')();
let Events = require("@pioneer-platform/pioneer-events")
// import { TokenWallet } from 'eth-token-wallet'
let seed = process.env['WALLET_DRIVER']
console.log("seed: ",seed)
if(!seed) throw Error("invalid ENV:  WALLET_MARKET_MAKER required")
let GLOBAL_SESSION = "unset"
// let spec = "https://cash2btc.com/spec/swagger.json"
let spec = "http://127.0.0.1:9001/spec/swagger.json"
// let PIONEER_WS = 'wss://cash2btc.com'
let PIONEER_WS = 'ws://127.0.0.1:9001'
let QUERY_KEY = 'tester-driver-mobileasdas'
// Define an async function to run the test
const runTest = async () => {
    let tag = " | test | "
    try {

        // let index = 1
        // let path = "m/44'/60'/"+index+"'/0/0"
        // let address = await signer.getAddress(seed,path)
        // address = address.toLowerCase()
        // console.log("address: ",address)

        const wallet = Wallet.fromPhrase(seed);
        console.log("Wallet address: ", wallet.address);
        let address = wallet.address.toLowerCase()

        //get dollars local
        let config = {
            queryKey:QUERY_KEY,
            username:"driver:"+address,
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

        //get driver

        //if no driver register

        let driver = {
            pubkey:address,
            driverId:"driver:"+address,
            location:[ 4.5981, -74.0758 ]
        }

        //get driver
        let driverInfo = await bankless.DriverPrivate({driverId:driver.driverId})
        log.info(tag,"driverInfo: ",driverInfo)
        if(driverInfo.data){
            console.log("driver: ",driver)
            let resultSubmit = await bankless.SubmitDriver(driver)
            log.info(tag,"resultSubmit: ",resultSubmit)
        }else{
            let resultSubmit = await bankless.UpdateDriver(driver)
            log.info(tag,"resultSubmit: ",resultSubmit)
        }



        //sub ALL events
        let clientEvents = new Events.Events(config)
        clientEvents.init()
        clientEvents.setUsername(config.username)

        //sub to events
        clientEvents.events.on('message', async (event) => {
            try{
                console.log("event: ",event)
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
        //on match

    } catch (e) {
        console.error(e);
    }
};

runTest();
