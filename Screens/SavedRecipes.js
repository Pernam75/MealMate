import { HStack, View, Icon, IconButton, Text, ScrollView, useColorMode } from 'native-base';
import React, {useState, useEffect} from 'react';
import { AntDesign, Ionicons } from "@expo/vector-icons"
import FavRecipe from '../components/FavRecipe';
const Env = require('../Env/EvnVariables')

export default function Saved({navigation}) {
  const {
      colorMode,
      toggleColorMode
  } = useColorMode();

  const [fav, setFavs] = useState([]);

  const GetRecipes = () => {
      fetch(`${Env.default.ip}/recipes`)
      .then(response => response.json())
      .then((data) => {
        setFavs(data.splice(0,15));
      })
      .catch((error) => console.log(error.message))
  }

  useEffect(() => {
      GetRecipes()
  },[])
  return (
    <View backgroundColor={colorMode === "dark" ? "black" : "coolGray.100"} flex={1} alignItems="center">
      <HStack backgroundColor={colorMode === "dark" ? "gray.900" : "white"}  space="16" alignItems="center" px="3"  pt="7" pb="1" borderRadius="15" shadow="3">
      <IconButton icon={<Icon as={<Ionicons name="close-outline" />} />} borderRadius="full" _icon={{
                  color: colorMode === "dark" ? "white" : "black" ,
                  size: "xl"
                }} _hover={{
                  bg: "black:alpha.20"
                }} _pressed={{
                  bg: "black:alpha.20",
                  _icon: {
                    name: "emoji-flirt"
                  },
                  _ios: {
                    _icon: {
                      size: "2xl"
                    }
                  }
                }} _ios={{
                  _icon: {
                    size: "2xl"
                  }
                }} 
                onPress={() => { navigation.navigate('Home Page') }}/>
        <Text fontSize="3xl">Recipe Book</Text>
        <Icon color="#59DBB7" as={<AntDesign name="heart"/>}  size="md" mx="3"/>
      </HStack>

      <ScrollView maxW="3000" width="100%" _contentContainerStyle={{ minW: "72" }}>
          {fav.map(fav => {return <FavRecipe key={fav.id_recipe} item={fav}/>})}
      </ScrollView>

    </View>
  );
}