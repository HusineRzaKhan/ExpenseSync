import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { ThemeProvider, ThemeContext } from './theme';
import { NotificationProvider, NotificationContext } from './contexts/NotificationContext';
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
  const { unreadCount } = React.useContext(NotificationContext);
  
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
            
            const icon = <MaterialIcons name={name} size={size} color={color} />;
            
            // Add badge dot for notifications if there are unread
            if (route.name === 'Notifications' && unreadCount > 0) {
              return (
                <View style={{ position: 'relative' }}>
                  {icon}
                  <View style={{
                    position: 'absolute',
                    right: -6,
                    top: -2,
                    backgroundColor: '#ff4444',
                    borderRadius: 5,
                    width: 10,
                    height: 10,
                    borderWidth: 1.5,
                    borderColor: theme === 'dark' ? '#222' : '#fff'
                  }} />
                </View>
              );
            }
            
            return icon;
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

function InnerApp() {
  const { theme } = React.useContext(ThemeContext);
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = Text.defaultProps.style || {};
  Text.defaultProps.style.color = theme === 'dark' ? '#fff' : '#000';
  return (
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
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <InnerApp />
      </NotificationProvider>
    </ThemeProvider>
  );
}
