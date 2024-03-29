/*
    Create market maker account
    register

    go online

 */
require("dotenv").config()
require("dotenv").config({path:'../.env'})
const Bankless = require("@pioneer-platform/pioneer-client").default;
// let signer = require("eth-token-wallet")
let signer = require("eth_mnemonic_signer")
const log = require('@pioneer-platform/loggerdog')();
let Events = require("@pioneer-platform/pioneer-events")
// import { TokenWallet } from 'eth-token-wallet'
let seed = process.env['WALLET_DRIVER']
console.log("seed: ",seed)
if(!seed) throw Error("invalid ENV:  WALLET_MARKET_MAKER required")
let GLOBAL_SESSION = "unset"
// let spec = "http://127.0.0.1:4000/spec/swagger.json"
let spec = "http://127.0.0.1:9001/spec/swagger.json"
let PIONEER_WS = 'ws://127.0.0.1:9001'

// Define an async function to run the test
const runTest = async () => {
    let tag = " | test | "
    try {

        let index = 1
        let path = "m/44'/60'/"+index+"'/0/0"
        let address = await signer.getAddress(seed,path)
        address = address.toLowerCase()
        console.log("address: ",address)

        let TERMINAL_NAME = "local-app-e2e-mm"
        //get dollars local
        let config = {
            queryKey:QUERY_KEY,
            username:TERMINAL_NAME,
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

        let driver = {

        }

        console.log("terminal: ",terminal)
        let resultSubmit = await bankless.SubmitDriver(driver)
        log.info(tag,"resultSubmit: ",resultSubmit)

        //sub ALL events
        let clientEvents = new Events.Events(config)
        clientEvents.init()
        clientEvents.setUsername(config.username)

        //sub to events
        clientEvents.events.on('message', async (event) => {
            let tag = TAG + " | events | "
            try{

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
