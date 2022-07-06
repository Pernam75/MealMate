import React, {useState, useEffect} from 'react';
import { ScrollView, Center, View, Input, Icon, Pressable, useColorMode, Text, Flex } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import Recipe from './Recipe';
import SmallRecipe from './SmallRecipe';
const Env = require('../Env/EvnVariables')
const recipeList = require('../src/data/all_recipes.json')



function Recomendations(props) {
    const likes = props.likes;
    if (likes > 4) {
      return (
        <View my="2">
            <Text fontSize="lg" fontWeight="bold" pl="3" pb="2">Recommended for you</Text>
            <ScrollView flex="1" horizontal={true} showsHorizontalScrollIndicator={true} persistentScrollbar={true}>
                    <Pressable onPress={() => {
                        navigation.navigate('recipe', recipeList[5])}}
                        key={recipeList[5].recipe_id}>
                        <SmallRecipe item={recipeList[5]} />
                    </Pressable>
                    <Pressable onPress={() => {
                        navigation.navigate('recipe', recipeList[4])}}
                        key={recipeList[4].recipe_id}>
                        <SmallRecipe item={recipeList[4]} />
                    </Pressable>
                    <Pressable onPress={() => {
                        navigation.navigate('recipe', recipeList[6])}}
                        key={recipeList[6].recipe_id}>
                        <SmallRecipe item={recipeList[6]} />
                    </Pressable>
            </ScrollView>
        </View>
      );
    }
    return (
        <View backgroundColor="#59DBB7">
            <Text alignSelf="center" fontSize="2xl" fontWeight="extrabold" color="white" textAlign="center" w="60%" my="5">Like at least 5 recipes to get custom recommendations</Text>
        </View>
    );
  }

export default function Recipes({navigation}) {
    const {
      colorMode,
      toggleColorMode
    } = useColorMode();

    const [recipe, setRecipe] = useState([]);
    const [search, setSearch] = useState('');
    const [likes, setLikes] = useState(0);

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
        setLikes(0)
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
                    <View alignSelf="center" w="85%" borderColor="#59DBB7" borderRadius="15" borderWidth="5">
                        <Recomendations likes={likes} />
                    </View>

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