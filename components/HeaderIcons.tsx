import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { fetchChampions } from '@/api';
import { Champion } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface HeaderIcon {
  name: 'search' | 'filter-list' | 'sort' | 'leaderboard' | 'heart';
  onPress: () => void;
}

interface HeaderIconsProps {
  icons?: HeaderIcon[];
  count?: number;
  lives?: number | null;
}

const HeaderIcons = ({ icons = [], count, lives }: HeaderIconsProps) => {
  const { data: champions } = useQuery<Champion[]>({
    queryKey: ['champions'],
    queryFn: fetchChampions,
  });

  const renderLifeIcons = () => {
    const lifeIcons = [];
    for (let i = 0; i < (lives || 0); i++) {
      lifeIcons.push(<MaterialCommunityIcons key={i} name="heart" size={24} color="white" style={styles.lifeIcon} />);
    }
    return lifeIcons;
  };

  return (
    <View style={styles.headerIcons}>
      {icons.map((icon, index) => (
        <Pressable key={index} onPress={icon.onPress} style={styles.iconContainer}>
          {icon.name === 'heart' && count !== undefined && (
            <Text style={styles.countText}>
              {count}/{champions?.length}
            </Text>
          )}
          {icon.name === 'heart' ? (
            <MaterialCommunityIcons name={icon.name} size={24} color="white" style={styles.headerIcon} />
          ) : (
            <MaterialIcons name={icon.name} size={24} color="white" style={styles.headerIcon} />
          )}
        </Pressable>
      ))}
      {renderLifeIcons()}
    </View>
  );
};

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    color: 'white',
    marginHorizontal: 8,
  },
  countText: {
    color: 'white',
    fontSize: 16,
    marginRight: -3,
    marginTop: 4,
  },
  lifeIcon: {
    marginHorizontal: 2,
  },
});

export default HeaderIcons;
