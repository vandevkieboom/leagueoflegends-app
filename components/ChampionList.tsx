import React from 'react';
import { FlatList, StyleSheet, Pressable, Image, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Champion } from '@/types';
import { fetchChampions } from '@/api';

const ChampionList = () => {
  const {
    data: champions,
    error,
    isLoading,
  } = useQuery<Champion[]>({
    queryKey: ['champions'],
    queryFn: fetchChampions,
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={champions}
      key={`columns-${3}`}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3}
      renderItem={({ item }) => (
        <Pressable style={styles.item} onPress={() => alert(item.name)}>
          <Image source={{ uri: item.image.loading }} style={styles.image} />
          <MaterialIcons name="bookmark-outline" size={24} color="white" style={styles.bookmarkIcon} />
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{item.name}</Text>
          </View>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 2,
    height: 197,
    maxWidth: '33%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  nameContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
  },
  nameText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ChampionList;
