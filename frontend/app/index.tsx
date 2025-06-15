import {
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "./styles/global";
import { useEffect } from "react";
import axios from "axios";
import { getVendorId } from "../helper";
import Constants from "expo-constants";

const NODE_URL = "https://featureform-hacks.onrender.com/api";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const create_user = async () => {
            const idfv = await getVendorId();
            axios
                .post(`${NODE_URL}/user`, { idfv })
                .then((response) => {
                    // console.log(response.data)
                })
                .catch((error) => console.error("Error fetching data:", error));
        };

        create_user();
    }, []);

    return (
        <View style={styles.container}>
            {/* <Image
                source={require("../assets/images/logo.png")}
                style={{
                    width: 160,
                    height: 160,
                    alignSelf: "center",
                    marginBottom: 20,
                    borderRadius: 32,
                }}
                resizeMode="contain"
            /> */}
            <View style={styles.buttonContainer}>
                <View style={styles.spacer} />
                <TouchableOpacity
                    style={{
                        width: "100%",
                        height: "80%",
                        backgroundColor: "#4A90E2",
                        borderRadius: 10,
                        marginBottom: 10,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={() => router.push("/home")}
                >
                    <Text
                        style={{
                            color: "#2a5382",
                            fontSize: 60,
                            fontWeight: "bold",
                            textShadowColor: "rgba(0, 0, 0, 0.3)",
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 4,
                        }}
                    >
                        NETWORK
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width: "100%",
                        height: "20%",
                        backgroundColor: "#50C878",
                        borderRadius: 10,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={() => router.push("/onboarding")}
                >
                    <Text
                        style={{
                            color: "#388c54",
                            fontSize: 60,
                            fontWeight: "bold",
                            textShadowColor: "rgba(0, 0, 0, 0.3)",
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 4,
                        }}
                    >
                        PROFILE
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 20,
        paddingTop: 100,
        paddingBottom: 200,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
        fontWeight: "bold",
        color: "white",
    },
    buttonContainer: {
        width: "100%",
    },
    spacer: {
        height: 20,
    },
});
