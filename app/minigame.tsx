import React, { useEffect, useState } from 'react';
import { fetchChampions, postHighScore } from '@/api';
import { Champion, HighScore } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FlatList, View, StyleSheet, Pressable, Image, TextInput, Text, ActivityIndicator, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getCorrectGuesses, saveCorrectGuesses, getLives, saveLives, saveScore, getScore } from '@/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MinigameProps {
  lives: number | null;
  setLives: React.Dispatch<React.SetStateAction<number | null>>;
}

const Minigame = ({ lives, setLives }: MinigameProps) => {
  const [guess, setGuess] = useState<string>('');
  const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);
  const [inputBorderColor, setInputBorderColor] = useState<string>('gray');
  const [playerName, setPlayerName] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const {
    data: champions,
    error: championsError,
    isLoading: isLoadingChampions,
  } = useQuery<Champion[]>({
    queryKey: ['champions'],
    queryFn: fetchChampions,
  });

  const { mutate } = useMutation({
    mutationFn: ({ name, score }: HighScore) => postHighScore({ name, score }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highScores'] });
      setIsGameOver(false);
      handleReset();
    },
    onError: (error) => {
      console.error('Error posting high score:', error);
    },
  });

  const viewStoredData = async (key: string) => {
    try {
      const data = await AsyncStorage.getItem(key);
      console.log(`Stored Data for ${key}:`, data);
    } catch (error) {
      console.error(`Error retrieving data for ${key} from AsyncStorage`, error);
    }
  };

  useEffect(() => {
    viewStoredData('lives');
    viewStoredData('score');
  }, [lives, score]);

  const handleGuess = () => {
    const lowercasedGuess = guess.toLowerCase();
    if (champions && champions.some((champion) => champion.name.toLowerCase() === lowercasedGuess)) {
      if (!correctGuesses.map((g) => g.toLowerCase()).includes(lowercasedGuess)) {
        setCorrectGuesses((prevGuesses) => {
          const newGuesses = [...prevGuesses, lowercasedGuess];
          return newGuesses;
        });
        setInputBorderColor('green');
        setScore((prevScore) => prevScore! + 1);
      } else {
        setInputBorderColor('orange');
      }
    } else {
      setInputBorderColor('red');
      setLives((prevLives) => {
        const newLives = (prevLives ?? 1) - 1;
        if (newLives <= 0) {
          handleGameOver();
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

  const handleReset = () => {
    setCorrectGuesses([]);
    setLives(3);
    setScore(0);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
  };

  const handlePostHighScore = () => {
    mutate({ name: playerName, score: score! });
  };

  useEffect(() => {
    const loadGameData = async () => {
      const storedGuesses = await getCorrectGuesses();
      setCorrectGuesses(storedGuesses);
      const storedScore = await getScore();
      setScore(storedScore);
      const storedLives = await getLives();
      setLives(storedLives);
    };
    loadGameData();
  }, []);

  useEffect(() => {
    if (score !== null) {
      saveScore(score);
    }
  }, [score]);

  useEffect(() => {
    saveCorrectGuesses(correctGuesses);
  }, [correctGuesses]);

  useEffect(() => {
    if (lives !== null) {
      saveLives(lives);
    }
  }, [lives]);

  if (isLoadingChampions) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="fff" />
        <Text style={styles.loadingText}>Loading data...</Text>
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
                <MaterialIcons name="check" size={34} color="white" />
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

      <Modal animationType="fade" transparent={true} visible={isGameOver}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Game Over!</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input]}
                onChangeText={(text) => {
                  setPlayerName(text);
                }}
                placeholder="Enter username"
                placeholderTextColor="gray"
                onSubmitEditing={handlePostHighScore}
              />
              <Pressable onPress={handlePostHighScore}>
                <MaterialIcons name="save" size={34} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '80%',
    borderRadius: 2,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
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
