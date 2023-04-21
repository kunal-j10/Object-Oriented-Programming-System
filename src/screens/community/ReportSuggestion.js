import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import RadioButton from "../../components/sideDrawer/RadioButton";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { AntDesign } from "@expo/vector-icons";
import {
  reportPost,
  communityCommentReport,
} from "../../../store/community/operation";
import { useDispatch } from "react-redux";
import { activityCommentReport } from "../../../store/activity/operation";
const reportSuggestions = [
  {
    id: 1,
    title: "Sexual content",
  },
  {
    id: 2,
    title: "Voilent or repulsive content",
  },
  {
    id: 3,
    title: "Hateful or abusive content",
  },
  {
    id: 4,
    title: "Harmful or dangerous act",
  },
  {
    id: 5,
    title: "Spam or misleading",
  },
];

const ReportSuggestion = ({ route, navigation }) => {
  const { reportId, returnScreen } = route.params;

  const [activeRadio, setactiveRadio] = useState(null);
  const [activeSuggestion, setactiveSuggestion] = useState(false);

  const dispatch = useDispatch();

  const report = () => {
    if (returnScreen === "Community") {
      dispatch(
        reportPost({ postId: reportId, reportComment: activeSuggestion })
      );
    } else if (returnScreen === "Comments") {
      dispatch(
        communityCommentReport({
          commentId: reportId,
          reportComment: activeSuggestion,
        })
      );
    } else if (returnScreen === "ActivityContent") {
      dispatch(
        activityCommentReport({
          commentId: reportId,
          reportComment: activeSuggestion,
        })
      );
    }

    navigation.navigate({ name: returnScreen, merge: true });
  };

  const RenderSuggestion = ({ item }) => {
    return (
      <View style={styles.suggestion}>
        <TouchableOpacity
          onPress={() => {
            setactiveSuggestion(item.title);
            setactiveRadio(item.id);
          }}
        >
          <RadioButton selected={item.id == activeRadio ? true : false} />
        </TouchableOpacity>
        <Text style={styles.text}>{item.title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      <View style={styles.appbar}>
        {/* <Pressable
          style={styles.btnWrapperAppBar}
          onPress={() => navigation.navigate("Community")}
        >
          <AntDesign name="close" size={24} color="black" />
        </Pressable> */}
        <Text style={styles.appbarTitle}>Report Context</Text>
      </View>

      <FlatList
        data={reportSuggestions}
        renderItem={RenderSuggestion}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={{ margin: 20 }} onPress={report}>
        <View style={{ padding: 10, borderRadius: 20, backgroundColor: "red" }}>
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Report
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  suggestion: {
    flexDirection: "row",
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "grey",
    fontWeight: "bold",
    marginLeft: 20,
  },
  btnWrapperAppBar: {
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  appbar: {
    flexDirection: "row",
    alignItems: "center",
    height: 68,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Colors.appbar,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  appbarTitle: {
    marginLeft: 20,
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  postBtn: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default ReportSuggestion;
