import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchChampions } from '@/api';
import { Champion } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface HeaderIcon {
  name: 'search' | 'filter-list' | 'sort' | 'leaderboard';
  onPress: () => void;
}

interface HeaderIconsProps {
  icons: HeaderIcon[];
  count?: number;
}

const HeaderIcons = ({ icons, count }: HeaderIconsProps) => {
  const { data: champions } = useQuery<Champion[]>({
    queryKey: ['champions'],
    queryFn: fetchChampions,
  });

  return (
    <View style={styles.headerIcons}>
      {icons.map((icon, index) => (
        <Pressable key={index} onPress={icon.onPress} style={styles.iconContainer}>
          {icon.name === 'leaderboard' && count !== undefined && (
            <Text style={styles.countText}>
              {count}/{champions?.length}
            </Text>
          )}
          <MaterialIcons name={icon.name} size={24} color="white" style={styles.headerIcon} />
        </Pressable>
      ))}
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
});

export default HeaderIcons;
