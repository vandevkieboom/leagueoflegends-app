import React, { useState, useEffect } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Pressable, StatusBar, Image, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import Minigame from './minigame';
import Index from './index';
import HeaderIcons from '../components/HeaderIcons';

const Drawer = createDrawerNavigator();
const queryClient = new QueryClient();

const CustomDrawerContent = (props: DrawerContentComponentProps) => (
  <View style={{ flex: 1 }}>
    <View style={{ position: 'relative', borderTopRightRadius: 0, overflow: 'hidden' }}>
      <Image source={require('../assets/images/viego.jpg')} style={styles.drawerImage} />
      <LinearGradient colors={['transparent', 'rgba(16, 16, 16, 1)']} style={styles.imageOverlay} />
    </View>
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  </View>
);

const RootLayout = () => {
  const [searchBarVisible, setSearchBarVisible] = useState<boolean>(false);
  const [correctGuessCount, setCorrectGuessCount] = useState<number>(0);
  const [highscoresModalVisible, setHighscoresModalVisible] = useState<boolean>(false);
  const [sortModalVisible, setSortModalVisible] = useState<boolean>(false);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <QueryClientProvider client={queryClient}>
        <Drawer.Navigator
          initialRouteName="Champions"
          drawerContent={CustomDrawerContent}
          screenOptions={({ navigation }) => ({
            headerLeft: () => (
              <View style={{ alignItems: 'center' }}>
                <Pressable onPress={() => navigation.openDrawer()}>
                  <MaterialIcons name="menu" size={24} color="white" style={{ marginLeft: 15 }} />
                </Pressable>
              </View>
            ),
            drawerActiveTintColor: 'rgba(4, 4, 4, 1)',
            drawerItemStyle: {
              marginVertical: 7,
              marginHorizontal: 7,
            },
            drawerStyle: {
              backgroundColor: 'rgba(15, 15, 15, 1)',
              width: 270,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
            drawerLabelStyle: {
              color: '#fff',
            },
            drawerType: 'slide',
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              color: '#fff',
              fontSize: 18,
              marginLeft: 10,
            },
          })}
        >
          <Drawer.Screen
            name="Champions"
            options={{
              drawerIcon: () => <MaterialCommunityIcons name="sword-cross" size={20} color="white" />,
              headerRight: () => (
                <HeaderIcons
                  icons={[
                    { name: 'search', onPress: () => setSearchBarVisible((prev) => !prev) },
                    { name: 'filter-list', onPress: () => setFilterModalVisible(true) },
                    { name: 'sort', onPress: () => setSortModalVisible(true) },
                  ]}
                />
              ),
            }}
          >
            {(props) => (
              <Index
                {...props}
                searchBarVisible={searchBarVisible}
                sortModalVisible={sortModalVisible}
                setSortModalVisible={setSortModalVisible}
                filterModalVisible={filterModalVisible}
                setFilterModalVisible={setFilterModalVisible}
              />
            )}
          </Drawer.Screen>
          <Drawer.Screen
            name="Minigame"
            options={{
              drawerIcon: () => <MaterialIcons name="quiz" size={20} color="white" />,
              headerRight: () => (
                <HeaderIcons
                  icons={[{ name: 'leaderboard', onPress: () => setHighscoresModalVisible(true) }]}
                  count={correctGuessCount}
                />
              ),
            }}
          >
            {(props) => (
              <Minigame
                {...props}
                correctGuessCount={correctGuessCount}
                setCorrectGuessCount={setCorrectGuessCount}
                highscoresModalVisible={highscoresModalVisible}
                setHighscoresModalVisible={setHighscoresModalVisible}
              />
            )}
          </Drawer.Screen>
        </Drawer.Navigator>
      </QueryClientProvider>
    </>
  );
};

const styles = StyleSheet.create({
  drawerImage: {
    width: '100%',
    height: 210,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
});

export default RootLayout;
