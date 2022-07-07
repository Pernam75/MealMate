import React, {useState, useEffect, useContext} from 'react';
import { ScrollView, Center, View, Input, Icon, Pressable, useColorMode, Text, Flex, FormControl, Button, Badge } from 'native-base';
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Recipe from './Recipe';
import SmallRecipe from './SmallRecipe';
const Env = require('../Env/EvnVariables')
const recipeList = require('../src/data/all_recipes.json')
import { AuthContext } from '../Contexts/AuthContext';


function Recomendations(props) {
    const likes = props.likes;
    const [NumOfRecomendations, setNumOfRecomendations] = useState(5);
    if (likes > 4) {
        return (
        <View my="2">
            <Text fontSize="lg" fontWeight="bold" pl="3" pb="2">Recommended for you</Text>
            <ScrollView flex="1" horizontal={true} showsHorizontalScrollIndicator={true} persistentScrollbar={true}>
                {props.Recomendation.slice(0,NumOfRecomendations).map(recipe => {return (
                <Pressable onPress={() => {
                    props.navigation.navigate('recipe', recipe)}}
                    key={recipe.recipe_id}>
                    <Recipe updater={props.updater} recomender={props.recomender} item={recipe} />
                </Pressable>
                )})}
                <Button backgroundColor={props.colorMode === "dark" ? "black" : "coolGray.100"} onPress={() => {
                    setNumOfRecomendations(NumOfRecomendations + 3)
                    console.log('clicked')
                }}>
                    <Icon as={FontAwesome5} size="lg" name="chevron-circle-right" color="#59DBB7" />
                </Button>
            </ScrollView>
        </View>
      );
    }
    return (
        <View backgroundColor="#59DBB7">
            <Text alignSelf="center" fontSize="2xl" fontWeight="extrabold" color="white" textAlign="center" w="80%" my="5">Like at least 5 recipes to get custom recommendations</Text>
        </View>
    );
  }

export default function Recipes({navigation}) {
    const {
      colorMode,
      toggleColorMode
    } = useColorMode();

    const {userLikes, userInfo} = useContext(AuthContext)

    const [recipe, setRecipe] = useState([]);
    const [Recomendation, setRecomendation] = useState([]);
    const [search, setSearch] = useState('');
    const [tag, setTag] = useState('All');
    const [idArray, setIdArray] = useState([]);

    const [UpdateVal, setUpdateVal] = useState(0);

    const tags = [
        { value: 'All' },
        { value: 'Breakfast' },
        { value: 'Sweet' },
        { value: 'Vegan' },
        { value: 'Dessert' },
        { value: 'Inexpensive' },
        { value: 'Appetizers' },
        { value: 'Dietary' },
        { value: 'Gluten-free' },
    ];

    async function fetchRecomendations (id_user) {
        console.log(`test ${Env.default.ip_2}/api/machine_learning?id=${id_user}`)
        fetch(`${Env.default.ip_2}/api/machine_learning?id=${id_user}`)
        .then(response => response.json())
        .then((data) => {
            console.log('recomend',data.recipe_list)
            setRecomendation(RecipesById(recipeList, data.recipe_list))
        })
        .catch((error) => console.log(error.message))
    }

    async function fetchSearchResults(search) {
        console.log(`${Env.default.ip_2}/api/recherche?search_bar=${search}`)
        fetch(`${Env.default.ip_2}/api/recherche?search_bar=${search}`)
        .then(response => response.json())
        .then((data) => {
            console.log(data.recipes)
            setIdArray(data.recipes);
            setRecipe(RecipesById(recipeList, data.recipes))
        })
        .catch((error) => console.log(error.message))
    }

    async function fetchTagResults(search) {
        console.log(`${Env.default.ip_2}/api/recherche?search_button=${search}`)
        fetch(`${Env.default.ip_2}/api/recherche?search_bar=${search}`)
        .then(response => response.json())
        .then((data) => {
            console.log(data.recipes)
            setIdArray(data.recipes);
            setRecipe(RecipesById(recipeList, data.recipes))
        })
        .catch((error) => console.log(error.message))
    }

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
            console.log('Refreshed Main!');
            setRecipe(recipeList)
            setUpdateVal(UpdateVal + 1)
            console.log(userInfo.id_user)
            fetchRecomendations(userInfo.id_user)
        });
    return unsubscribe;
    },[navigation])

    return (
        <View backgroundColor={colorMode === "dark" ? "black" : "coolGray.100"}>
            <Center backgroundColor={colorMode === "dark" ? "gray.900" : "white"} pt="10" pb="5" px="5">
                <Input value={search} 
                    onSubmitEditing={
                        (event) => {setSearch(event.nativeEvent.text)
                            fetchSearchResults(event.nativeEvent.text.toLowerCase())
                        }
                    } onChangeText={
                        text => {setSearch(text)}
                    } h="12"placeholderTextColor={colorMode === "dark" ? "warmGray.400" : "coolGray.400"} placeholder="What recipe are you looking for ?" variant="filled" width="100%" borderRadius="10" px="5" borderWidth="0" InputRightElement={<Icon mr="4" size="4" color={colorMode === "dark" ? "white" : "black"} as={<Ionicons name="ios-search" />} />} />
            </Center>

            <Center h = "87%">

                <ScrollView w="85%" alignSelf="center" py="2" horizontal={true}>
                    <Flex flexDirection="row">
                        {tags.map((item) => {
                            return (
                                <Pressable onPress={() => {
                                    setTag(item.value)
                                    fetchTagResults(item.value.toLowerCase())
                                }} >
                                    <Badge key={item.value} px="2" mx="1" variant="ghost" rounded="xl" _text={{fontSize:13, color: item.value === tag ? 'white' : colorMode === "dark" ? "white" : "black" }} backgroundColor={ item.value === tag ? '#59DBB7' : colorMode === "dark" ? "gray.900" : "white" }>{item.value}</Badge>
                                </Pressable>
                            )
                        })}
                    </Flex>
                </ScrollView>

                <ScrollView maxW="3000" width="100%" _contentContainerStyle={{ minW: "72" }}>

                    <View alignSelf="center" w="100%" >
                        <Recomendations recomender={fetchRecomendations} colorMode={colorMode} navigation={navigation} updater={setUpdateVal} likes={userLikes.length} Recomendation={Recomendation}/>
                    </View>

                    {recipe.slice(0,10).map(recipe => {return (
                    <Pressable onPress={() => {
                        navigation.navigate('recipe', recipe)}}
                        key={recipe.recipe_id}>
                        <Recipe updater={setUpdateVal} recomender={fetchRecomendations} item={recipe} />
                    </Pressable>
                    )})}
                </ScrollView>
            </Center>
        </View>
    )
  }