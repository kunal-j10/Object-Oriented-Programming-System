import React, { forwardRef, memo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

import Colors from "../../../constants/Colors";
import { getWordCount } from "../../utils/helper";
import Button from "../Button";

const VaccinationListItem = forwardRef((props, ref) => {
  const {
    id,
    vaccineName,
    pricePerDose,
    description,
    dueDate,
    label,
    showActionButton,
    attachmentDetails,
    takenOnDate,
    selectedId,
    setSelectedId,
    category,
    markDoneHandler = () => {},
    editHandler = () => {},
  } = props;

  const navigation = useNavigation();

  const [isReadMore, setIsReadMore] = useState(false);

  const toggleReadMore = () => {
    setIsReadMore((prevIsReadMore) => !prevIsReadMore);
  };

  const MarkAsDoneButton = () => {
    if ((category === "All" && showActionButton) || category === "Upcoming") {
      return (
        <Button
          style={{ marginVertical: 16 }}
          title="Mark As Done"
          onPress={markDoneHandler}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Collapsed Header */}
      <Pressable
        style={styles.header}
        onPress={() => {
          ref.current.animateNextTransition();
          setSelectedId(id === selectedId ? null : id);
        }}
      >
        <LinearGradient
          style={styles.syringeIcon}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={["#19C190", "#006999"]}
        >
          <FontAwesome5 name="syringe" size={24} color={Colors.appbar} />
        </LinearGradient>
        <Text style={styles.vaccineName}>{vaccineName}</Text>
        <Feather
          name={id === selectedId ? "chevron-up" : "chevron-down"}
          size={24}
          color={Colors.textPrimary}
        />
      </Pressable>

      {/* Collapsed Body */}
      {id === selectedId && (
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.contentTitle}>Vaccination Info</Text>
              {label && (
                <Text
                  style={[
                    styles.vaccineStatus,
                    {
                      backgroundColor:
                        label.toLowerCase() === "upcoming"
                          ? "#FFC929"
                          : label.toLowerCase() === "completed"
                          ? "#03B44D"
                          : "#b30000",
                    },
                  ]}
                >
                  {label}
                </Text>
              )}
            </View>
            {category.toLowerCase() === "completed" && (
              <Pressable
                onPress={() => editHandler({ takenOnDate, attachmentDetails })}
              >
                <Feather name="edit-2" size={24} color={Colors.textSecondary} />
              </Pressable>
            )}
          </View>

          {/* Vaccine Due Date */}
          {dueDate && (
            <View style={styles.dueDate}>
              <LinearGradient
                style={styles.dueDateIcon}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={["#19C190", "#006999"]}
              >
                <Feather name="calendar" size={24} color={Colors.appbar} />
              </LinearGradient>
              <View style={{ marginHorizontal: 16 }}>
                <Text style={styles.dueDateTitle}>Due Date</Text>
                <Text style={{ color: Colors.textSecondary }}>
                  {moment(dueDate).format("dddd, D MMMM, YYYY")}
                </Text>
              </View>
            </View>
          )}

          {/* Vaccine Taken Date */}
          {takenOnDate ? (
            <View style={styles.dueDate}>
              <LinearGradient
                style={styles.dueDateIcon}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={["#19C190", "#006999"]}
              >
                <Feather name="calendar" size={24} color={Colors.appbar} />
              </LinearGradient>
              <View style={{ marginHorizontal: 16 }}>
                <Text style={styles.dueDateTitle}>Taken On</Text>
                <Text style={{ color: Colors.textSecondary }}>
                  {moment(takenOnDate).format("dddd, D MMMM, YYYY")}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Vaccine Price */}
          <View style={styles.dueDate}>
            <LinearGradient
              style={styles.dueDateIcon}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={["#19C190", "#006999"]}
            >
              <FontAwesome5
                name="money-bill-wave"
                size={20}
                color={Colors.appbar}
              />
            </LinearGradient>
            <View style={{ marginHorizontal: 16 }}>
              <Text style={styles.dueDateTitle}>Price / Dose</Text>
              <Text style={{ color: Colors.textSecondary }}>
                ₹ {pricePerDose}
              </Text>
            </View>
          </View>

          {/* Vaccine Description */}
          <View style={{ marginVertical: 16 }}>
            {getWordCount(description) < 15 ? (
              <Text style={styles.description}>{description}</Text>
            ) : (
              <>
                <Text
                  style={styles.description}
                  numberOfLines={isReadMore ? 0 : 2}
                  ellipsizeMode="tail"
                >
                  {description + " "}
                  {isReadMore && (
                    <Text style={styles.readMore} onPress={toggleReadMore}>
                      read-less
                    </Text>
                  )}
                </Text>
                {!isReadMore && (
                  <Text style={styles.readMore} onPress={toggleReadMore}>
                    read-more
                  </Text>
                )}
              </>
            )}
          </View>

          {/* mark as done button */}
          <MarkAsDoneButton />

          {/* Vaccination Tag */}
          {category.toLowerCase() === "completed" &&
          attachmentDetails.length !== 0 ? (
            <>
              <Text style={styles.contentTitle}>Vaccination Tag</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {attachmentDetails.map(({ uri }, index) => (
                  <Pressable
                    key={`${uri}--${index}`}
                    onPress={() =>
                      navigation.navigate("Gallery", {
                        uriData: attachmentDetails,
                        selectedImgUri: uri,
                      })
                    }
                  >
                    <Image source={{ uri }} style={styles.thumbnail} />
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}
        </View>
      )}
    </View>
  );
});

export default memo(VaccinationListItem);

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 15,
    elevation: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  syringeIcon: {
    padding: 16,
    borderRadius: 50,
  },
  vaccineName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 16,
    textTransform: "uppercase",
  },
  content: {
    backgroundColor: "#E5F8FF",
    padding: 16,
    paddingTop: 24,
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  vaccineStatus: {
    fontWeight: "bold",
    color: "#F8F8FA",
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 16,
    borderRadius: 50,
    textTransform: "capitalize",
  },
  dueDate: {
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  dueDateIcon: {
    padding: 14,
    borderRadius: 5,
  },
  dueDateTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.textPrimary,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  readMore: {
    color: "#03B44D",
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0.6,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  thumbnail: {
    height: 102,
    width: 150,
    resizeMode: "cover",
    borderRadius: 10,
    marginVertical: 10,
    marginRight: 16,
  },
});
