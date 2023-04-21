import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { sleepQueue, sleepRecording } from "../../../../store/sleep/selector";
import { useSelector } from "react-redux";
import MusicQueueCard from "../../../components/mom/sleep/MusicQueueCard";
import { useDispatch } from "react-redux";
import CustomHeaderButton from "../../../components/CustomHeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { sleepSelectSong, sleepToggleLike } from "../../../../store/sleep/slice";
import { useCallback } from "react";

export default function Queue() {
  const queue = useSelector(sleepQueue);

  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Queue</Text>
      <FlatList
        data={queue}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MusicQueueCard
            thumbnail={item.imageUrl}
            title={item.title}
            lang={item.language}
            isLiked={item.isLiked}
            onPress={() =>
              dispatch(
                sleepSelectSong({
                  songId: item._id,
                  queueName: "queue",
                })
              )
            }
            toggleLike={() => dispatch(sleepToggleLike({ lullabyId: item._id }))}
            onExtraOptPress={() => {}}
          />
        )}
        ListEmptyComponent={
          <View style={{}}>
            <Text style={{ textAlign: "center", fontSize: 16, marginTop: 50 }}>
              No Sleep Added
            </Text>
          </View>
        }
        ListFooterComponent={() => <View style={{ marginBottom: 50 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
});

export const QueueOptions = ({ navigation }) => {
  return {
    headerTitle: "Queue",
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
