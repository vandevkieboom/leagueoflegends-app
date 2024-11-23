import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchChampions, fetchHighScores } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { Champion, HighScore } from '@/types';

const Leaderboard = () => {
  const { data: champions } = useQuery<Champion[]>({
    queryKey: ['champions'],
    queryFn: fetchChampions,
  });

  const {
    data: highScores,
    isLoading: highScoresLoading,
    error: highScoresError,
  } = useQuery<HighScore[]>({
    queryKey: ['highScores'],
    queryFn: fetchHighScores,
  });

  if (highScoresLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  if (highScoresError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>An error occurred while loading the data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={highScores}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.scoreItem}>
            <Text style={styles.username}>{item.name}</Text>
            <Text style={styles.score}>
              {item.score} / {champions?.length}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
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
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  username: {
    color: 'white',
    fontSize: 18,
  },
  score: {
    color: 'white',
    fontSize: 18,
  },
});

export default Leaderboard;
