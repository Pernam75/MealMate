import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from "@expo/vector-icons";
import Home from '../Screens/HomeScreen';
import Saved from '../Screens/SavedRecipes'
import Profile from '../Screens/ProfileScreen'
import CustomLeftDrawer from './LeftDrawer';
import CustomRightDrawer from './RightDrawer';
import {useColorMode} from 'native-base'

const LeftDrawer = createDrawerNavigator();

function LeftDrawerScreen() {
  const {
    colorMode,
    toggleColorMode
  } = useColorMode();
  
  return (
    <LeftDrawer.Navigator drawerContent={props => <CustomLeftDrawer {...props}/>}
      useLegacyImplementation
      id="LeftDrawer"
      screenOptions={{ 
        drawerPosition: 'left', 
        headerShown: false,

        drawerInactiveBackgroundColor: colorMode === "dark" ? "black" : "white",
        drawerInactiveTintColor: colorMode === "dark" ? "white" : "black",

        drawerActiveBackgroundColor: colorMode === "dark" ? "rgba(89, 219, 183, 0.18)" : "rgba(89, 219, 183, 0.18)",
        drawerActiveTintColor: colorMode === "dark" ? '#59DBB7' : '#59DBB7',
        
        drawerLabelStyle:{
          marginLeft: -10
        }
        }}>
      <LeftDrawer.Screen name="Home Page" component={Home} options={{drawerIcon: ({color}) => <Ionicons name="home-outline" size={22} color={color}/>}} />
      <LeftDrawer.Screen name="Saved Recipes" component={Saved} options={{drawerIcon: ({color}) => <Ionicons name="heart-outline" size={22} color={color}/>}} />
      <LeftDrawer.Screen name="My Profile" component={Profile} options={{drawerIcon: ({color}) => <Ionicons name="person-outline" size={22} color={color}/>}} />
    </LeftDrawer.Navigator>
  );
}

const RightDrawer = createDrawerNavigator();

function DoubleDrawer() {
  return (
    <RightDrawer.Navigator 
      useLegacyImplementation 
      id="RightDrawer"
      drawerContent={(props) => <CustomRightDrawer {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
      }}>
      <RightDrawer.Screen name="HomeDrawer" component={LeftDrawerScreen} />
    </RightDrawer.Navigator>
  );
}

export default function MyDrawer2() {
  return (
    <DoubleDrawer />
  );
}


// const Drawer = createDrawerNavigator();

// function MyDrawer() {
//   return (
//     <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{headerShown: false}}>
//       <Drawer.Screen name="Home" component={Home} />
//       <Drawer.Screen name="Profile" component={Profile} />
//     </Drawer.Navigator>
//   );
// }