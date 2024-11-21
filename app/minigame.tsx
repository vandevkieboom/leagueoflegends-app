import React, { useState } from 'react';
import { fetchChampions } from '@/api';
import { Champion } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { FlatList, View, StyleSheet, Pressable, Image, TextInput, Button, Text } from 'react-native';

const Minigame = () => {
  const [guess, setGuess] = useState('');
  const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);

  const { data: champions } = useQuery<Champion[]>({
    queryKey: ['champions'],
    queryFn: fetchChampions,
  });

  const handleGuess = () => {
    if (champions && champions.some((champion) => champion.name.toLowerCase() === guess.toLowerCase())) {
      setCorrectGuesses([...correctGuesses, guess]);
    }
    setGuess('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={champions}
        key={`columns-${5}`}
        keyExtractor={(item) => item.id.toString()}
        numColumns={5}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => alert(item.name)}>
            <Image source={{ uri: item.image.loading }} style={styles.image} />
            {correctGuesses.includes(item.name) && (
              <View style={styles.overlay}>
                <View style={styles.nameContainer}>
                  <Text style={styles.guessText} numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                  </Text>
                </View>
              </View>
            )}
          </Pressable>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={guess} onChangeText={setGuess} placeholder="Enter champion name" />
        <Button title="Guess" onPress={handleGuess} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'black',
  },
  item: {
    flex: 1,
    margin: 2,
    height: 114,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 4,
  },
  guessText: {
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    padding: 5,
    color: 'white',
  },
});

export default Minigame;
