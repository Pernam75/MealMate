import { Text, View, Box, Center, Heading, IconButton, AspectRatio, Divider, Image, Icon, HStack, Badge, ZStack, ScrollView, useColorMode, Flex } from 'native-base';
import { Octicons, MaterialCommunityIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import React, {useState, useEffect, useContext} from 'react';
const Env = require('../Env/EvnVariables')
import axios from 'axios';
import { AuthContext } from '../Contexts/AuthContext'
import { DevSettings } from 'react-native';

export default function RecipeScreen({navigation, route}) {
    const {
        colorMode,
        toggleColorMode
    } = useColorMode();
    
    const {userLikes, userInfo, updateLikes} = useContext(AuthContext)
    const [Likes, setLikes] = useState([]);

    function sendLike(id_user, id_recipe) {
      axios.post(`${Env.default.ip}/like`,{ id_user, id_recipe })
      .then(res =>{
        console.log(res.data)})
    }

    const [recipeIngredient, setRecipeIngredient] = useState([]);
    const [recipeIstruction, setRecipeIstruction] = useState([]);
    const [recipeTags, setRecipeTags] = useState([]);

    useEffect(() => {
        setRecipeIngredient(route.params.ingredients)
        setRecipeIstruction(route.params.steps)
        setRecipeTags(route.params.tags)
    },[])
    return(
        <View backgroundColor={colorMode === "dark" ? "black" : "coolGray.100"} flex="1">
            <ZStack>
                <AspectRatio w="100%" ratio={16 / 10}>
                <Image borderRadius="25" source={{
                uri: route.params.image}} alt="image" />
                </AspectRatio>
                <HStack space="73%" alignItems="center" px="3"  pt="7" pb="1" borderRadius="15">
                    <IconButton backgroundColor={colorMode === "dark" ? "black:alpha.70" : "white:alpha.70"} icon={<Icon as={<Ionicons name="close-outline" />} />} borderRadius="15" _icon={{
                                color: colorMode === "dark" ? "white" : "black",
                                size: "xl"
                            }} _hover={{
                                bg: colorMode === "dark" ? "black" : "white"
                            }} _pressed={{
                                bg: colorMode === "dark" ? "black" : "white",
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
                            onPress={() => { navigation.navigate('List') }}/>
                    <IconButton backgroundColor={colorMode === "dark" ? "black:alpha.70" : "white:alpha.70"} icon={<Icon as={<Ionicons name="heart" />} />} borderRadius="15" _icon={{
                                color: userLikes.includes(route.params.recipe_id) === true ? "#59DBB7" : colorMode === "dark" ? "white" : "black",
                                size: "xl"
                            }} _hover={{
                                bg: colorMode === "dark" ? "black" : "white"
                            }} _pressed={{
                                bg: colorMode === "dark" ? "black" : "white",
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
                            onPress={() => { console.log(`liked recipe ${route.params.recipe_id + ' ' + route.params.name}`) 
                                sendLike(userInfo.id_user, route.params.recipe_id)
                                userLikes.push(route.params.recipe_id)
                                updateLikes(userLikes)
                                setLikes(userLikes)
                            }}/>
                </HStack>
            </ZStack>

            <ScrollView alignSelf="center" width="90%" borderRadius="15" p="5" backgroundColor={colorMode === "dark" ? "gray.900" : "white"} mt="50%" >
                <View>
                    <Text fontSize="xl" fontWeight="bold">{route.params.name}</Text>
                    <HStack mt="3" space={3} justifyContent="space-around">
                    <Badge width="30%" color="black" variant="outline" rounded="xl" >{route.params.nutrition.calories + ' Kcal'}</Badge>
                    <Badge width="30%" color="black" variant="outline" rounded="xl" >{route.params.nutrition.sugar + 'g sugar'}</Badge>
                    <Badge width="30%" color="black" variant="outline" rounded="xl" >{route.params.tags[5]}</Badge>
                    </HStack>
                    <Divider alignSelf="center" bg="#59DBB7" mx="4" my="5" thickness="2" width="75%" self />
                    <Text fontSize="lg" mb="3" fontWeight="bold" italic>Ingredients   for {route.params.servings}</Text>
                    {recipeIngredient.map((recipeIngredient, index) => {return <Text fontSize="md" key={index}> • {recipeIngredient.quantity + recipeIngredient.name}</Text>})}
                    <Divider alignSelf="center" bg="#59DBB7" mx="4" my="5" thickness="2" width="75%" self  />
                    <Text fontSize="lg" mb="3" fontWeight="bold" italic>Instructions</Text>
                    {recipeIstruction.map((recipeIstruction, index) => {return <Text fontSize="md" key={index}> • {recipeIstruction}</Text>})}
                    <Divider alignSelf="center" bg="#59DBB7" mx="4" my="5" thickness="2" width="75%" self  />
                    <Text fontSize="lg" mb="3" fontWeight="bold" italic>Tags</Text>
                    <Flex mb="6" flexDirection="row" flexWrap="wrap">
                        {recipeTags.map((recipeTags, index) => {return <Badge m="1" key={index} width="30%" color="black" variant="outline" rounded="xl" >{recipeTags}</Badge>})}
                    </Flex>
                </View>
            </ScrollView>
        </View>
    )
}