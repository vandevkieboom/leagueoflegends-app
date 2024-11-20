import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const HeaderIcons = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <View style={styles.headerIcons}>
      <Pressable onPress={() => alert('Search')}>
        <MaterialIcons name="search" size={24} color="white" style={styles.headerIcon} />
      </Pressable>

      <Pressable onPress={() => alert('Filter')}>
        <MaterialIcons name="filter-list" size={24} color="white" style={styles.headerIcon} />
      </Pressable>

      <Pressable onPress={() => alert('Sort')}>
        <MaterialIcons name="sort" size={24} color="white" style={styles.headerIcon} />
      </Pressable>
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
