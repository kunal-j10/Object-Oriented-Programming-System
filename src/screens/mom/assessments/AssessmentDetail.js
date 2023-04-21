import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../../../constants/Colors";
import CustomHeaderButton from "../../../components/CustomHeaderButton";
import {
  assessmentDetailFetch,
  changeStatus,
  assessmentRemoveError,
} from "../../../../store/assessment/operation";
import { removeNoInternetAction } from "../../../../store/auth/operation";
import {
  assessmentDetailSelector,
  assessmentErrorSelector,
} from "../../../../store/assessment/selector";

export default function AssessmentDetail({ route }) {
  // Getting assessment id from the route
  const { id } = route.params;

  const [isDetail, setIsDetail] = useState(true);

  const [isEdit, setIsEdit] = useState(true);
  const [note, setNote] = useState("");

  const { height } = useWindowDimensions();

  // Getting data from store
  const assessmentDetail = useSelector(assessmentDetailSelector);
  const error = useSelector(assessmentErrorSelector);

  const dispatch = useDispatch();

  const noteRef = useRef(null);

  // Fetching assessment details
  useEffect(() => {
    dispatch(assessmentDetailFetch(id));

    return () => {
      dispatch(removeNoInternetAction(assessmentDetailFetch.type));
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
          dispatch(assessmentRemoveError());
        },
      });
    }
  }, [error]);

  // initializing isEdit as per the note data
  useEffect(() => {
    if (assessmentDetail?._id === id && assessmentDetail?.note) {
      setIsEdit(false);
    }
  }, [assessmentDetail]);

  // settting note value in state if present in the assessmentDetail when edit selected
  useEffect(() => {
    if (isEdit && assessmentDetail?._id === id && assessmentDetail?.note) {
      setNote(assessmentDetail.note);

      if (noteRef?.current) {
        noteRef.current.focus();
      }
    }
  }, [isEdit]);

  const markCompleteHandler = () => {
    dispatch(changeStatus({ id, status: "completed" }));
  };

  const saveNoteHandler = () => {
    const trimmedNote = note.trim();

    if (trimmedNote !== note) setNote(trimmedNote);

    if (trimmedNote === "") noteRef.current.focus();

    const status =
      assessmentDetail.status === "completed" ? "completed" : "active";

    dispatch(changeStatus({ id, status, note: trimmedNote }));
  };

  const takeNote = () => {
    setIsEdit(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      {/* Question, attendies and tab selector section */}
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[styles.questionContainer, { height: height * 0.22 }]}
        colors={["#19C190", "#009DAB", "#005CBC"]}
      >
        <Text style={styles.question}>{assessmentDetail?.question}</Text>
      </LinearGradient>
      <Text style={styles.attendies}>
        Attendies {assessmentDetail?.no_of_attendies}
      </Text>
      <View style={styles.tabSelector}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => setIsDetail(true)}>
          <Text style={isDetail ? styles.tabSelected : styles.tabNotSelected}>
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setIsDetail(false)}
        >
          <Text style={!isDetail ? styles.tabSelected : styles.tabNotSelected}>
            Notes
          </Text>
        </TouchableOpacity>
      </View>

      {/* tab contents */}
      <View style={styles.tabContainer}>
        {isDetail ? (
          // details content
          <View style={styles.detailContainer}>
            <Text style={styles.txt}>{assessmentDetail?.details}</Text>
            {assessmentDetail?.status === "completed" ? (
              <Text style={styles.completed}>Completed</Text>
            ) : (
              <TouchableOpacity onPress={markCompleteHandler}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBtn}
                  colors={["#19C190", "#F5B700"]}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>
                    Mark as Completed
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.notesContainer}>
            {isEdit ? (
              // taking notes section
              <>
                <TextInput
                  ref={noteRef}
                  value={note}
                  onChangeText={(text) => setNote(text)}
                  style={styles.noteInput}
                  textAlignVertical="top"
                  multiline
                  placeholder="Type here..."
                />
                <TouchableOpacity onPress={saveNoteHandler}>
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBtn}
                    colors={["#19C190", "#F5B700"]}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              // displaying notes
              <>
                <TouchableOpacity
                  style={{ alignItems: "flex-end" }}
                  onPress={takeNote}
                >
                  <Feather name="edit-2" size={20} color="#8B898F" />
                </TouchableOpacity>
                <Text style={[styles.txt, { marginTop: 16 }]}>
                  {assessmentDetail?.note}
                </Text>
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingBottom: 50,
  },
  questionContainer: {
    marginVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 300,
    minHeight: 150,
  },
  question: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    maxWidth: "80%",
  },
  attendies: {
    marginLeft: 16,
    fontSize: 12,
    color: "rgba(22, 43, 66, 0.6)",
    marginBottom: 32,
  },
  tabSelector: {
    flexDirection: "row",
  },
  tabSelected: {
    textAlign: "center",
    paddingBottom: 8,
    fontWeight: "bold",
    color: Colors.textPrimary,
    borderBottomWidth: 2,
  },
  tabNotSelected: {
    textAlign: "center",
    paddingBottom: 8,
    color: Colors.textSecondary,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(196, 196, 196, 0.4)",
  },
  tabContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
  detailContainer: {
    paddingTop: 24,
    flex: 1,
  },
  txt: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 60,
  },
  completed: {
    color: "#fff",
    fontSize: 16,
    backgroundColor: "#00A1E4",
    paddingVertical: 15,
    borderRadius: 80,
    minWidth: "80%",
    textAlign: "center",
    alignSelf: "center",
  },
  gradientBtn: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    minWidth: "80%",
    alignSelf: "center",
  },
  notesContainer: {
    paddingTop: 16,
    flex: 1,
  },
  noteInput: {
    backgroundColor: Colors.appbar,
    borderRadius: 5,
    height: 195,
    borderWidth: 0.25,
    borderColor: "#979797",
    padding: 16,
    elevation: 4,
    shadowColor: "rgba(153, 153, 153, 0.1)",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    marginTop: 20,
    marginBottom: 40,
  },
});

// setting header for assessment detail screen
export const AssessmentDetailOptions = ({ navigation }) => {
  return {
    headerTitle: "Assessments",
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="back"
          color="black"
          iconName="chevron-back"
          onPress={() => navigation.goBack()}
        />
      </HeaderButtons>
    ),
  };
};
