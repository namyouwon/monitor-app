import {View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Button,StyleSheet, Dimensions} from "react-native";
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context';
import {Logo} from "../assets"
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import { Switch } from "react-native-switch";
import Modal from "react-native-modal";

const fullWidth = Dimensions.get("window").width;

const handleButton = async (relay, status) => {
  var payload;
  if (relay == 2) {
    if (status === "OFF") payload = "og==";
    else payload = "sg==";
  } else if (relay == 3) {
    if (status === "OFF") payload = "ow==";
    else payload = "sw==";
  }

  try {
    const requestData = {
      downlinks: [
        {
          f_port: 1,
          frm_payload: payload,
        },
      ],
    };

    const response = await fetch(
      "https://eu1.cloud.thethings.network/api/v3/as/applications/test-atom-eu1/devices/node-05-04-otta/down/replace",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer NNSXS.PAMWVMNQ6WJZ5LBZYUI77YIUGCLWK6HPO2LC6MQ.KVTF3JWV5KMTIRBKAIIANKXQXRWM5DXFVPHJS5ZPXFK75OQRQGCQ`,
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("API Error:", error);
  }
};

const Control = () => {
    const navigation = useNavigation();
    const [isLoading, setisLoading] = useState(false);

    const [isLoadingRelay, setisLoadingRelay] = useState(false);
    const [Relay1, setRelay1] = useState(false);
    const [Relay2, setRelay2] = useState(false);
    const [Relay3, setRelay3] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const q = query(collection(firestoreDB, "relay"));
    const unsuscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "modified") {
            // setRelay1(change.doc.data().RL1);
            setRelay2(change.doc.data().RL2);
            setRelay3(change.doc.data().RL3);
            setisLoadingRelay(false);
            clearTimeout(timeoutId);
          } else {
            setRelay1(change.doc.data().RL1);
            setRelay2(change.doc.data().RL2);
            setRelay3(change.doc.data().RL3);
          }
        });
        return () => {
          unsuscribe();
        };
      },
      []
    );

   

  return (
    <View className="bg-white flex-1">
      <Modal
        isVisible={isLoadingRelay}
        coverScreen={false}
        deviceWidth={fullWidth}
        deviceHeight={618}
      >
        <View className="w-full flex items-center justify-center justify-between">
          <ActivityIndicator size={"large"} color={"white"} />
          <Text className="text-2xl text-base text-white">
            Button is loading ....
          </Text>
        </View>
      </Modal>
      <SafeAreaView>
        <View className="w-full flex-row items-center justify-between px-4 py-2 ">
          <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
          <Text className="py-2 text-primaryText text-xl font-semibold">
            Device 1
          </Text>
          <TouchableOpacity className="w-12 h-12 rounded-full border flex items-center justify-center">
            <Image
              source={{
                uri: "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp",
              }}
              className="w-12 h-12"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        <ScrollView className="w-full px-4 pt-4">
          <View className="w-full">
            <View className="w-full flex-row items-center justify-between px-2">
              <Text className="text-primaryText text-base font-semibold pb-2">
                Relays
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AddToChat")}
              >
                <FontAwesome name="th-list" size={28} color="#555" />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <View className="w-full flex items-center justify-center">
                <ActivityIndicator size={"large"} color={"#43C651"} />
              </View>
            ) : (
              <>
                <View className="flex-row ">
                  <View
                    className="items-center justify-center bg-slate-100"
                    style={styles.card}
                  >
                    <Text className="flex text-primaryText text-2xl font-bold justify-between py-4">
                      Relay 2
                    </Text>
                    <View className="pb-4">
                      <Switch
                        value={Relay2}
                        onValueChange={() => {
                          setisLoadingRelay(true);
                          Relay2
                            ? handleButton(2, "OFF")
                            : handleButton(2, "ON");
                          const id = setTimeout(() => {
                            setisLoadingRelay(false);
                          }, 10000);
                          setTimeoutId(id);
                        }}
                        inActiveText={"Off"}
                        circleSize={50}
                        circleBorderWidth={2}
                        backgroundActive={"green"}
                        backgroundInactive={"gray"}
                        changeValueImmediately={true}
                        innerCircleStyle={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        outerCircleStyle={{}}
                        renderActiveText={true}
                        renderInActiveText={true}
                        switchLeftPx={3}
                        switchRightPx={3}
                        switchBorderRadius={30}
                      />
                    </View>
                  </View>
                  {/* Relay3 */}
                  <View
                    className="items-center justify-center bg-slate-100"
                    style={styles.card}
                  >
                    <Text className="flex text-primaryText text-2xl font-bold justify-between py-4">
                      Relay 3
                    </Text>
                    <View className="pb-4">
                      <Switch
                        value={Relay3}
                        onValueChange={() => {
                          setisLoadingRelay(true);
                          Relay3
                            ? handleButton(3, "OFF")
                            : handleButton(3, "ON");
                          const id = setTimeout(() => {
                            setisLoadingRelay(false);
                          }, 10000);
                          setTimeoutId(id);
                        }}
                        inActiveText={"Off"}
                        circleSize={50}
                        circleBorderWidth={2}
                        backgroundActive={"green"}
                        backgroundInactive={"gray"}
                        changeValueImmediately={true}
                        innerCircleStyle={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        outerCircleStyle={{}}
                        renderActiveText={true}
                        renderInActiveText={true}
                        switchLeftPx={3}
                        switchRightPx={3}
                        switchBorderRadius={30}
                      />
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    elevation: 3,
    width: 150,
    // backgroundColor: "#a2e4fc",
    shadowOffset: {width: 1, height: 1},
    shadowColor: "#333",
    shadowOpacity: 2,
    // shadowRadius: 2,
    // borderColor: "#77A7FF", // Màu viền xanh
    // borderWidth: 2, // Độ dày của viền
    marginRight: 35,
    marginTop: 10,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  chart: {
    flex: 1,
  },
});
export default Control