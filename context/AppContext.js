import { createContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {firestoreDB} from "../config/firebase.config";

export const AppContext = createContext();

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

export const AppProvider = ({children})=>{
    const temp=["temperature","humidity","humidity"];
    // const startOfDay = new Date("2024-03-18");
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const [temperature, settemperature] = useState([]);
    const [humidity, sethumidity] = useState([]);
    const [showData, setshowData] = useState({});
    const [lastPoint, setlastPoint] = useState(startOfDay.getTime());
    const [extraTemp, setextraTemp] = useState({});
    const [extraHumi, setextraHumi] = useState({});
    useEffect(() => {
      let isFirstLoad = true;
      const q = query(
        collection(firestoreDB, getCurrentDate()),
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
            while (lastPointTemp < change.doc.data().timeBySecond) {
              if (change.doc.data().timeBySecond - lastPointTemp < 900000) {
                // console.log("point value//////////////////");
                if (change.doc.data().timeBySecond % 3600000 < 600000) {
                  var date = new Date(change.doc.data().timeBySecond);
                  var hours = date.getHours();
                  tempArray.push({
                    value: change.doc.data().temperature,
                    dataPointText: String(change.doc.data().temperature),
                    label: hours + ":00",
                  });
                  humiArray.push({
                    value: change.doc.data().humidity,
                    dataPointText: String(change.doc.data().humidity),
                    label: hours + ":00",
                  });
                } else {
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
                lastPointTemp = lastPointTemp + 600000;
                if (lastPointTemp % 3600000 < 600000) {
                  var date = new Date(lastPointTemp);
                  var hours = date.getHours();
                  tempArray.push({
                    value: null,
                    label: hours + ":00",
                  });
                  humiArray.push({
                    value: null,
                    label: hours + ":00",
                  });
                } else {
                  tempArray.push({
                    value: null,
                  });
                  humiArray.push({
                    value: null,
                  });
                }
              }
            }
          } else if (isFirstLoad) {
            while (lastPointTemp < change.doc.data().timeBySecond) {
              if (change.doc.data().timeBySecond - lastPointTemp < 900000) {
                // console.log("point value//////////////////");
                if (change.doc.data().timeBySecond % 3600000 < 600000) {
                  var date = new Date(change.doc.data().timeBySecond);
                  var hours = date.getHours();
                  tempArray.push({
                    value: change.doc.data().temperature,
                    dataPointText: String(change.doc.data().temperature),
                    label: hours + "h",
                  });
                  humiArray.push({
                    value: change.doc.data().humidity,
                    dataPointText: String(change.doc.data().humidity),
                    label: hours + "h",
                  });
                } else {
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
                lastPointTemp = lastPointTemp + 600000;
                if (lastPointTemp % 3600000 < 600000) {
                  var date = new Date(lastPointTemp);
                  var hours = date.getHours();
                  tempArray.push({
                    value: null,
                    label: hours + "h",
                  });
                  humiArray.push({
                    value: null,
                    label: hours + "h",
                  });
                } else {
                  tempArray.push({
                    value: null,
                  });
                  humiArray.push({
                    value: null,
                  });
                }
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
      });
        const filteredValuesTemp = temperature.filter(temp => temp.value !== null).map(temp => temp.value);
        const maxTemp = Math.max(...filteredValuesTemp);
        const minTemp = Math.min(...filteredValuesTemp);
        const avgTemp = filteredValuesTemp.reduce((acc, curr) => acc + curr, 0) / filteredValuesTemp.length;
        setextraTemp({
          min: minTemp,
          max: maxTemp,
          avg: avgTemp,
        });
        const filteredValuesHumi = humidity.filter(temp => temp.value !== null).map(temp => temp.value);
        const maxHumi = Math.max(...filteredValuesHumi);
        const minHumi = Math.min(...filteredValuesHumi);
        const avgHumi = filteredValuesHumi.reduce((acc, curr) => acc + curr, 0) / filteredValuesHumi.length;
        setextraHumi({
          min: minHumi,
          max: maxHumi,
          avg: avgHumi,
        });
      return () => {
        unsuscribe();
      };
    }, [lastPoint]);
    return <AppContext.Provider value={{showData, humidity, temperature, extraTemp, extraHumi}}>
        {children}
    </AppContext.Provider>
}