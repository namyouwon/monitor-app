import {View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Button,StyleSheet} from "react-native";
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context';
import {Logo} from "../assets"
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";




const Control = () => {
    const user = useSelector((state) => state.user.user);
    const navigation = useNavigation();
    const [isLoading, setisLoading] = useState(false);

    const handleButton= async()=>{
      try {
        const requestData = {
          downlinks: [
            {
              f_port: 1,
              frm_payload: "og=="
            },
          ],
        };

        const response = await fetch(
          "https://eu1.cloud.thethings.network/api/v3/as/applications/test-atom-eu1/devices/unit-c-otaa-demo/down/push",
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
    }

  return (
    <View className="bg-white flex-1">
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
                <View>
                  <TouchableOpacity
                    onPress={handleButton}
                    className="w-full px-4 py-2 rounded-xl bg-sky-500/100 my-3 flex items-center justify-center"
                  >
                    <Text className="py-2 text-xl font-semibold">Relay 1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="w-full px-4 py-2 rounded-xl bg-sky-500/100 my-3 flex items-center justify-center">
                    <Text className="py-2 text-xl font-semibold">Relay 2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="w-full px-4 py-2 rounded-xl bg-sky-500/100 my-3 flex items-center justify-center">
                    <Text className="py-2 text-xl font-semibold">Relay 3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="w-full px-4 py-2 rounded-xl bg-sky-500/100 my-3 flex items-center justify-center">
                    <Text className="py-2 text-xl font-semibold">Relay 4</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default Control