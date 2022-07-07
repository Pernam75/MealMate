import { HStack, View, Icon, IconButton, Text, ScrollView, useColorMode, Button } from 'native-base';
import React, {useState, useEffect, useContext} from 'react';
import { AntDesign, Ionicons } from "@expo/vector-icons"
import FavRecipe from '../components/FavRecipe';
const Env = require('../Env/EvnVariables')
const recipeList = require('../src/data/all_recipes.json')
import { AuthContext } from '../Contexts/AuthContext'

export default function Saved({navigation}) {
  const {
      colorMode,
      toggleColorMode
  } = useColorMode();

  const {userLikes} = useContext(AuthContext)

  const [fav, setFavs] = useState([]);

  const RecipesById = (recipeList, idArray) => {
    var resultArray = []
    for (let index = 0; index < recipeList.length; index++) {
        if (idArray.includes(recipeList[index].recipe_id)) {
            resultArray.push(recipeList[index])
        }
    }
    return(resultArray)
}

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
    console.log('Refreshed Saves!');
    setFavs(RecipesById(recipeList, userLikes))
    });
    return unsubscribe;
  },[navigation])
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