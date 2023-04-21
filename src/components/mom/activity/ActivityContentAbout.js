import React from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Toastmessage } from "../../../../store/activity/selector";
import { statusFetch } from "../../../../store/activity/operation";
import { removeToastStatus } from "../../../../store/activity/slice";
import Toast from "react-native-root-toast";

const DEVICE_HEIGHT = Dimensions.get("window").height;

const ActivityContentAbout = React.forwardRef((props, ref) => {
  const { about, paddingTop, onScroll, id, status } = props;
  const toastmessage = useSelector(Toastmessage);
  const [staticstatus, setstaticstatus] = useState(status);
  const aboutArray = [about];

  const dispatch = useDispatch();

  const activityStatusHandler = () => {
    dispatch(statusFetch({ id, status: "completed" }));
  };

  useEffect(() => {
    if (toastmessage !== "") {
      Toast.show(toastmessage, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
      });
      dispatch(removeToastStatus());
      setstaticstatus("completed");
    }
  }, [toastmessage]);
  return (
    <Animated.FlatList
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingTop }}
      ListFooterComponent={() => <View style={{ marginBottom: paddingTop }} />}
      onScroll={onScroll}
      ref={ref}
      data={aboutArray}
      keyExtractor={(_, index) => index}
      renderItem={({ item: about }) => (
        <View style={styles.section}>
          <Text style={styles.title}>Description</Text>
          <Text
            style={{
              color: "rgba(24, 20, 31, 0.6)",
              fontSize: 16,
              marginBottom: 10,
            }}
          >
            {about.description}
          </Text>
          <View style={styles.subsection}>
            <Text style={styles.title}>Materials Required</Text>
            {about.material_required.map((item, index) => {
              return (
                <Text
                  key={index}
                  style={{ color: "rgba(24, 20, 31, 0.6)", fontSize: 16 }}
                >
                  {item}
                </Text>
              );
            })}
          </View>
          <View style={styles.subsection}>
            <Text style={styles.title}>How many People</Text>
            <Text style={{ color: "rgba(24, 20, 31, 0.6)", fontSize: 16 }}>
              {about.no_of_people}
            </Text>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.title}>Aim</Text>
            <Text style={{ color: "rgba(24, 20, 31, 0.6)", fontSize: 16 }}>
              {about.aim}
            </Text>
          </View>
          <TouchableOpacity onPress={activityStatusHandler}>
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.markComplete}
              colors={
                staticstatus == "completed"
                  ? ["#005CBC", "#009DAB"]
                  : ["#19C190", "#F5B700"]
              }
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {staticstatus == "completed" ? "Completed" : "Mark as Complete"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    />
  );
});

export default React.memo(ActivityContentAbout);

const styles = StyleSheet.create({
  section: {
    margin: 20,
    marginBottom: 100,
  },
  title: {
    marginBottom: 10,
    fontSize: DEVICE_HEIGHT > 600 ? 18 : 16,
    color: "black",
    fontWeight: "bold",
  },
  subsection: {
    marginVertical: 15,
  },
  markComplete: {
    padding: 15,
    borderRadius: 20,
  },
});
