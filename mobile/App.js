import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { ThemeProvider, ThemeContext } from './theme';
import SideMenu from './components/SideMenu';
import AppBar from './components/AppBar';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import BudgetScreen from './screens/BudgetScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { toggleTheme, theme } = React.useContext(ThemeContext);
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          header: () => <AppBar onAvatarPress={() => setMenuVisible(true)} />,
          tabBarIcon: ({ color, size }) => {
            let name = 'home';
            if (route.name === 'Home') name = 'home';
            if (route.name === 'Calendar') name = 'calendar-today';
            if (route.name === 'Categories') name = 'category';
            if (route.name === 'Budget') name = 'bar-chart';
            if (route.name === 'Notifications') name = 'notifications';
            return <MaterialIcons name={name} size={size} color={color} />;
          },
          tabBarStyle: { backgroundColor: theme === 'dark' ? '#222' : '#fff' },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Categories" component={CategoriesScreen} />
        <Tab.Screen name="Budget" component={BudgetScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
      </Tab.Navigator>
      {menuVisible && (
        <SideMenu
          onClose={() => setMenuVisible(false)}
          onProfile={() => { setMenuVisible(false); navigation.navigate('Profile'); }}
          onToggleTheme={() => { toggleTheme(); }}
          onLogout={async () => { await AsyncStorage.removeItem('token'); setMenuVisible(false); navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); }}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#111' : '#fff' }}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="CategoryList" component={require('./screens/CategoryListScreen').default} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}
