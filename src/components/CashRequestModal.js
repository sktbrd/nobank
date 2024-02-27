import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, Alert } from 'react-native';
import { styles } from '../styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Make sure to import axios at the top of your file
const CashRequestModal = ({
    modalVisible,
    setModalVisible,
    billImages,
}) => {
    const [userSelection, setUserSelection] = useState({});
    const [optimalSet, setOptimalSet] = useState({});
    const [showOptimalSet, setShowOptimalSet] = useState(false);

    const dummyAvailableBillsLiquidity = {
        1: 10,
        5: 10,
        10: 10,
        20: 10,
        50: 10,
        100: 10,
    };

    const addCashAmount = (amount) => {
        setUserSelection((prevSelection) => ({
            ...prevSelection,
            [amount]: (prevSelection[amount] || 0) + 1
        }));
    };

    const calculateTotalAmount = () => {
        return Object.entries(userSelection).reduce((total, [amount, count]) => {
            return total + parseInt(amount) * count;
        }, 0);
    };

    const calculateOptimalBillSet = (requestedAmount) => {
        let remainingAmount = requestedAmount;
        const billSet = {};
        const billValues = Object.keys(dummyAvailableBillsLiquidity).map(Number).sort((a, b) => b - a);

        for (let bill of billValues) {
            const availableBills = dummyAvailableBillsLiquidity[bill];
            const neededBills = Math.floor(remainingAmount / bill);
            if (neededBills > 0) {
                const billsToUse = Math.min(neededBills, availableBills);
                billSet[bill] = billsToUse;
                remainingAmount -= bill * billsToUse;
            }
        }

        if (remainingAmount > 0) {
            Alert.alert("Insufficient Funds", "Unable to fulfill request with available liquidity.");
            return null;
        } else {
            return billSet;
        }
    };
    QUERY_KEY = 'tester-mm-mobile2'
    const handleConfirm = async () => {
        try {
            console.clear();
            const totalAmount = calculateTotalAmount();
            const optimalBillSet = calculateOptimalBillSet(totalAmount);
            if (optimalBillSet) {
                setOptimalSet(optimalBillSet);
                setShowOptimalSet(true);
                let address = await AsyncStorage.getItem('address');
                console.log("address: ", address);
                console.log("totalAmount: ", totalAmount);
                // Notice the corrected object with a single 'pair' property
                let sellOrder = {
                    user: address,
                    event: "order",
                    type: "sell",
                    pair: "USD_USDC", // Assuming this is the correct pair
                    amount: Number(totalAmount),
                    amountOutMin: Number(totalAmount) * 0.9,
                };
                console.log("sellOrder: ", sellOrder);
                const resultSubmit = await axios.post('https://cash2btc.com/api/v1/bankless/order/submit', sellOrder, {
                    headers: {
                        Authorization: QUERY_KEY
                    }
                });
                console.log("resultSubmit: ", resultSubmit);
            } else {
                setShowOptimalSet(false);
            }
        } catch (error) {
            console.error("Error submitting order: ", error);
            // Here, you can show an alert or update the UI to notify the user that the order submission failed
            Alert.alert("Order Submission Failed", "There was an error submitting your order. Please try again.");
        }
    };






    const renderBillImages = () => {
        if (!showOptimalSet) {
            return null; // Do not render bill images before confirming
        }

        return Object.entries(optimalSet).map(([amount, count]) => (
            <View key={amount} style={styles.billImageContainer}>
                <Image source={billImages[amount]} style={styles.billImage} />
                <Text style={styles.billText}>{`${count}x ${amount} USD`}</Text>
            </View>
        ));
    };


    // get information about market makers here : https://cash2btc.com/api/v1/online

    useEffect(() => {
        const OnlineTerminals = async () => {
            try {
                const response = await fetch('https://cash2btc.com/api/v1/bankless/info');
                const data = await response.json();
                // Do something with the data, e.g., set it to state
            } catch (error) {
                console.error("Error fetching server status: ", error);
            }
        };

        OnlineTerminals();
    }, []);




    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
        >
            <View style={styles.modalView}>
                <Text style={styles.totalAmountText}>Total: {calculateTotalAmount()} USD</Text>
                <ScrollView contentContainerStyle={styles.billsGrid}>
                    {renderBillImages()}
                </ScrollView>
                <View style={styles.suggestionButtonsContainer}>
                    {[1, 5, 10, 20, 50, 100].map((amount) => (
                        <TouchableOpacity key={amount} style={styles.suggestionButton} onPress={() => addCashAmount(amount)}>
                            <Text style={styles.suggestionButtonText}>+{amount}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { setUserSelection({}); setShowOptimalSet(false); }}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ ...styles.closeButton, position: 'absolute', top: 6, right: 9 }}
                    onPress={() => { setModalVisible(false); setShowOptimalSet(false); setUserSelection({}); }}
                >
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default CashRequestModal;
