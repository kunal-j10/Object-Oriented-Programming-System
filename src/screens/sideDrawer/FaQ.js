import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
} from "react-native";
import React from "react";
import AppBar from "../../components/AppBar";
import Constants from "expo-constants";
import Colors from "../../../constants/Colors";
import { AntDesign, Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useState, useRef } from "react";
import { Transition, Transitioning } from "react-native-reanimated";
import { fetchFAqs } from "../../../store/sideDrawer/operation";
import {
  FAQsSelector,
  FAQsLoadingSelector,
} from "../../../store/sideDrawer/selector";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Skelleton from "../../components/loader/SkeletonLoader";
const HEIGHT = Dimensions.get("window").height;

const FaQ = (props) => {
  const [id, setid] = useState(null);
  const ref = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFAqs());
  }, []);

  const FAQs = useSelector(FAQsSelector);
  const FAQsLoading = useSelector(FAQsLoadingSelector);

  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={200} />
      <Transition.Change />
      <Transition.Out type="fade" durationMs={200} />
    </Transition.Together>
  );

  return (
    <View style={styles.container}>
      <AppBar navigation={props.navigation} title="FAQs" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.header}>How we can help you?</Text>
          <View style={styles.TextInput}>
            <TextInput
              style={{ flexBasis: "85%" }}
              placeholder="Search Your Questions.."
            />
            <TouchableOpacity>
              <AntDesign name="search1" size={23} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <Transitioning.View transition={transition} ref={ref}>
            {FAQsLoading ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Skelleton />
              </View>
            ) : (
              FAQs.map((item, index) => {
                return (
                  <View key={index} style={styles.FaqItem}>
                    <View style={styles.FaqHeader}>
                      <Text style={styles.FaqTitle}>{item.question}</Text>

                      <TouchableOpacity
                        onPress={() => {
                          ref.current.animateNextTransition();
                          setid(id === index ? null : index);
                        }}
                      >
                        <View
                          style={{
                            padding: HEIGHT > 600 ? 2 : 1,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 50,
                            borderWidth: 1,
                            borderColor: Colors.primary,
                          }}
                        >
                          {id === index ? (
                            <Feather
                              color={Colors.primary}
                              name="chevron-down"
                              size={HEIGHT > 600 ? 22 : 18}
                            />
                          ) : (
                            <Feather
                              color="black"
                              name="chevron-up"
                              size={HEIGHT > 600 ? 22 : 18}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>

                    {id === index ? (
                      <Text style={styles.FaqContent}>{item.answer}</Text>
                    ) : null}
                  </View>
                );
              })
            )}
          </Transitioning.View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FaQ;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    fontSize: HEIGHT > 600 ? 20 : 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  FaqItem: {
    borderBottomColor: "#F3F3F3",
    borderBottomWidth: 1,
    flexDirection: "column",
    paddingVertical: 15,
    flex: 1,
  },
  FaqHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  FaqTitle: {
    flexBasis: "90%",
    fontSize: HEIGHT > 600 ? 16 : 14,
    fontWeight: "bold",
    color: "#000000",
  },
  FaqContent: {
    marginTop: 10,
    fontSize: 12,
    color: "#868686",
  },
  TextInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: HEIGHT > 600 ? 14 : 10,
    fontSize: HEIGHT > 600 ? 16 : 12,
    marginVertical: 15,
  },
});
