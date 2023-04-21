import React, { useCallback, useEffect, useMemo } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import { StatusBar } from "expo-status-bar";
import Colors from "../../../../constants/Colors";
import CustomHeaderButton from "../../../components/CustomHeaderButton";
import VideoCard from "../../../components/VideoCard";
import Skelleton from "../../../components/loader/SkeletonLoader";
import {
  rhymesIsVideosRefreshingSelector,
  rhymesIsVideosLoadingSelector,
  ryhmesVideosSelector,
  rhymesListErrortSelector,
  rhymesErrorToastSelector,
} from "../../../../store/rhymes/selector";
import {
  fetchRhymeVideos,
  removeErrorToast,
} from "../../../../store/rhymes/operation";
import Toast from "react-native-root-toast";
import { removeNoInternetAction } from "../../../../store/auth/operation";

export default function LullabyRhymes({ navigation }) {
  // Geting data from store
  const isLoading = useSelector(rhymesIsVideosLoadingSelector);
  const isRefresh = useSelector(rhymesIsVideosRefreshingSelector);
  const videos = useSelector(ryhmesVideosSelector);
  const listError = useSelector(rhymesListErrortSelector);
  const errorToast = useSelector(rhymesErrorToastSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRhymeVideos("loading"));

    return () => {
      dispatch(removeNoInternetAction(fetchRhymeVideos.type));
    };
  }, [dispatch]);

  const fetchvideos = useCallback(() => {
    dispatch(fetchRhymeVideos("refreshing"));
  }, []);

  useEffect(() => {
    if (errorToast !== "") {
      Toast.show(errorToast, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(removeErrorToast());
        },
      });
    }
  }, [errorToast]);

  const keyExtractor = useCallback((item) => item._id, []);

  const RenderItem = useCallback(
    ({ item: video }) => (
      <VideoCard
        videoImage={video.imageUrl}
        title={video.title}
        language={video.language}
        duration={video.duration}
        onPress={() =>
          navigation.navigate("RhymesVideoDetail", { lullabyId: video._id })
        }
      />
    ),
    [navigation?.navigate]
  );

  const EmptyListComponent = useMemo(
    () => (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTxt}>
          {listError || " No Lullaby and Rhymes found for this age group!"}
        </Text>
      </View>
    ),
    [listError]
  );

  if (isLoading) {
    return (
      <View style={{ alignItems: "center" }}>
        <Skelleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={videos}
        refreshing={isRefresh}
        onRefresh={fetchvideos}
        keyExtractor={keyExtractor}
        renderItem={RenderItem}
        ListEmptyComponent={EmptyListComponent}
        ListFooterComponent={<View style={{ height: 60 }} />}
      />
    </View>
  );
}

export const LullabyRhymesOptions = ({ navigation }) => {
  return {
    headerTitle: "Lullaby & Rhymes",
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundTxt: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
    marginHorizontal: 15,
    textAlign: "center",
  },
});
