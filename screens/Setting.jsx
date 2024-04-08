import { View, Text,Image, TouchableOpacity,ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import {useNavigation} from "@react-navigation/native";
import {useDispatch} from "react-redux";
import {firebaseAuth, firestoreDB} from "../config/firebase.config";
import {SET_USER_NULL} from "../context/actions/userAction";
import Modal from "react-native-modal";
import {Switch} from "react-native-switch";
import { useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
// import { ActivityIndicator } from 'react-native-web';
import {Dimensions} from "react-native";
import {ListItem} from "react-native-elements";
// import notifee from "@notifee/react-native";

const fullWidth = Dimensions.get("window").width;

const handleButton = async (relay,status) => {
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

const Setting = () => {
  const [isLoadingRelay, setisLoadingRelay] = useState(false);
  const [Relay1, setRelay1] = useState(false);
  const [Relay2, setRelay2] = useState(false);
  const [Relay3, setRelay3] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const q = query(
    collection(firestoreDB, "relay")
  );
  const unsuscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        // setRelay1(change.doc.data().RL1);
        setRelay2(change.doc.data().RL2);
        setRelay3(change.doc.data().RL3);
        setisLoadingRelay(false);
        clearTimeout(timeoutId);
      }
      else{
        setRelay1(change.doc.data().RL1);
        setRelay2(change.doc.data().RL2);
        setRelay3(change.doc.data().RL3);
      }
    })
    return () => {
      unsuscribe();
    };
  },[]);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const Logout = async () => {
    await firebaseAuth.signOut().then(() => {
      dispatch(SET_USER_NULL());
      navigation.navigate("Login");
    });
  };
   

  return (
    <View className="flex-1">
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
      <View className="w-full bg-sky-500/100 px-4 py-8 flex-[0.2] "></View>
      <View className="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] rounded-b-[50px] -mt-20">
        <View className="w-full px-4 py-4">
          {/* <View className="w-full px-4 flex-row items-center justify-between py-3 rounded-xl border border-gray-200 space-x-3"> */}
          {/* <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="w-12 h-12 rounded-full border-2 items-center justify-center border-red-400"
              style={{shadowOpacity: 2}}
              onPress={() => onDisplayNotification()}
            >
              <View style={{shadowOpacity: 0}}>
                <Ionicons name="power-outline" size={30} color="red" />
              </View>
            </TouchableOpacity>
          </View> */}
          <TouchableOpacity onPress={Logout}>
            <MaterialIcons name="logout" size={24} color="black" />
          </TouchableOpacity>
          {/* Relay1 */}
          {/* <View className="py-10">
            <Switch
              value={Relay1}
              disabled={true}
              onValueChange={() => {
                setisLoadingRelay(true);
                Relay1 ? handleButton(1,"OFF") : handleButton(1,"ON");
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
          </View> */}
          {/* Relay2 */}

          <View className="py-10">
            <Switch
              value={Relay2}
              onValueChange={() => {
                setisLoadingRelay(true);
                Relay2 ? handleButton(2, "OFF") : handleButton(2, "ON");
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
          {/* Relay3 */}
          <View className="py-10">
            <Switch
              value={Relay3}
              onValueChange={() => {
                setisLoadingRelay(true);
                Relay3 ? handleButton(3, "OFF") : handleButton(3, "ON");
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
    </View>
  );
}

export default Setting