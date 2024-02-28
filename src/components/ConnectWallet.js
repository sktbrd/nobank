

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useWallet } from '../context/WalletContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/styles';
import { v4 as uuidv4 } from 'uuid';

import { ethers, Mnemonic, Wallet, JsonRpcProvider } from 'ethers';

// import * as Events from "@pioneer-platform/pioneer-events";
import * as Events from "@pioneer-platform/pioneer-events";

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

        let walletWithProvider = wallet.connect(provider);

        // Sign and send the transaction
        // let signedTx = await wallet.signTransaction(tx);
        let txResponse = await walletWithProvider.sendTransaction(tx);
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

const ConnectWallet = () => {
    const { connectWallet, isWalletConnected, address } = useWallet();

    const formatWalletAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`;
    }

    const onStart = async () => {
        try {
            let QUERY_KEY = await AsyncStorage.getItem('QUERY_KEY');
            if(!QUERY_KEY){
                QUERY_KEY = uuidv4()
                AsyncStorage.setItem('QUERY_KEY');
            }
            let PIONEER_WS = 'wss://cash2btc.com'
            let address = await AsyncStorage.getItem('address');
            let config = {
                queryKey: QUERY_KEY,
                username: "customer:" + address,
                wss: PIONEER_WS
            }
            // console.log(Events)
            console.log("onStart")
            let clientEvents = new Events.Events(config)
            clientEvents.init()
            clientEvents.setUsername(config.username)
            console.log("config: ",config)
            // console.log("clientEvents: ", clientEvents)
            //sub to events
            console.log("starting socket")
            clientEvents.events.on('message', async (event) => {
                console.log("event: ", event)

                // event = JSON.parse(event)

                //is online

                //if match
                if (event && event.type == "match") {
                    //handle match

                    //on match send crypto market maker
                    // let txid = await send_to_address(event.terminalWallet, 1, wallet)
                    // console.log("txid: ", txid)
                    //post to server update orderId with txid

                    // let txid = await send_to_address(event.terminalWallet, 1, wallet)
                    // console.log("txid: ",txid)
                    //
                    // let body = {
                    //     type:'funding',
                    //     orderId:event.id,
                    //     funded:true,
                    //     txid
                    // }
                }
                //state 0 - seller sends crypto to market maker

                //stage 1 - driver arrives at market maker

                //stage 2 - driver leaves market maker with cash

                //stage 3 - driver give cash to seller
            }
            )
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        onStart();
    }, []);

    return (
        <View style={styles.container}>

            <View style={styles.centeredView}>
                <Image source={require('../../assets/DNA.jpg')} style={styles.logo} />
                <Text style={styles.text}>Welcome: {formatWalletAddress(address)}</Text>
                <TouchableOpacity style={styles.button} onPress={connectWallet}>
                    <Text style={styles.buttonText}>Enter App</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={async () => {
                    const keys = await AsyncStorage.getItem('mnemonic');
                    console.log(keys);
                }}>
                    <Text style={styles.buttonText}>Log Keys</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ConnectWallet;
