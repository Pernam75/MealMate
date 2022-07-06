import { ScrollView, Text, View, useColorMode } from 'native-base';
import React, {useState, useEffect} from 'react';
import Ingredient from '../components/Ingredient'
const Env = require('../Env/EvnVariables')

export default function RightDrawer(props) {
    const {
      colorMode,
      toggleColorMode
    } = useColorMode();

    const [ingredient, setIngredients] = useState([]);

    const GetRecipes = () => {
        fetch(`${Env.default.ip}/ingredients`)
        .then(response => response.json())
        .then((data) => {
            setIngredients(data.splice(0,25));
        })
        .catch((error) => console.log(error.message))
    }

    useEffect(() => {
        GetRecipes()
    },[])
    return (        
        <View backgroundColor={colorMode === "dark" ? "black" : "coolGray.100"} flex="1">
            <View alignItems="center" pt="50">
                <Text pb="5" fontSize="2xl">Short List</Text>
            </View>
            <ScrollView maxW="3000" width="100%" _contentContainerStyle={{ minW: "72" }}>
                {ingredient.map(ingredient => {return <Ingredient key={ingredient.id_ingredient} item={ingredient}/>})}
            </ScrollView>
        </View>
    );
}