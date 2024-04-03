import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Logo} from "../assets";
import {FontAwesome} from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";
import { AppContext } from "../context/AppContext";

const Chart = () => {
  const {temperature}=useContext(AppContext);
  const {humidity} = useContext(AppContext);
  const {extraTemp} = useContext(AppContext);
  const {extraHumi} = useContext(AppContext);
  const [tempScale, settempScale] = useState(40);
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    if (temperature && humidity && extraTemp && extraHumi) {
      setisLoading(false);
    }
  }, [temperature, humidity, extraTemp, extraHumi]);

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
        <View className="w-full px-4 pt-4">
          <View className="w-full">
            <View className="w-full flex-row items-center justify-between px-2">
              <Text className="text-primaryText text-base font-semibold pb-2">
                Chart
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
                {/* <View style={{flex: 1}}> */}
                <ScrollView>
                  <View className="flex" style={{height: 980}}>
                    <View
                      className="flex items-center pt-2 bg-slate-100"
                      style={styles.card}
                    >
                      <Text className="justify-between py-1 text-primaryText text-base font-semibold">
                        Temperature
                      </Text>
                      <View className="flex-row flex">
                        <TouchableOpacity onPress={()=>settempScale(tempScale+10)} className="items-center justify-between" style={styles.zoomout}>
                          <Text className="font-bold text-base" >-</Text>
                        </TouchableOpacity> 
                        <View style={{width:2,backgroundColor:"grey",borderRadius:10}}></View>                       
                        <TouchableOpacity onPress={()=>settempScale(tempScale-10)} className="items-center justify-between" style={styles.zoomin}>
                          <Text className="font-bold text-base" >+</Text>
                        </TouchableOpacity>
                      </View>   
                      <LineChart
                        maxValue={
                          Math.ceil(extraTemp.max) - Math.floor(extraTemp.min)
                        }
                        data={[...temperature]}
                        height={250}
                        yAxisOffset={Math.floor(extraTemp.min)}
                        width={280}
                        showVerticalLines
                        spacing={tempScale}
                        // spacing={10}
                        initialSpacing={20}
                        color1="skyblue"
                        textColor1="green"
                        dataPointsHeight={6}
                        dataPointsWidth={6}
                        dataPointsColor1="blue"
                        textFontSize={13}
                        onFocusEnabled
                        scrollToEnd
                        hideDataPoints={true}
                        curved={true}
                      />
                    </View>
                    <View
                      className="flex items-center pt-2 bg-amber-50"
                      style={styles.card}
                    >
                      <Text className="justify-between py-1 text-primaryText text-base font-semibold">
                        Humidity
                      </Text>
                      <LineChart
                        maxValue={
                          Math.ceil(extraHumi.max) - Math.floor(extraHumi.min)
                        }
                        // onlyPositive={true}
                        data={[...humidity]}
                        height={250}
                        yAxisOffset={Math.floor(extraHumi.min)}
                        // yAxisLabelTexts={[34, "$250", "$500", "$750"]}
                        // noOfSections={2}
                        // width={Dimensions.get("window").width}
                        width={280}
                        showVerticalLines
                        spacing={40}
                        initialSpacing={20}
                        color1="orange"
                        textColor1="green"
                        dataPointsHeight={6}
                        dataPointsWidth={6}
                        dataPointsColor1="red"
                        // textShiftY={-2}
                        // textShiftX={-5}
                        textFontSize={13}
                        onFocusEnabled
                        scrollToEnd
                        curved
                        // interpolateMissingValues={false}
                        // fromZeroValues={false}
                      />
                    </View>
                  </View>
                </ScrollView>
                {/* </View> */}
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    elevation: 3,
    height: 350,
    // backgroundColor: "#a2e4fc",
    // shadowOffset: {width: 1, height: 1},
    // shadowColor: "#333",
    // shadowOpacity: 2,
    // shadowRadius: 2,
    // borderColor: "#77A7FF", // Màu viền xanh
    // borderWidth: 2, // Độ dày của viền
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
  zoomout: {
    backgroundColor: "#E0E0E0",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    // borderColor: "grey",
    // borderWidth: 1,
    height: 25,
    width: 25,
  },
  zoomin: {
    backgroundColor: "#E0E0E0",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    // borderColor: "grey",
    // borderWidth: 1,
    height: 25,
    width: 25,
  },
});

export default Chart;
