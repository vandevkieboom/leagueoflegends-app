import React from 'react';
import { Modal, Pressable, Text, View, StyleSheet } from 'react-native';

interface OptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
  selectedOption: string;
  options: string[];
  title: string;
}

const OptionsModal = ({ visible, onClose, onSelect, selectedOption, options, title }: OptionsModalProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalContainer} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>{title.toLocaleUpperCase()}</Text>
          {options.map((option) => (
            <Pressable key={option} style={[styles.modalItem, styles.lastModalItem]} onPress={() => onSelect(option)}>
              <Text style={[styles.modalItemText, selectedOption === option && styles.activeSortText]}>{option}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 15, 15, 0.4)',
  },
  modalContent: {
    backgroundColor: 'rgba(15, 15, 15, 1)',
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalItemText: {
    textAlign: 'left',
    color: 'white',
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#8a8a8a',
    textAlign: 'left',
    paddingLeft: 20,
    paddingVertical: 20,
    fontSize: 14,
  },
  activeSortText: {
    color: '#b19500',
  },
  lastModalItem: {
    paddingBottom: 20,
  },
});

export default OptionsModal;
