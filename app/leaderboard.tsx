import { View, Text, ScrollView, StyleSheet } from 'react-native';
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

  const sortedHighScores = highScores?.sort((a, b) => b.score - a.score);

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
      <View style={styles.leaderboard}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Score</Text>
        </View>
        <ScrollView>
          {sortedHighScores?.map((item, index) => (
            <View key={index.toString()} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.name}</Text>
              <Text style={styles.tableCell}>
                {item.score} / {champions?.length}
              </Text>
            </View>
          ))}
        </ScrollView>
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
  leaderboard: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 15, 1)',
    borderRadius: 10,
    marginBottom: 30,
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
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'gray',
  },
  tableHeaderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  tableCell: {
    color: 'white',
    fontSize: 18,
  },
});

export default Leaderboard;
