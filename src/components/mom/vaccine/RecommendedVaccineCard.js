import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableNativeFeedback,
  Pressable
} from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment";

const DEVICE_HEIGHT = Dimensions.get("window").height;
const DEVICE_WIDTH =  Dimensions.get("window").width;

const ReccommendedVaccineCard = ({vaccineName,dueDate,pricePerDose,label,onPress}) => {

  const array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <Pressable
        style={[styles.vaccineCard]}
      onPress = {onPress}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexBasis: "20%",
          }}
        >
          <Text style={{ color: "#19C190", fontSize: 12, fontWeight: "bold" }}>
       
            {array[moment(dueDate).month()]}
          </Text>
          <Text style={{ color: "#19C190", fontSize: 30, fontWeight: "bold" }}>
            {moment(dueDate).date()}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-evenly",
            flexBasis: "80%",
            paddingLeft: 20,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{ fontSize: 15, fontWeight: "bold", color: "black" }}
              >
                {vaccineName}
              </Text>
              <View>
                <Text
                  style={{ fontSize: 10, fontWeight: "bold", color: "black" }}
                >
                  Price/Dose
                </Text>
                <Text
                  style={{ fontSize: 10, fontWeight: "bold", color: "#B2B2B2" }}
                >
                  ₹ {pricePerDose}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginLeft: 10,
                paddingHorizontal: 5,
                backgroundColor: "#FFC929",
                alignItems: "center",
                justifyContent: "center",
                height: 25,
                borderRadius: 10,
              }}
            >
              <Text
                style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "bold" }}
              >
                {label}
              </Text>
            </View>
          </View>
          <View>
          </View>
        </View>
      </Pressable>
  );
};





const styles = StyleSheet.create({

    vaccineCard: {
        marginVertical: 12,
        marginHorizontal: 16,
        height: 120,
        borderRadius: 15,
        elevation: 6,
        shadowColor: "#000000",
        shadowOpacity: 0.15,
        shadowRadius: 15,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        flexDirection: "row",
        paddingHorizontal: 10,
      },
 
});

export default ReccommendedVaccineCard
