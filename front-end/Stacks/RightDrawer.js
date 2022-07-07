import { ScrollView, Text, View, useColorMode, Link, Button, AlertDialog } from 'native-base';
import React, {useState, useEffect} from 'react';
import Ingredient from '../components/Ingredient'
const Env = require('../Env/EvnVariables')
const storesList = require('../src/data/stores.json')

export default function RightDrawer(props) {
    const {
      colorMode,
      toggleColorMode
    } = useColorMode();

    const [ingredient, setIngredients] = useState([]);

    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = React.useRef(null);

    const GetRecipes = () => {
        fetch(`${Env.default.ip}/ingredients`)
        .then(response => response.json())
        .then((data) => {
            setIngredients(data.splice(15,20));
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
                <View  m="5">

                <Button mr="3" alignSelf="center" w="90%" backgroundColor="#59DBB7" onPress={() => setIsOpen(!isOpen)}>
                Find a Store
                </Button>
                
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                    <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Find a Store</AlertDialog.Header>
                    <AlertDialog.Body>
                    {storesList.map((item) => (
                            <View>
                                <Text>{item.name}</Text>
                                <Link _text={{ color: "#59DBB7" }} href={item.url}>
                                    {item.adress}
                                </Link>
                            </View>
                            ))}
                    </AlertDialog.Body>
                    </AlertDialog.Content>
                </AlertDialog>

                </View>
            </ScrollView>
        </View>
    );
}