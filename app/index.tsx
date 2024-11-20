import ChampionList from '../components/ChampionList';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Index = () => {
  return (
    <View style={styles.container}>
      <ChampionList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'black',
  },
});

export default Index;
