import {
  AppRegistry,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  processColor,
  FlatList,
  StatusBar
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context';
import {Logo} from "../assets"
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; 
import {useNavigation, useRoute} from "@react-navigation/native";
import { Card, Button} from "@rneui/themed";
import { useFonts } from "expo-font";
// import { LineChart } from "react-native-chart-kit";
import {BarChart, LineChart} from "react-native-gifted-charts";
// import {LineChart} from "react-native-charts-wrapper";
// import {LineChart, AreaChart, BarChart, Grid} from "react-native-svg-charts";

// import {Avatar, Card} from "react-native-paper";

import {Dimensions} from "react-native";
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import { create } from "@mui/material/styles/createTransitions";
import { color } from "@rneui/base";
import { AppContext } from "../context/AppContext";
// import CircularProgress from "react-native-circular-progress-indicator";
import {DashedCircularIndicator} from "rn-dashed-circular-indicator";
// import Animated from "react-native-reanimated";

const screenWidth = 220;




function getCurrentDate() {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  // Thêm số 0 vào trước nếu cần thiết
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }

  // Định dạng theo yyyy-mm-dd
  const formattedDate = year + "-" + month + "-" + day;

  return formattedDate;
}


const formatDateTime=(timestamp)=>{
    var date = new Date(timestamp)
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var day = "0" + date.getDate();
    var month = "0" + (date.getMonth() + 1);
    var year = date.getFullYear();

    var formattedTime = hours + ':' + minutes.substr(-2);
    var formattedDate = day.substr(-2) + '/' + month.substr(-2) + '/' + year;

    return formattedTime + ' ' + formattedDate;
}



const HomeScreen = ({navigation}) => {

  const {showData}=useContext(AppContext);

  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    if (showData) {
      setisLoading(false);
    }
  }, [showData]);

  return (
    <View className="bg-white flex-1">
      <SafeAreaView>
        {/* <View className="w-full flex-row items-center justify-between px-4 py-2 ">
          <TouchableOpacity className="w-12 h-12 rounded-full flex items-center justify-center">
            <Image source={Logo} className="w-12 h-12" resizeMode="cover" />
          </TouchableOpacity>
          <Text className="pl-3 text-primaryText text-xl font-semibold">
            Device
          </Text>
          <TouchableOpacity className="w-12 h-12 rounded-full border flex items-center justify-center">
            <Image
              source={{
                uri: "https://t3.ftcdn.net/jpg/05/17/79/88/360_F_517798849_WuXhHTpg2djTbfNf0FQAjzFEoluHpnct.jpg",
              }}
              className="w-12 h-12"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View> */}
        <View className="w-full">
          <View className="w-full flex-row items-center justify-between px-4">
            <Text className="text-primaryText text-base font-semibold pb-2">
              Informations
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("AddToChat")}>
              <FontAwesome name="th-list" size={28} color="#555" />
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <View className="w-full flex items-center justify-center justify-between">
              <ActivityIndicator size={"large"} color={"#60a5fa"} />
            </View>
          ) : (
            <>
              {/* <View className="w-full" style={styles.card}>
                <View className="justify-center z-10 "
                  // style={{marginRight: -38}}
                >
                <Text>PIN</Text>
                </View>
              </View> */}
              {/* <CircularProgress value={58} /> */}
              {/* <Animated.View
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: "violet",
                }}
              /> */}
              <View className="flex justify-between items-center pt-4 pb-10">
                <DashedCircularIndicator
                  selectedValue={76}
                  maxValue={100}
                  radius={125}
                  textColor="#0f4fff"
                  activeStrokeColor="#0f4fff"
                  withGradient
                  label={"Battery"}
                />
              </View>
              <View className="flex justify-between items-center flex-row pl-4 pb-4 ">
                <AQIComponent showData={showData} type={1} />
                <AQIComponent showData={showData} type={2} />
              </View>
              {/* <View>
                <AQIChart
                  temperature={[...temperature]}
                  humidity={[...humidity]}
                />
              </View> */}
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
  // return (
  //   <View style={{flex: 1, backgroundColor: "white"}}>
  //     <SafeAreaView>
  //       <StatusBar backgroundColor="white" barStyle="dark-content" />
  //       <View style={styles.header}>
  //         <View style={{flex: 1, justifyContent: "center"}}>
  //           <Text style={styles.headerTextNormal}>Choose your</Text>
  //           <Text style={styles.headerTextBold}>HOME</Text>
  //         </View>
  //         <Image style={{width: 60, height: 60}} source={Logo} />
  //       </View>
  //       <Text style={styles.sectionHeaderText}>Category</Text>
  //     </SafeAreaView>
  //   </View>
  // );
};

  const AQIComponent = ({showData,type}) => {
    return (
      <View
        className="items-center justify-center bg-slate-100"
        style={styles.card}
      >
        <View className="items-center justify-between">
          {/* Icon */}
          <View className="h-16 justify-center">
            {type == 1 ? (
              <FontAwesome5 name="thermometer-half" size={30} color="#0176D3" />
            ) : (
              <Ionicons name="water" size={30} color="#0176D3" />
            )}
          </View>
          {/* Show data */}
          <View className="flex-row pb-1">
            <View className="items-center justify-center">
              <Text
                className="flex text-primaryText text-4xl font-bold justify-between"
              >
                {type == 1 ? showData.temperature : showData.humidity}
              </Text>
            </View>
            <View className="justify-center">
              {type == 1 ? (
                <MaterialCommunityIcons
                  name="temperature-celsius"
                  size={40}
                  color="black"
                />
              ) : (
                <View className="pl-1">
                  <FontAwesome
                    name="percent"
                    className="ml-px"
                    size={30}
                    color="black"
                  />
                </View>
              )}
            </View>
          </View>
          {/* Label */}
          <Text
            className="h-10 text-primaryText text-lg font-semibold justify-center"
            style={{color: "#0176D3"}}
          >
            {type == 1 ? "Temperature" : "Humidity"}
          </Text>
        </View>
      </View>
    );
  };

  const AQIChart=({temperature,humidity})=>{
    return (
      <View className="flex justify-center">
        <LineChart
          maxValue={70}
          onlyPositive={true}
          data={temperature}
          data2={humidity}
          height={250}
          yAxisOffset={34}
          // yAxisLabelTexts={[34, "$250", "$500", "$750"]}
          // noOfSections={2}
          // width={Dimensions.get("window").width}
          width={280}
          showVerticalLines
          spacing={40}
          initialSpacing={10}
          color1="skyblue"
          color2="orange"
          textColor1="green"
          dataPointsHeight={6}
          dataPointsWidth={6}
          dataPointsColor1="blue"
          dataPointsColor2="red"
          // textShiftY={-2}
          // textShiftX={-5}
          textFontSize={13}
          onFocusEnabled
          scrollToEnd
          // interpolateMissingValues={false}
          fromZeroValues={false}
        />
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
      marginRight: 15,
      marginTop: 10,
      marginBottom: 20
      
    },
    container: {
      flex: 1,
      backgroundColor: "#F5FCFF",
    },
    chart: {
      flex: 1,
    },
  });

export default HomeScreen