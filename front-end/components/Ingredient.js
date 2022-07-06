import { Center, Text } from 'native-base';

export default function RightDrawer(props) {
    return (
        <Center my="1" ml="5" mr="8" py="1" backgroundColor="rgba(89, 219, 183, 0.11)" borderWidth=".4" borderRadius="10" borderColor="#59DBB7">
            <Text fontSize="lg">
                {props.item.ingredient_name}
            </Text>
        </Center>
    );
}