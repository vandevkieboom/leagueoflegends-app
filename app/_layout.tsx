import React, { useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Pressable, StatusBar, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
    <View style={{ position: 'relative', borderTopRightRadius: 10, overflow: 'hidden' }}>
      <Image source={require('../assets/images/viego.jpg')} style={styles.drawerImage} />
      <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 1)']} style={styles.imageOverlay} />
    </View>
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  </View>
);

const RootLayout = () => {
  const [searchBarVisible, setSearchBarVisible] = useState<boolean>(false);

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
            drawerActiveTintColor: '#fff',
            drawerItemStyle: { marginVertical: 7 },
            drawerStyle: {
              backgroundColor: '#000',
              width: 270,
              borderTopRightRadius: 14,
              borderBottomRightRadius: 0,
            },
            drawerLabelStyle: {
              color: '#fff',
            },
            drawerType: 'front',
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
              headerRight: () => (
                <HeaderIcons
                  icons={[
                    { name: 'search', onPress: () => setSearchBarVisible((prev) => !prev) },
                    { name: 'filter-list', onPress: () => alert('hello') },
                    { name: 'sort', onPress: () => alert('hello') },
                  ]}
                />
              ),
            }}
          >
            {(props) => <Index {...props} searchBarVisible={searchBarVisible} />}
          </Drawer.Screen>
          <Drawer.Screen
            name="Minigame"
            component={Minigame}
            options={{
              headerRight: () => <HeaderIcons icons={[{ name: 'leaderboard', onPress: () => alert('hello') }]} />,
            }}
          />
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
