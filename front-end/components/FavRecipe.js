import { Center, HStack, Text, Icon, IconButton, Image, VStack, AspectRatio, useColorMode } from 'native-base';
import { Ionicons } from "@expo/vector-icons"

export default function FavRecipe(props) {
    const {
      colorMode,
      toggleColorMode
    } = useColorMode();

    return(
        <Center backgroundColor={colorMode === "dark" ? "gray.900" : "white"} mx="6" my="2" px="2" borderRadius="10" shadow="1">
            <HStack space="3" justifyContent="space-around" alignItems="center" flex="1" >
                <AspectRatio w="20%" ratio={2 / 1.3}>
                <Image borderRadius="10" source={{
                uri: props.item.image_url}} alt="image" />
                </AspectRatio>
              <Text width="65%"> { props.item.recipe_name } </Text>
              <VStack>
                <Text></Text>
                <Text></Text>
                <IconButton icon={<Icon as={<Ionicons name="heart" />} />} borderRadius="full" _icon={{
                    color: "#59DBB7",
                    size: "sm"
                    }} _hover={{
                    bg: "black:alpha.10"
                    }} _pressed={{
                    bg: "black:alpha.10",
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
                    onPress={() => {  }}/>
              </VStack>
            </HStack>
        </Center>
    )
}