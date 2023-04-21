import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Image,
    TouchableNativeFeedback,
  } from "react-native";
  import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const ActivityCard = (props) => {
 

    return (
      
        <View style={styles.activityCard}>
         <TouchableNativeFeedback onPress = {props.onClickActivity}>
            <View style = {{flexDirection: 'row'}}>
        <View style={styles.imageView}>
          <Image
            style={styles.image}
            source={{uri: props.thumbnailUrl}}
          />
        </View>
        <View style={styles.aboutactivity}>
          <View
            style={{ flexDirection: "column", justifyContent: "space-between" }}
          >
            <View style={styles.upperpart}>
              <Text style={{ fontSize: DEVICE_HEIGHT > 600 ? 16 : 14, fontWeight: "bold",flexBasis: '65%' }}>
               {props.title}
              </Text>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: DEVICE_HEIGHT > 600 ?10:5,
                  height: DEVICE_HEIGHT > 600 ?30:25,
                  backgroundColor: props.status == "new" ? "#F8BA03" : "#03B44D",
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{ fontWeight: "bold", color: "white", fontSize: DEVICE_HEIGHT > 600 ? 14 : 12  }}
                >
                  {props.status == "new" ? "Pending": "Completed"}
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: DEVICE_HEIGHT > 600 ? 14 : 12  }}>{props.agegroup}</Text>
          </View>
          <View style={styles.lowerpart}>
            <View
              style={{ flexDirection: "row" }}
            >
              <View style={{ flexDirection: "row",marginRight: 15 }}>
                <Feather name={"eye"} size={DEVICE_HEIGHT > 600 ?24:18} color="#18141F" />
                <Text
                  style={{
                    fontSize: DEVICE_HEIGHT > 600 ? 14 : 12,
                    fontWeight: "bold",
                    color: "#18141F",
                    marginLeft: 5,
                  }}
                >
                  {props.views}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Feather name={"clock"} size={DEVICE_HEIGHT > 600 ?24:18} color="#18141F" />
                <Text
                  style={{
                    fontSize: DEVICE_HEIGHT > 600 ? 14 : 12,
                    fontWeight: "bold",
                    color: "#18141F",
                    marginLeft: 5,
                  }}
                >
                  {props.duration}
                </Text>
              </View>
            </View>
          </View>
        </View>
        </View>
        </TouchableNativeFeedback>
      </View>
    
        )
}
export default ActivityCard;

const styles = StyleSheet.create({
    activityCard: {
        marginVertical: DEVICE_HEIGHT > 600 ? 10 : 20,
        width: "100%",
        height: DEVICE_HEIGHT * 0.170,
        minHeight: 120,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        elevation: 5,
        shadowColor: "black",
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        overflow: "hidden",
        flexDirection: 'row'
      },
      aboutactivity: {
        width: "70%",
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between'
      },
      imageView: {
        width: "30%",
        height: "100%",
      },
      image: {
        width: "100%",
        height: "100%",
      },
      upperpart: {
        flexDirection: "row",
        justifyContent: "space-between",
      },
      lowerpart: {
        width: "100%",
        alignItems: 'flex-end'
      },
});