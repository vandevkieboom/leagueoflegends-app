import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface HeaderIcon {
  name: 'search' | 'filter-list' | 'sort' | 'leaderboard';
  onPress: () => void;
}

interface HeaderIconsProps {
  icons: HeaderIcon[];
}

const HeaderIcons = ({ icons }: HeaderIconsProps) => {
  return (
    <View style={styles.headerIcons}>
      {icons.map((icon, index) => (
        <Pressable key={index} onPress={icon.onPress}>
          <MaterialIcons name={icon.name} size={24} color="white" style={styles.headerIcon} />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },
  headerIcon: {
    color: 'white',
    marginHorizontal: 8,
  },
});

export default HeaderIcons;
