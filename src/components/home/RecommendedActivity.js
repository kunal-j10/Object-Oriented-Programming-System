import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const DEVICE_HEIGHT = Dimensions.get("window").height;
const DEVICE_WIDTH =  Dimensions.get("window").width;
const RecommendedActivityCard = (props) => {
  const { onClickActivity, thumbnailUrl, title, category, duration, views } =
    props;

  return (
    <View style={styles.RecommendedActivityCard}>
      <TouchableNativeFeedback onPress={onClickActivity}>
        <View style={styles.row}>
          <View style={styles.imageView}>
            <Image style={styles.image} source={{ uri: thumbnailUrl }} />
          </View>
          <View style={styles.aboutactivity}>
            <View>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {title}
              </Text>
              <Text style={{ fontSize: DEVICE_HEIGHT > 600 ? 14 : 12 }}>
                {category}
              </Text>
            </View>
            <View style={styles.lowerpart}>
              <View style={styles.views}>
                <Feather
                  name={"eye"}
                  size={DEVICE_HEIGHT > 600 ? 24 : 18}
                  color="#18141F"
                />
                <Text style={styles.icon}>{views}</Text>
              </View>
              <View style={styles.row}>
                <Feather
                  name={"clock"}
                  size={DEVICE_HEIGHT > 600 ? 22 : 16}
                  color="#18141F"
                />
                <Text style={styles.icon}>{duration}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const propsCheck = (prev, curr) => {
  prev.thumbnailUrl == curr.thumbnailUrl;
  prev.title == curr.title;
  prev.category == curr.category;
  prev.duration == curr.duration;
  prev.views == curr.views;
};

export default React.memo(RecommendedActivityCard, propsCheck);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  RecommendedActivityCard: {
    marginVertical: 10,
    marginRight: 10,
    flex: 1,
    width: DEVICE_WIDTH*0.9,
    height: DEVICE_HEIGHT * 0.22,
    // width: "100%",
    minHeight: 120,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
  },
  aboutactivity: {
    width: "50%",
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  imageView: {
    width: "50%",
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
  title: {
    fontSize: DEVICE_HEIGHT > 600 ? 16 : 14,
    fontWeight: "bold",
  },
  lowerpart: {
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  views: {
    flexDirection: "row",
    marginRight: 15,
  },
  icon: {
    fontSize: DEVICE_HEIGHT > 600 ? 14 : 12,
    fontWeight: "bold",
    color: "#18141F",
    marginLeft: 5,
  },
});
