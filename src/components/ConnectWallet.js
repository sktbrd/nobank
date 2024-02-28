

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useWallet } from '../context/WalletContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/styles';


import { ethers, Mnemonic, Wallet } from 'ethers';

// import * as Events from "@pioneer-platform/pioneer-events";
import * as Events from "@pioneer-platform/pioneer-events";

const ConnectWallet = () => {
    const { connectWallet, isWalletConnected, address } = useWallet();

    const formatWalletAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`;
    }

    const onStart = async () => {
        try {
            let QUERY_KEY = 'skateboardasdasdasdasda'
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
