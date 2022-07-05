import React, {useState, useEffect} from 'react';
import { ScrollView, Center, View, Input, Icon, Pressable, useColorMode, Text } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import Recipe from './Recipe';
const Env = require('../Env/EvnVariables')
const recipeList = require('../src/data/all_recipes.json')

export default function Recipes({navigation}) {
    const {
      colorMode,
      toggleColorMode
    } = useColorMode();

    const [recipe, setRecipe] = useState([]);
    const [search, setSearch] = useState('');

    const GetRecipes = (n = 15) => {
        fetch(`${Env.default.ip}/recipes/${search}`)
        .then(response => response.json())
        .then((data) => {
            setRecipe(data.splice(25,n));
        })
        .catch((error) => console.log(error.message))
    }

    useEffect(() => {
        // GetRecipes()
        setRecipe(recipeList.splice(0,10))
    },[])
    return (
        <View backgroundColor={colorMode === "dark" ? "black" : "coolGray.100"}>
            <Center backgroundColor={colorMode === "dark" ? "gray.900" : "white"} pt="10" pb="5" px="5">
                <Input value={search} onChangeText={text => {setSearch(text)}} h="12"placeholderTextColor={colorMode === "dark" ? "warmGray.400" : "coolGray.400"} placeholder="What recipe are you looking for ?" variant="filled" width="100%" borderRadius="10" px="5" borderWidth="0" InputRightElement={<Icon mr="4" size="4" color={colorMode === "dark" ? "white" : "black"} as={<Ionicons name="ios-search" />} />} />
            </Center>
            <Center h = "87%">
                <ScrollView maxW="3000" width="100%" _contentContainerStyle={{
                minW: "72"
                }}>
                    <Text>{search}</Text>
                {recipe.map(recipe => {return (
                    <Pressable onPress={() => {
                        navigation.navigate('recipe', recipe)}}
                        key={recipe.recipe_id}>
                        <Recipe item={recipe} />
                    </Pressable>
                    )})}
                </ScrollView>
            </Center>
        </View>
    )
  }