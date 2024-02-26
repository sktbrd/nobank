// CashRequestModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, StyleSheet } from 'react-native';
import { styles } from '../styles/styles';

const CashRequestModal = ({ modalVisible, setModalVisible, cashCounts, addCashAmount, setCashCounts, billImages }) => {
    const renderBillImages = () => {
        return Object.entries(cashCounts).map(([amount, count]) => (
            <View key={amount} style={styles.billImageContainer}>
                <Image source={billImages[amount]} style={styles.billImage} />
                <Text style={styles.billText}>{`${count}x ${amount} USD`}</Text>
            </View>
        ));
    };

    return (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
            <View style={styles.modalView}>
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
                <TouchableOpacity style={styles.button} onPress={() => setCashCounts({})}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.closeButton, position: 'absolute', top: 6, right: 9 }} onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
            </View>

        </Modal>
    );
};

export default CashRequestModal;
