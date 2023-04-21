import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../../../constants/Colors";

function AssessmentCard({
  question,
  status,
  no_of_attendies,
  onQuestionPress,
  onMarkCompletePress,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.attendies}>{no_of_attendies} Views</Text>
      <View style={styles.btnGrp}>
        <TouchableOpacity onPress={onQuestionPress}>
          <Text style={styles.learnMore}>Learn More</Text>
        </TouchableOpacity>
        {status === "completed" ? (
          <Text style={styles.completed}>Completed</Text>
        ) : (
          <TouchableOpacity onPress={onMarkCompletePress}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.markComplete}
              colors={["#19C190", "#F5B700"]}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                Mark as Completed
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const propsCheck = (prev, curr) => {
  return (
    prev.question === curr.question &&
    prev.status === curr.status &&
    prev.no_of_attendies === curr.no_of_attendies
  );
};
export default React.memo(AssessmentCard, propsCheck);

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    elevation: 15,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    borderRadius: 15,
    backgroundColor: "#fff",
  },
  question: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: "bold",
    marginBottom: 8,
  },
  attendies: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  btnGrp: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  learnMore: {
    color: "#03B44D",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#03B44D",
    borderRadius: 20,
  },
  completed: {
    color: "#fff",
    fontSize: 16,
    backgroundColor: "#00A1E4",
    paddingHorizontal: 44,
    paddingVertical: 15,
    borderRadius: 20,
  },
  markComplete: {
    padding: 15,
    borderRadius: 20,
  },
});
