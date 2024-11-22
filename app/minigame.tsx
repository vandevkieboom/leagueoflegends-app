import React, { useEffect, useState } from 'react';
import { fetchChampions, postHighScore } from '@/api';
import { Champion } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { FlatList, View, StyleSheet, Pressable, Image, TextInput, Text, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getCorrectGuesses, saveCorrectGuesses, getLives, saveLives } from '@/storage';

interface MinigameProps {
  correctGuessCount: number;
  setCorrectGuessCount: React.Dispatch<React.SetStateAction<number>>;
  lives: number;
  setLives: React.Dispatch<React.SetStateAction<number>>;
}

const Minigame = ({ correctGuessCount, setCorrectGuessCount, lives, setLives }: MinigameProps) => {
  const [guess, setGuess] = useState<string>('');
  const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);
  const [inputBorderColor, setInputBorderColor] = useState<string>('gray');

  const {
    data: champions,
    error: championsError,
    isLoading: isLoadingChampions,
  } = useQuery<Champion[]>({
    queryKey: ['champions'],
    queryFn: fetchChampions,
  });

  const handleGameOver = async () => {
    const username = 'player1';
    const score = correctGuessCount;

    try {
      await postHighScore(username, score);
      alert('Game over! Your high score has been posted.');
    } catch (error) {
      alert('Failed to post high score.');
    }
  };

  const handleGuess = () => {
    const lowercasedGuess = guess.toLowerCase();
    if (champions && champions.some((champion) => champion.name.toLowerCase() === lowercasedGuess)) {
      if (!correctGuesses.map((g) => g.toLowerCase()).includes(lowercasedGuess)) {
        setCorrectGuesses((prevGuesses) => {
          const newGuesses = [...prevGuesses, lowercasedGuess];
          setCorrectGuessCount(newGuesses.length);
          return newGuesses;
        });
        setInputBorderColor('green');
      } else {
        setInputBorderColor('orange');
      }
    } else {
      setInputBorderColor('red');
      setLives((prevLives) => {
        const newLives = prevLives - 1;
        if (newLives <= 0) {
          handleGameOver();
          handleReset();
          return 3;
        }
        return newLives;
      });
    }
    setGuess('');

    setTimeout(() => {
      setInputBorderColor('gray');
    }, 1000);
  };

  useEffect(() => {
    const loadGameData = async () => {
      const storedGuesses = await getCorrectGuesses();
      setCorrectGuesses(storedGuesses);
      setCorrectGuessCount(storedGuesses.length);
      const storedLives = await getLives();
      setLives(storedLives);
    };
    loadGameData();
  }, []);

  useEffect(() => {
    saveCorrectGuesses(correctGuesses);
  }, [correctGuesses]);

  useEffect(() => {
    saveLives(lives);
  }, [lives]);

  const handleReset = () => {
    setCorrectGuesses([]);
    setCorrectGuessCount(0);
    saveCorrectGuesses([]);
    setLives(3);
    saveLives(3);
  };

  if (isLoadingChampions) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="fff" />
        <Text style={styles.loadingText}>Gegevens laden...</Text>
      </View>
    );
  }

  if (championsError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>An error occurred while loading the data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={champions}
        key={`columns-${5}`}
        keyExtractor={(item) => item.id.toString()}
        numColumns={5}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image.loading }} style={styles.image} />
            {correctGuesses.map((g) => g.toLowerCase()).includes(item.name.toLowerCase()) && (
              <View style={styles.overlay}>
                <MaterialIcons name="check" size={34} color="#fff" />
              </View>
            )}
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { borderColor: inputBorderColor }]}
          value={guess}
          onChangeText={setGuess}
          placeholder="Guess Champion"
          placeholderTextColor="gray"
          onSubmitEditing={handleGuess}
        />
        <Pressable onPress={handleGuess} style={styles.checkIcon}>
          <MaterialIcons name="check" size={34} color="green" />
        </Pressable>
        <Pressable onPress={handleReset}>
          <MaterialIcons name="restart-alt" size={34} color="red" />
        </Pressable>
      </View>
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={highscoresModalVisible}
        onRequestClose={() => setHighscoresModalVisible(false)}
      >
        <Pressable style={styles.modalContainer} onPress={() => setHighscoresModalVisible(false)}>
          <View style={[styles.modalContent, { borderColor: getRankColor(getRank(1)) }]}>
            <Text style={[styles.modalTitle, { color: getRankColor(getRank(1)) }]}>
              RANKING: {getRank(1).toUpperCase()}
            </Text>
            <View style={styles.highScoreContainer}>
              <Text style={[styles.highScoreText, { color: getRankColor(getRank(1)) }]}>
                {1}/{champions?.length}
              </Text>
              <Text style={styles.modalText}>Champions</Text>
            </View>
          </View>
        </Pressable>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
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
    backgroundColor: 'rgba(68, 178, 69, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 20,
    padding: 7,
    borderRadius: 2,
    color: 'gray',
  },
  countText: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
    paddingBottom: 10,
  },
  checkIcon: {
    marginRight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: '#000',
    opacity: 0.9,
    padding: 40,
    width: '77%',
    borderRadius: 2,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  highScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highScoreText: {
    textAlign: 'center',
    marginRight: 4,
  },
  modalText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Minigame;
