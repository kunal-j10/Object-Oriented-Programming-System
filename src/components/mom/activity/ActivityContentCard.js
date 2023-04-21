import React from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  AntDesign,
  Feather,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import Color from "../../../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import { Toastlike } from "../../../../store/activity/selector";
const { height: windowHeight, width: WindowWidth } = Dimensions.get("window");
import { removeToastLike } from "../../../../store/activity/slice";
const ActivityContentCard = ({
  isliked,
  toggleLike,
  views,
  like,
  imageUrl,
  title,
  height,
  onShareClick
}) => {
  const toastmessage = useSelector(Toastlike);
  const dispatch = useDispatch();
  useEffect(() => {
    if (toastmessage) {
      Toast.show(toastmessage, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
      });
      dispatch(removeToastLike());
    }
  }, [toastmessage]);

  return (
    <View style={{ width: WindowWidth }}>
      <Image
        style={{ height: height * 0.78, width: WindowWidth ,resizeMode:'contain'}}
        source={{ uri: imageUrl[0] }}
      />
      <View style={styles.infosection}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.socialsection}>
          <View
            style={{
              width: "30%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={toggleLike}>
                <AntDesign
                  name={isliked ? "heart" : "hearto"}
                  size={windowHeight > 600 ? 24 : 18}
                  color="#18141F"
                />
              </TouchableOpacity>
              <Text style={{ marginLeft: 8, fontSize: 14 }}>{like}</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Feather
                name={"eye"}
                size={windowHeight > 600 ? 24 : 18}
                color="#18141F"
              />
              <Text style={{ marginLeft: 8, fontSize: 14 }}>{views}</Text>
            </View>
          </View>
          <View
            style={{
              width: "30%",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            {/* <MaterialIcons
              name={"facebook"}
              size={windowHeight > 600 ? 24 : 18}
              color={Color.primary}
            />
            <Ionicons
              name={"logo-whatsapp"}
              size={windowHeight > 600 ? 24 : 18}
              color={Color.primary}
            /> */}
            <TouchableOpacity onPress={onShareClick}>
              <AntDesign
                name={"sharealt"}
                size={23}
                color="black"
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ActivityContentCard;

const styles = StyleSheet.create({
  infosection: {
    paddingHorizontal: 15,
    paddingTop: 15,
    width: WindowWidth,
  },
  title: {
    fontSize: WindowWidth > 480 ? 20 : 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: WindowWidth > 480 ? 15 : 14,
    color: "rgba(24, 20, 31, 0.6)",
    fontWeight: "bold",
  },
  socialsection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
