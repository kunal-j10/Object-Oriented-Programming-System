import React, { useState } from "react";
import { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function ImageGrid(props) {
  const { uriData, onImagePress } = props;

  const [uriList, setUriList] = useState(uriData);
  const [moreThan2, setMoreThan2] = useState(false);

  useEffect(() => {
    if (typeof uriData[0] !== "string") {
      setUriList(uriData.map((item) => item.fileUrl));
    }
    if (uriData.length > 2) {
      setMoreThan2(true);
    }
  }, []);

  useEffect(() => {
    if (moreThan2) {
      setUriList((prev) => prev.slice(0, 2));
    }
  }, [moreThan2]);

  return (
    typeof uriList[0] === "string" && (
      <View style={styles.container}>
        {uriList.map((uri, idx) => (
          <View key={`${uri}-${idx}`} style={{ flex: 1, flexDirection: "row" }}>
            <Pressable style={{ flex: 1 }} onPress={() => onImagePress(uri)}>
              <>
                <Image
                  style={[styles.image, idx === 1 && styles.separator]}
                  source={{ uri }}
                />
                {idx === 1 && moreThan2 && (
                  <View style={styles.moreThan}>
                    <Text style={styles.moreThanTxt}>
                      +{uriData.length - 1}
                    </Text>
                  </View>
                )}
              </>
            </Pressable>
          </View>
        ))}
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    height: 150,
    resizeMode: "cover",
  },
  moreThan: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.65)",
  },
  moreThanTxt: {
    color: "#fff",
    fontSize: 20,
  },
  separator: {
    borderLeftWidth: 2,
  },
});
