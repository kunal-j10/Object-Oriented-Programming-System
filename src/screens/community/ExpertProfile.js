import React from "react";
import { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
  TouchableNativeFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Feather, SimpleLineIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Transition, Transitioning } from "react-native-reanimated";
import Spinner from "react-native-loading-spinner-overlay";
import Color from "../../../constants/Colors";
import Profile from "../../components/Profile";
import Skelleton from "../../components/loader/SkeletonLoader";
import GradientBtn from "../../components/GradientBtn";
import OutlineBtn from "../../components/OutlineBtn";
import Toast from "react-native-root-toast";
import {
  communityProfileSelector,
  communityProfileLoadingSelector,
  communityQAndASelector,
  expertReportLoading,
  expertReportStatus,
} from "../../../store/community/selector";
import {
  fetchProfile,
  getQna,
  toggleFollow,
  expertViewsCount,
} from "../../../store/community/operation";
import { removeNoInternetAction } from "../../../store/auth/operation";
import { expertReportfetch,expertemptyReportBlockStatus } from "../../../store/community/operation";
import ConfirmationBox from "../../components/ConfirmationBox";
import ExpertReportModal from "../../components/community/ExpertReportModal";
const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

const ExpertProfile = (props) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [currindex, setindex] = useState(null);
  const [section, setSection] = useState("about");
  const [expertreportBlockModal, setexpertereportBlockModal] = useState(false);
  const [ConfirmBox, setConfirmBox] = useState(false);

  const ref = useRef();
  const expertId = props.route.params?.expertId;
  const ProfileData = useSelector(communityProfileSelector);
  const QandA = useSelector(communityQAndASelector);
  const isLoading = useSelector(communityProfileLoadingSelector);
  const ReportLoading = useSelector(expertReportLoading);
  const ReportStatus = useSelector(expertReportStatus);

  const OnHandleReport = () => {
    setexpertereportBlockModal(false);
    setConfirmBox(true);
  };

  const HandleReport = () => {
    dispatch(expertReportfetch({ expertId }));
    setConfirmBox(false);
  };
  useEffect(() => {
    return () => {
      dispatch(removeNoInternetAction(fetchProfile.type));
      dispatch(removeNoInternetAction(getQna.type));
    };
  }, []);

  useEffect(() => {
    dispatch(fetchProfile(expertId));
    dispatch(expertViewsCount(expertId));
  }, [dispatch, expertId]);

  useEffect(() => {
    if (ReportStatus !== "") {
      Toast.show(ReportStatus, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
      });
      dispatch(expertemptyReportBlockStatus())
    }
  }, [ReportStatus]);

  const ToggleExpertFollow = () => {
    dispatch(toggleFollow({ expertId: expertId, status: "follow" }));
  };

  const ToggleExpertUnFollow = (type) => {
    dispatch(toggleFollow({ expertId: expertId, status: type }));
    setModalVisible((preModel) => !preModel);
  };

  const getQandA = () => {
    setSection("q&a");
    dispatch(getQna(expertId));
  };
  return (
    <View>
      <StatusBar style="auto" backgroundColor="#03B44D" />

      <ScrollView style={styles.container}>
        {isLoading ? (
          <View style={{ alignItems: "center" }}>
            <Skelleton />
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            <StatusBar style="auto" />
            <Profile
              onProfilePress={() => props.navigation.navigate("ExpertProfile")}
              HeaderTitle={ProfileData.name}
              proffesion={ProfileData.fieldOfSpecialty}
              profileImg={ProfileData.profileImageUrl}
              onPressDot={() => setexpertereportBlockModal(true)}
            />

            <View style={styles.publicity}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image source={require("../../../assets/images/book.png")} />

                  <View style={{ marginLeft: 5 }}>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      {ProfileData.no_of_patients}
                    </Text>
                    <Text style={{ fontSize: 12 }}>Patient</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Feather
                    name={"eye"}
                    size={23}
                    color="#03B44D"
                    style={{ marginLeft: 10 }}
                  />

                  <View style={{ marginLeft: 5 }}>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      {ProfileData.no_of_profileViews}
                    </Text>
                    <Text style={{ fontSize: 12 }}>Views</Text>
                  </View>
                </View>
              </View>
              {/* Follow Button */}

              {ProfileData.isFollowing ? (
                <OutlineBtn
                  onPress={() => setModalVisible((prevState) => !prevState)}
                  title="Following"
                />
              ) : (
                <GradientBtn onPress={ToggleExpertFollow} title="Follow" />
              )}
            </View>
            <View>
              <View style={styles.section}>
                <TouchableOpacity
                  onPress={() => {
                    setSection("about");
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "bold",
                      color:
                        section === "about"
                          ? "black"
                          : "rgba(196, 196, 196, 0.4)",
                      marginBottom: 10,
                    }}
                  >
                    About
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={getQandA}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "bold",
                      color:
                        section === "q&a"
                          ? "black"
                          : "rgba(196, 196, 196, 0.4)",
                      marginBottom: 10,
                    }}
                  >
                    Q&A
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", flex: 1 }}>
                <View
                  style={{
                    borderBottomColor:
                      section === "about"
                        ? "black"
                        : "rgba(196, 196, 196, 0.4)",
                    borderBottomWidth: 2,
                    width: "50%",
                  }}
                />
                <View
                  style={{
                    borderBottomColor:
                      section === "q&a" ? "black" : "rgba(196, 196, 196, 0.4)",
                    borderBottomWidth: 2,
                    width: "50%",
                  }}
                />
              </View>
            </View>
            {section === "about" ? (
              <View style={styles.about}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    marginVertical: 10,
                  }}
                >
                  <Feather
                    name={"briefcase"}
                    size={23}
                    color="#4A7AC9"
                    style={{ marginRight: 10 }}
                  />
                  <Text>Works at {ProfileData.workAt}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    marginVertical: 10,
                  }}
                >
                  <SimpleLineIcons
                    name={"graduation"}
                    size={24}
                    color="#4A7AC9"
                    style={{ marginRight: 10 }}
                  />
                  <Text>Studies at XYZ</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    marginVertical: 10,
                  }}
                >
                  <Feather
                    name={"globe"}
                    size={23}
                    color="#4A7AC9"
                    style={{ marginRight: 10 }}
                  />
                  <Text>
                    Knows{" "}
                    {ProfileData.language &&
                      ProfileData.language.map((language) => {
                        return <Text key={language}>{language},</Text>;
                      })}
                  </Text>
                </View>

                <View style={styles.border} />
                <View style={styles.description}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(24, 20, 31, 0.7)",
                      lineHeight: 24,
                    }}
                  >
                    {ProfileData.intro}
                  </Text>
                </View>
              </View>
            ) : (
              <Transitioning.View
                style={{ paddingTop: 20 }}
                ref={ref}
                transition={transition}
              >
                {QandA.map(({ text, reply, _id }, index) => {
                  return (
                    <View key={index} style={styles.accordian}>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{ fontSize: 16, fontWeight: "bold", flex: 1 }}
                        >
                          {text}
                        </Text>
                        <TouchableNativeFeedback
                          key={index}
                          onPress={() => {
                            ref.current.animateNextTransition();
                            setindex(index === currindex ? null : index);
                          }}
                        >
                          <Feather
                            name={
                              index === currindex
                                ? "chevron-up"
                                : "chevron-down"
                            }
                            size={23}
                            color="black"
                          />
                        </TouchableNativeFeedback>
                      </View>
                      {index === currindex && (
                        <Text
                          style={{
                            marginTop: 10,
                            color: "#18141F",
                            lineHeight: 22,
                            letterSpacing: 0.3,
                          }}
                        >
                          {reply}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </Transitioning.View>
            )}
            <ConfirmationBox
              OnPressAction={() => ToggleExpertUnFollow("unfollow")}
              ModalLeftButton="Cancel"
              ModalRightButton="Unfollow"
              ModalTitle={`Do you want to Unfollow ${ProfileData.name}`}
              isModalVisible={modalVisible}
              onCloseModal={() => setModalVisible(!modalVisible)}
            />
          </View>
        )}
      </ScrollView>

      <ExpertReportModal
        // isBlock={ProfileDetails.isBlocked}
        OnHandleReport={OnHandleReport}
        expertId={expertId}
        isModalVisible={expertreportBlockModal}
        onCloseModal={() => setexpertereportBlockModal(false)}
      />

      <ConfirmationBox
        OnPressAction={HandleReport}
        ModalLeftButton="Cancel"
        ModalRightButton="Report"
        ModalTitle={`Do you want to Report ${ProfileData.name}`}
        isModalVisible={ConfirmBox}
        onCloseModal={() => setConfirmBox(false)}
      />

      <Spinner
        // visibility of Overlay Loading Spinner
        visible={ReportLoading}
        //Text with the Spinner
        textContent={"Loading..."}
        //Text style of the Spinner Text
        textStyle={{ color: "#FFF" }}
      />
    </View>
  );
};

export const ExpertOptions = (navData) => {
  return {
    headerTitle: "Expert Profile",

    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  publicity: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: 20,
  },
  accordian: {
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderColor: "rgba(102, 102, 102, 0.2)",
    flexGrow: 1,
  },
  about: {
    width: "100%",
    marginVertical: 20,
  },
  border: {
    borderTopWidth: 2,
    borderTopColor: "#C4C4C4",
    width: 500,
    alignSelf: "center",
  },
  description: {
    paddingVertical: 20,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalView: {
    width: "80%",
    minHeight: 150,
    marginTop: "auto",

    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    marginBottom: "60%",
  },
});

export default ExpertProfile;
