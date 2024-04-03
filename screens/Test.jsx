import React, {useEffect, useState} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {AntDesign, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {firestoreDB} from "../config/firebase.config";
import HomeScreen from "./HomeScreen";
import Control from "./Control";
import Chart from "./Chart";

const Tab = createBottomTabNavigator();

const Test = () => {
  const startOfDay = new Date("2024-03-18");
  startOfDay.setHours(0, 0, 0, 0);
  const [temperature, settemperature] = useState([]);
  const [humidity, sethumidity] = useState([]);
  const [showData, setshowData] = useState({});
  const [lastPoint, setlastPoint] = useState(startOfDay.getTime());
  useEffect(() => {
    let isFirstLoad = true;
    console.log("Get dataa");
    const q = query(
      // collection(firestoreDB, getCurrentDate()),
      collection(firestoreDB, "2024-03-18"),
      orderBy("timeBySecond", "asc"),
      where("timeBySecond", ">=", startOfDay.getTime())
    );
    const unsuscribe = onSnapshot(q, (snapshot) => {
      var tempArray = temperature;
      var humiArray = humidity;
      var lastPointTemp = lastPoint;
      var showDataTemp = showData;
      // console.log(lastPointTemp);
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && !isFirstLoad) {
          console.log("New record");
          while (lastPointTemp < change.doc.data().timeBySecond) {
            if (change.doc.data().timeBySecond - lastPointTemp < 900000) {
              // console.log("point value//////////////////");
              // if(change.doc.data().timeBySecond%3600000<=300000){
              tempArray.push({
                value: change.doc.data().temperature,
                dataPointText: String(change.doc.data().temperature),
                label: "13",
              });
              // }
              // else{
              //   tempArray.push({
              //     value: change.doc.data().temperature,
              //     dataPointText: String(change.doc.data().temperature),
              //   });
              // }

              humiArray.push({
                value: change.doc.data().humidity,
                dataPointText: String(change.doc.data().humidity),
              });
              showDataTemp = change.doc.data();
              lastPointTemp = change.doc.data().timeBySecond;
            } else {
              // console.log("point null");
              tempArray.push({
                value: null,
              });
              humiArray.push({
                value: null,
              });
              lastPointTemp = lastPointTemp + 600000;
            }
          }
        } else if (isFirstLoad) {
          while (lastPointTemp < change.doc.data().timeBySecond) {
            if (change.doc.data().timeBySecond - lastPointTemp < 900000) {
              // console.log("point value//////////////////");
              if(change.doc.data().timeBySecond%3600000<=600000){
                var date = new Date(change.doc.data().timeBySecond);
                var hours = date.getHours();
                console.log(hours);
                tempArray.push({
                  value: change.doc.data().temperature,
                  dataPointText: String(change.doc.data().temperature),
                  label: hours+":00",
                });
                humiArray.push({
                  value: change.doc.data().humidity,
                  dataPointText: String(change.doc.data().humidity),
                  label: hours + ":00",
                });
              }
              else{
                tempArray.push({
                  value: change.doc.data().temperature,
                  dataPointText: String(change.doc.data().temperature),
                });
                humiArray.push({
                  value: change.doc.data().humidity,
                  dataPointText: String(change.doc.data().humidity),
                });
              }
              showDataTemp = change.doc.data();
              lastPointTemp = change.doc.data().timeBySecond;
            } else {
              // console.log("point null");
              if(lastPointTemp%3600000<=600000){
                var date = new Date(lastPointTemp);
                var hours = date.getHours();
                tempArray.push({
                  value: null,
                  label: hours+":00"
                });
                humiArray.push({
                  value: null,
                  label: hours + ":00",
                });
              }
              else{
                tempArray.push({
                  value: null,
                });
                humiArray.push({
                  value: null,
                });
              }
              lastPointTemp = lastPointTemp + 600000;
            }
          }
        }
      });
      ///set state  
      settemperature(tempArray);
      sethumidity(humiArray);
      setshowData(showDataTemp);
      setlastPoint(lastPointTemp);
      isFirstLoad = false;
      // console.log(temperature);
      // console.log(showData.temperature);
    });

    return () => {
      unsuscribe();
    };
  }, []);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === "Monitor") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Control") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Chart") {
            iconName = focused ? "analytics" : "analytics-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#60a5fa",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Monitor">
        {() => <HomeScreen showData={showData} />}
      </Tab.Screen>
      <Tab.Screen name="Chart">
        {() => <Chart temp={[...temperature]} humi={humidity} />}
      </Tab.Screen>
      {/* <Tab.Screen name="Chart" component={Chart} initialParams={{temperature: temperature, humidity: humidity}}/> */}
      <Tab.Screen name="Control" component={Control} />
    </Tab.Navigator>
  );
};

export default Test;
