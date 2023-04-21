import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import CommunityExplore from "../../../assets/images/groupchat.png";
import Button from "../../components/Button";

const ExploreChild = (props) => {
  return (
    <View style={styles.card}>
      <Image source={CommunityExplore} style={styles.image} />
      <View style={{ top: -20 }}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.paragraph}>{props.paragraph}</Text>
        <Button
          style={{ marginTop: 20, width: "50%" }}
          title="Explore"
          onPress={props.onpress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: "18%",
    marginBottom: 30,
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    paddingBottom: 0,
  },
  image: {
    top: -50,
    width: 187,
    height: 127,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
  },
  paragraph: {
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 16,
  },
});

export default ExploreChild;
