import { StatusBar } from "expo-status-bar";
import React, { useEffect, useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Toast from "react-native-root-toast";
import Skelleton from "../../../components/loader/SkeletonLoader";
import Colors from "../../../../constants/Colors";
import {
  growthDataUploadedSelector,
  growthErrorHeadSelector,
  growthErrorHeightSelector,
  growthErrorWeightSelector,
  growthGraphHeadSelector,
  growthGraphHeightSelector,
  growthGraphWeightSelector,
  growthLoadingHeadSelector,
  growthLoadingHeightSelector,
  growthLoadingWeightSelector,
  growthMeasurementHeadDataSelector,
  growthMeasurementHeightDataSelector,
  growthMeasurementWeightDataSelector,
  growthRefreshingHeadSelector,
  growthRefreshingHeightSelector,
  growthRefreshingWeightSelector,
} from "../../../../store/growth/selector";
import {
  growthHeadFetch,
  growthHeightFetch,
  growthWeightFetch,
  growthRemoveWeightError,
  growthRemoveHeightError,
  growthRemoveHeadError,
  growthChangeDataUploaded,
} from "../../../../store/growth/operation";
import { removeNoInternetAction } from "../../../../store/auth/operation";
import AddGrowthDetail from "../../../components/mom/growth/AddGrowthDetail";
import LoaderPost from "../../../components/loader/LoaderPost";

export const screenType = {
  Weight: {
    name: "Weight",
    dataName: "weight",
    yAxisSuffix: " kg",
  },
  Height: {
    name: "Height",
    dataName: "height",
    yAxisSuffix: " cm",
  },
  HeadCircle: {
    name: "Head Circle",
    dataName: "headCircle",
    yAxisSuffix: " cm",
  },
};

export default function GrowthTracker({ route, navigation }) {
  const { width } = useWindowDimensions();

  let loading, refreshing, error, graphData, tableData;
  if (route.name === "Weight") {
    loading = useSelector(growthLoadingWeightSelector);
    refreshing = useSelector(growthRefreshingWeightSelector);
    error = useSelector(growthErrorWeightSelector);
    graphData = useSelector(growthGraphWeightSelector);
    tableData = useSelector(growthMeasurementWeightDataSelector);
  } else if (route.name === "Height") {
    loading = useSelector(growthLoadingHeightSelector);
    refreshing = useSelector(growthRefreshingHeightSelector);
    error = useSelector(growthErrorHeightSelector);
    graphData = useSelector(growthGraphHeightSelector);
    tableData = useSelector(growthMeasurementHeightDataSelector);
  } else {
    loading = useSelector(growthLoadingHeadSelector);
    refreshing = useSelector(growthRefreshingHeadSelector);
    error = useSelector(growthErrorHeadSelector);
    graphData = useSelector(growthGraphHeadSelector);
    tableData = useSelector(growthMeasurementHeadDataSelector);
  }

  const dataUploaded = useSelector(growthDataUploadedSelector);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedObj, setSelectedObj] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (route.name === "Weight") {
      dispatch(growthWeightFetch("loading"));
    } else if (route.name === "Height") {
      dispatch(growthHeightFetch("loading"));
    } else {
      dispatch(growthHeadFetch("loading"));
    }

    return () => {
      if (route.name === "Weight") {
        dispatch(removeNoInternetAction(growthWeightFetch.type));
      } else if (route.name === "Height") {
        dispatch(removeNoInternetAction(growthHeightFetch.type));
      } else {
        dispatch(removeNoInternetAction(growthHeadFetch.type));
      }
    };
  }, []);

  // displaying errors if occured
  useEffect(() => {
    if (error !== "") {
      Toast.show(error, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          if (route.name === "Weight") {
            dispatch(growthRemoveWeightError());
          } else if (route.name === "Height") {
            dispatch(growthRemoveHeightError());
          } else {
            dispatch(growthRemoveHeadError());
          }
        },
      });
    }
  }, [error]);

  // It hides the add growth modal when the api call is successfull and empty the selectedObj variable to remove the selected measurement field
  useEffect(() => {
    const navigationIdx = navigation.getState().index;
    const screenName = Object.keys(screenType);
    if (screenName[navigationIdx] === route.name && dataUploaded === true) {
      setModalVisible(false);
      setSelectedObj(null);

      Toast.show(selectedObj ? "Updated successfully" : "Added successfully", {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        backgroundColor: "green",
        textColor: "white",
      });
      dispatch(growthChangeDataUploaded());
    }
  }, [dataUploaded, selectedObj]);

  const onRefresh = useCallback(() => {
    if (route.name === "Weight") {
      dispatch(growthWeightFetch("refreshing"));
    } else if (route.name === "Height") {
      dispatch(growthHeightFetch("refreshing"));
    } else {
      dispatch(growthHeadFetch("refreshing"));
    }
  }, []);

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  const hanldeEdit = (rowData) => {
    setSelectedObj({
      editDate: rowData.dateAtRecorded,
      editValue: rowData[screenType[route.name].dataName].toString(),
      editId: rowData._id,
    });
    setModalVisible(true);
  };

  const handleClose = () => {
    toggleModal();
    setSelectedObj(null);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar style="auto" backgroundColor="#03B44D" />
      {loading ? (
        <View style={{ alignItems: "center" }}>
          <Skelleton />
        </View>
      ) : (
        <>
          {graphData && (
            <View style={styles.chart}>
              <View style={styles.chartHeader}>
                <Text style={styles.txt}>
                  Last Updated {screenType[route.name].name} on:{" "}
                </Text>
                <Text style={styles.date}>1 Nov, 2021</Text>
              </View>

              <LineChart
                data={{
                  legend: ["2nd sd", "1st sd", "user data"],
                  ...graphData,
                }}
                width={width - 48}
                height={220}
                yAxisSuffix={screenType[route.name].yAxisSuffix}
                transparent
                withShadow={false}
                withDots={false}
                chartConfig={{
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                style={{
                  borderRadius: 10,
                }}
              />
            </View>
          )}
          {tableData?.length != 0 && (
            <View style={styles.measurementContainer}>
              <Text style={styles.measurementTitle}>Measurements</Text>
              <View style={styles.table}>
                <View style={styles.row}>
                  <Text style={styles.rowHeader}>Date</Text>
                  <Text style={styles.rowHeader}>Age</Text>
                  <Text style={styles.rowHeader}>
                    {screenType[route.name].name}
                  </Text>
                  <Text style={styles.rowHeader}>Ideal Range</Text>
                  <TouchableOpacity style={{ opacity: 0 }}>
                    <EvilIcons
                      name="pencil"
                      size={18}
                      color={Colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {tableData.map((rowData) => (
                  <View style={styles.row} key={rowData._id}>
                    <Text style={styles.rowData}>
                      {moment(rowData.dateAtRecorded).format("DD MMM, YYYY")}
                    </Text>
                    <Text style={styles.rowData}>
                      {rowData.ageInMonths} months
                    </Text>
                    <Text style={styles.rowData}>
                      {rowData[screenType[route.name].dataName] +
                        screenType[route.name].yAxisSuffix}
                    </Text>
                    <Text style={[styles.rowData]}>
                      {rowData.idealRange
                        ? rowData.idealRange +
                          screenType[route.name].yAxisSuffix
                        : " - "}
                    </Text>
                    <TouchableOpacity onPress={() => hanldeEdit(rowData)}>
                      <EvilIcons
                        name="pencil"
                        size={18}
                        color={Colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
          <TouchableOpacity onPress={toggleModal}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
              colors={["#19C190", "#F5B700"]}
            >
              <Text style={styles.gradientBtnTxt}>Add Growth Details</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}

      <AddGrowthDetail
        isVisible={modalVisible}
        onClose={handleClose}
        type={route.name}
        editDate={selectedObj?.editDate}
        editValue={selectedObj?.editValue} // it can be weight, height or head circle based on type
        editId={selectedObj?.editId}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF",
    padding: 16,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chart: {
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: Colors.appbar,
    paddingVertical: 24,
    borderRadius: 15,
    marginBottom: 48,
  },
  chartHeader: {
    flexDirection: "row",
    marginBottom: 20,
    marginHorizontal: 16,
  },
  txt: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  measurementTitle: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: "bold",
  },
  table: {
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 9,
  },
  rowHeader: {
    flex: 1,
    // fontSize: 12,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  flex: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  rowData: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
  },
  gradientBtn: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: 48,
    borderRadius: 24,
    minWidth: "80%",
    marginBottom: 50,
  },
  gradientBtnTxt: {
    color: "white",
    fontSize: 16,
  },
});
