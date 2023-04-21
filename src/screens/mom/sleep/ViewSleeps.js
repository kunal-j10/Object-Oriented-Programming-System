import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomHeaderButton from "../../../components/CustomHeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Ionicons, Entypo } from "@expo/vector-icons";

import {
  sleepDetailFetch,
  sleepPlayAll,
  sleepSelectSong,
  sleepToggleLike,
} from "../../../../store/sleep/slice";
import Skelleton from "../../../components/loader/SkeletonLoader";
import MusicCard from "../../../components/mom/sleep/MusicCard";
import {
  sleepDetailView,
  sleepDetailViewCountSelector,
  sleepListError,
  sleepLoadingDetail,
} from "../../../../store/sleep/selector";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../../../constants/Colors";

export default function ViewSleeps({ route, navigation }) {
  const { height, width } = useWindowDimensions();

  const list = useSelector(sleepDetailView);
  const listError = useSelector(sleepListError);
  const loading = useSelector(sleepLoadingDetail);
  const count = useSelector(sleepDetailViewCountSelector);
  const detailView = useSelector(sleepDetailView);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      sleepDetailFetch({
        type: route.params?.type,
        tags: route.params?.tags,
      })
    );
  }, []);

  const playAllSongs = () => {
    dispatch(sleepPlayAll(detailView));
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Skelleton />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: route.params?.thumbnail }}
        style={{
          width,
          height: height * 0.35,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          marginBottom: 30,
          overflow: "hidden",
        }}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: 12,
            alignSelf: "flex-start",
            borderBottomRightRadius: 15,
          }}
          onPress={() => navigation.navigate("SleepHome")}
        >
          <Ionicons name="chevron-back" size={26} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.45)",
              padding: 20,
              paddingBottom: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {route.params?.title}
              </Text>
              <Text style={{ color: "white", marginLeft: 10 }}>
                {count} songs
              </Text>
            </View>

            <TouchableOpacity
              style={{
                padding: 14,
                backgroundColor: Colors.appPrimaryColor,
                borderRadius: 28,
              }}
              onPress={playAllSongs}
            >
              <Entypo name="controller-play" size={30} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        {/* <View
          style={{
            position: "absolute",
            left: width * 0.73,
            bottom: -31,
            width: "100%",
            backgroundColor: "white",
          }}
        >
        </View> */}
      </ImageBackground>

      <FlatList
        data={list}
        keyExtractor={(item) => item._id}
        style={{ paddingHorizontal: 15 }}
        renderItem={({ item }) => (
          <MusicCard
            thumbnail={item.imageUrl}
            title={item.title}
            lang={item.language}
            isLiked={item.isLiked}
            onPress={() =>
              dispatch(
                sleepSelectSong({
                  songId: item._id,
                  queueName: "detailView",
                })
              )
            }
            toggleLike={() =>
              dispatch(sleepToggleLike({ lullabyId: item._id }))
            }
          />
        )}
        ListEmptyComponent={
          <View style={{}}>
            <Text style={{ textAlign: "center", fontSize: 16, marginTop: 50 }}>
              {listError !== "" ? listError : "No Sleep Added"}
            </Text>
          </View>
        }
        ListFooterComponent={() => <View style={{ marginBottom: 50 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loading: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const ViewSleepsOptions = ({ navigation, route }) => {
  return {
    headerTitle: route.params.title,
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
