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
import React, { useEffect, useRef, useState } from 'react'
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



const HomeScreen = ({showData}) => {
  // const startOfDay = new Date();
  // startOfDay.setHours(0, 0, 0, 0);
  console.log(formatDateTime(1710732569000));
  const startOfDay = new Date("2024-03-18");
  startOfDay.setHours(0, 0, 0, 0);
  console.log(showData);
  const [temperature, settemperature] = useState([]);
  const [humidity, sethumidity] = useState([]);
  // const [showData, setshowData] = useState();
  const [lastPoint, setlastPoint] = useState(startOfDay.getTime());
  console.log(3);

  ///{value:null, datapoint:}//////////////////////////////////
  //            INIT
  ///////////////////////////////////////////

  // useEffect(() => {
  //   // const fetchData = async () => {
  //     console.log("FB run");
  //     const q = query(
  //       collection(firestoreDB, getCurrentDate()),
  //       orderBy("timeBySecond", "asc"),
  //       where("timeBySecond", ">=", startOfDay.getTime())
  //     );
  //     getDocs(q).then((querySnapshot) => {
  //       var tempArray = temperature;
  //       var humiArray = humidity;
  //       var lastPointTemp = lastPoint;
  //       var showDataTemp = showData;
  //       querySnapshot.forEach((doc) => {
  //         /////// 1p-60000
  //         //////  1d-864000000

  //         while (lastPointTemp < doc.data().timeBySecond) {
  //           if (doc.data().timeBySecond - lastPointTemp < 900000) {
  //             // console.log("point value//////////////////");
  //             tempArray.push({
  //               value: doc.data().temperature,
  //               dataPointText: String(doc.data().temperature),
  //             });
  //             humiArray.push({
  //               value: doc.data().humidity,
  //               dataPointText: String(doc.data().humidity),
  //             });
  //             showDataTemp = doc.data();
  //             lastPointTemp = doc.data().timeBySecond;
  //           } else {
  //             // console.log("point null");
  //             tempArray.push({
  //               value: null,
  //             });
  //             humiArray.push({
  //               value: null,
  //             });
  //             lastPointTemp = lastPointTemp + 600000;
  //           }
  //           // console.log(lastPointTemp);
  //         }
  //       });
  //       // set useState
  //       settemperature(tempArray);
  //       sethumidity(humiArray);
  //       setshowData(showDataTemp);
  //       setlastPoint(lastPointTemp);
  //     });
  //   // };
  //   // fetchData();
  // }, []);

  // useEffect(() => {
  //   let isFirstLoad = true;
  //   console.log('Get data');
  //   const q = query(
  //     // collection(firestoreDB, getCurrentDate()),
  //     collection(firestoreDB, "2024-03-18"),
  //     orderBy("timeBySecond", "asc"),
  //     where("timeBySecond", ">=", startOfDay.getTime())
  //   );
  //   const unsuscribe = onSnapshot(q, (snapshot) => {
  //     var tempArray = temperature;
  //     var humiArray = humidity;
  //     var lastPointTemp = lastPoint;
  //     var showDataTemp = showData;
  //     // console.log(lastPointTemp);
  //     snapshot.docChanges().forEach((change) => {
  //       if (change.type === "added" && !isFirstLoad) {
  //         while (lastPointTemp < change.doc.data().timeBySecond) {
  //           if (change.doc.data().timeBySecond - lastPointTemp < 900000) {
  //             // console.log("point value//////////////////");
  //             tempArray.push({
  //               value: change.doc.data().temperature,
  //               dataPointText: String(change.doc.data().temperature),
  //             });
  //             humiArray.push({
  //               value: change.doc.data().humidity,
  //               dataPointText: String(change.doc.data().humidity),
  //             });
  //             showDataTemp = change.doc.data();
  //             lastPointTemp = change.doc.data().timeBySecond;
  //           } else {
  //             // console.log("point null");
  //             tempArray.push({
  //               value: null,
  //             });
  //             humiArray.push({
  //               value: null,
  //             });
  //             lastPointTemp = lastPointTemp + 600000;
  //           }
  //         }
  //       }
  //       else if (isFirstLoad) {
  //         while (lastPointTemp < change.doc.data().timeBySecond) {
  //           if (change.doc.data().timeBySecond - lastPointTemp < 900000) {
  //             // console.log("point value//////////////////");
  //             tempArray.push({
  //               value: change.doc.data().temperature,
  //               dataPointText: String(change.doc.data().temperature),
  //             });
  //             humiArray.push({
  //               value: change.doc.data().humidity,
  //               dataPointText: String(change.doc.data().humidity),
  //             });
  //             showDataTemp = change.doc.data();
  //             lastPointTemp = change.doc.data().timeBySecond;
  //           } else {
  //             // console.log("point null");
  //             tempArray.push({
  //               value: null,
  //             });
  //             humiArray.push({
  //               value: null,
  //             });
  //             lastPointTemp = lastPointTemp + 600000;
  //           }
  //         }
  //       }
  //     });
  //     ///set state
  //     settemperature(tempArray);
  //     sethumidity(humiArray);
  //     setshowData(showDataTemp);
  //     setlastPoint(lastPointTemp);
  //     isFirstLoad = false;
  //   });
  //   return () => {
  //     unsuscribe();
  //   };
  // }, []);

  // useEffect(() => {
  //   setshowData({
  //     createAt: {nanoseconds: 712867000, seconds: 1710745256},
  //     device: "unit-c-otaa-demo",
  //     humidity: 99.1,
  //     temperature: 100,
  //     timeBySecond: 1710745256000,
  //   });
  //   settemperature([
  //     {value: 34, dataPointText: "0"},
  //     {value: 35, dataPointText: "10"},
  //     {value: 34, dataPointText: "8"},
  //     {value: 58, dataPointText: "58"},
  //     {value: 56, dataPointText: "56"},
  //     {value: 78, dataPointText: "78"},
  //     {value: 74, dataPointText: "74"},
  //     {value: 98, dataPointText: "98"},
  //   ]);
  //   // const interval = setInterval(() => {
  //   //   // Thêm một phần tử vào cuối mảng
  //   //   console.log('Run time');
  //   //   settemperature((temperature) => [
  //   //     ...temperature,
  //   //     {
  //   //       value: null,
  //   //     },
  //   //   ]);
  //   // }, 6000); // 600000 milliseconds = 10 minutes

  //   // return () => clearInterval(interval);
  // }, []);

  // const user = useSelector((state) => state.user.user);
  // const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(false);
  const data = [
    {x: 1, y: 10},
    {x: 2, y: 20},
    {x: 3, y: 15},
    {x: 4, y: 25},
    {x: 5, y: 30},
  ];
  // const [loaded]=useFonts({
  //   WorkSans_Bold:require('../assets/fonts/WorkSans-SemiBold.ttf')
  // });
  // if(!loaded){
  //   return null;
  // }

  return (
    <View className="bg-white flex-1">
      <SafeAreaView>
        <View className="w-full flex-row items-center justify-between px-4 py-2 ">
          <TouchableOpacity className="w-12 h-12 rounded-full flex items-center justify-center">
            <Image source={Logo} className="w-12 h-12" resizeMode="cover" />
          </TouchableOpacity>
          <Text className="pl-3 text-primaryText text-xl font-semibold">
            Device
          </Text>
          {/* <Text className="text-primaryText text-3xl font-semibold">
            verlyn
          </Text> */}
          <TouchableOpacity className="w-12 h-12 rounded-full border flex items-center justify-center">
            <Image
              source={{
                uri: "https://t3.ftcdn.net/jpg/05/17/79/88/360_F_517798849_WuXhHTpg2djTbfNf0FQAjzFEoluHpnct.jpg",
              }}
              className="w-12 h-12"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        {/* <View className="w-full flex-row items-center px-4 py-2 ">
          <Text className="text-primaryText text-3xl font-semibold">
            Station Home
          </Text>
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
            <View className="w-full flex items-center justify-center">
              <ActivityIndicator size={"large"} color={"#43C651"} />
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