import { FC, memo } from "react";
import { StyleSheet, Text, View } from "react-native";

type ChatResponseProps = {
    response: string;
}

const ChatResponse: FC<ChatResponseProps> = ({ response }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>{response}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    message: {
        fontSize: 14,
    },
    container: {
        paddingVertical: 2,
    },
});

export default memo(ChatResponse);
