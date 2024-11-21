import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Text, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { fetchChampions } from '@/api';
import { Champion } from '@/types';

interface IndexProps {
  searchBarVisible: boolean;
}

const Index = ({ searchBarVisible }: IndexProps) => {
  const [search, setSearch] = useState<string>('');
  const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});

  const { data: champions } = useQuery<Champion[]>({
    queryKey: ['champions'],
    queryFn: fetchChampions,
  });

  const filteredChampions = champions?.filter((champion) => champion.name.toLowerCase().includes(search.toLowerCase()));

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      {searchBarVisible && (
        <TextInput placeholder="Search champions" onChangeText={setSearch} style={styles.textInput} />
      )}
      <FlatList
        data={filteredChampions}
        key={`columns-${3}`}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => alert(item.name)} activeOpacity={0.5}>
            <View />
            <Image source={{ uri: item.image.loading }} style={styles.image} />
            <TouchableOpacity style={styles.bookmarkIcon} onPress={() => toggleBookmark(item.id.toString())}>
              <MaterialIcons
                name={bookmarked[item.id] ? 'bookmark-added' : 'bookmark-outline'}
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'black',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 2,
    marginBottom: 12,
    marginHorizontal: 5,
    padding: 10,
  },
  item: {
    flex: 1,
    margin: 2,
    height: 197,
    maxWidth: '32%',
    position: 'relative',
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
    padding: 4,
  },
  nameText: {
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  description: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 10,
    overflow: 'hidden',
  },
});

export default Index;
