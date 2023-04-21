import React, { useEffect } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-root-toast";

import MusicCard from "../../../components/mom/sleep/MusicCard";
import Colors from "../../../../constants/Colors";
import SleepDiscoverIcon from "../../../../assets/images/mom/sleepDiscoverIcon.png";
import CustomHeaderButton from "../../../components/CustomHeaderButton";
import {
  sleepError,
  sleepExploreCategoriesSelector,
  sleepExploreCategoryLoadingSelector,
  sleepLoadingRecently,
  sleepPlaylistCategoriesSelector,
  sleepPlaylistCategoryLoadingSelector,
  sleepRecentlyPlayed,
} from "../../../../store/sleep/selector";
import {
  sleepFetchExploreCategories,
  sleepFetchPlaylistCategories,
  sleepRecentlyFetch,
  sleepRemoveError,
  sleepSelectSong,
  sleepToggleLike,
} from "../../../../store/sleep/slice";
import { StatusBar } from "expo-status-bar";
import ExploreCategoryCard from "../../../components/mom/sleep/ExploreCategoryCard";
import PopularPlaylistCard from "../../../components/mom/sleep/PopularPlaylistCard";
import likedStoriesIcon from "../../../../assets/images/liked-stories-icon.png";
import likedLullabiesIcon from "../../../../assets/images/liked-lullabies-icon.png";
import likedPlaylistIcon from "../../../../assets/images/liked-playlist-icon.png";
import likedMusicIcon from "../../../../assets/images/liked-music-icon.png";
import YourLibraryCard from "../../../components/mom/sleep/YourLibraryCard";

const data = [
  {
    index: 1,
    songName: "moonchild era",
    artistName: "diljit disanjh",
  },
  {
    index: 2,
    songName: "Batchfkup",
    artistName: "Karan Aujla",
  },
  {
    index: 3,
    songName: "moonchild era",
    artistName: "diljit disanjh",
  },
];

export default function SleepHome({ navigation }) {
  const exploreCategories = useSelector(sleepExploreCategoriesSelector);
  const playlistCategories = useSelector(sleepPlaylistCategoriesSelector);
  const recentlyPlayed = useSelector(sleepRecentlyPlayed);
  const exploreCategoryLoading = useSelector(
    sleepExploreCategoryLoadingSelector
  );
  const playlistCategoryLoading = useSelector(
    sleepPlaylistCategoryLoadingSelector
  );
  const loadingRecently = useSelector(sleepLoadingRecently);
  const error = useSelector(sleepError);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(sleepFetchExploreCategories());
    dispatch(sleepFetchPlaylistCategories());
    dispatch(sleepRecentlyFetch());
  }, []);

  useEffect(() => {
    if (error !== "") {
      Toast.show(error, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(sleepRemoveError());
        },
      });
    }
  }, [error]);

  const handleRefresh = () => {
    dispatch(sleepFetchExploreCategories());
    dispatch(sleepFetchPlaylistCategories());
    dispatch(sleepRecentlyFetch());
  };

  const handleViewRecentlyAll = () => {
    navigation.navigate("ViewSleeps", {
      type: "recentlyPlayed",
      title: "Recently Played",
    });
  };

  const onExploreAndPlaylistPress = (item) => {
    navigation.navigate("ViewSleeps", {
      type: item.type,
      tags: item.tags,
      title: item.title,
      thumbnail: item.thumbnail,
    });
  };

  const onLikedSleepPress = (item) => {
    navigation.navigate("ViewSleeps", {
      type: "likedSleep",
      tags: item.tags,
      title: item.title,
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/adwaita-educare.appspot.com/o/sleep%20music%2Fillustrations%2Fsleep1.jpg?alt=media&token=5d2d3029-fde4-4a51-b296-bf112ffdb8e6",
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={
            exploreCategoryLoading || playlistCategoryLoading || loadingRecently
          }
          onRefresh={handleRefresh}
        />
      }
    >
      <StatusBar style="light" backgroundColor={Colors.appPrimaryColor} />
      {/* Sleep introduction section */}
      <View style={styles.discover}>
        <View>
          <Text style={styles.discoverTitle}>Discover</Text>
          <Text>What do you want to hear?</Text>
        </View>
        <Image source={SleepDiscoverIcon} style={styles.discoverIcon} />
      </View>

      {/* Popular releases section */}
      {/* <View style={{ marginHorizontal: -20 }}>
        <Text style={styles.playlistName}>Popular Releases</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.index}
          ListHeaderComponent={() => <View style={{ marginLeft: 14 }} />}
          ListFooterComponent={() => <View style={{ marginLeft: 16 }} />}
          renderItem={({ item }) => (
            <PopularReleaseItem
              songName={item.songName}
              artistName={item.artistName}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View> */}

      {/* Explore Categories section */}
      {exploreCategories.length !== 0 && (
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.headerTxt}>Explore Categories</Text>
          </View>

          <View style={styles.exploreCategories}>
            {exploreCategories.map((item) => (
              <ExploreCategoryCard
                key={item._id}
                thumbnail={item.thumbnail}
                onPress={() => onExploreAndPlaylistPress(item)}
              />
            ))}
          </View>
        </View>
      )}

      {playlistCategories.length !== 0 && (
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.headerTxt}>Popular Playlist</Text>
          </View>

          <FlatList
            style={{ marginHorizontal: -20 }}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={playlistCategories}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={() => <View style={{ marginLeft: 16 }} />}
            renderItem={({ item }) => (
              <PopularPlaylistCard
                onPress={() => onExploreAndPlaylistPress(item)}
                thumbnail={item.thumbnail}
                title={item.title}
              />
            )}
          />
        </View>
      )}

      {/* Your Libraries section */}
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.headerTxt}>Your Libraries</Text>
        </View>

        <View style={styles.yourLibrary}>
          <YourLibraryCard
            icon={likedMusicIcon}
            title="Liked Music"
            onPress={() =>
              onLikedSleepPress({ tags: ["sleep_music"], title: "Liked Music" })
            }
          />
          <YourLibraryCard
            icon={likedStoriesIcon}
            title="Liked Stories"
            onPress={() =>
              onLikedSleepPress({
                tags: ["sleep_story"],
                title: "Liked Stories",
              })
            }
          />
          {/* <YourLibraryCard
            icon={likedPlaylistIcon}
            title="Liked Playlists"
            onPress={() => {}}
          /> */}
          <YourLibraryCard
            icon={likedLullabiesIcon}
            title="Liked Lullabies"
            onPress={() =>
              onLikedSleepPress({
                tags: ["sleep_lullaby"],
                title: "Liked Lullabies",
              })
            }
          />
        </View>
      </View>

      {/* Recently Played section */}
      {recentlyPlayed.length !== 0 && (
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.headerTxt}>Recent Played</Text>
            <TouchableOpacity onPress={handleViewRecentlyAll}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentlyPlayed.map((item) => (
            <MusicCard
              key={item._id}
              thumbnail={item.imageUrl}
              title={item.title}
              lang={item.language}
              isLiked={item.isLiked}
              onPress={() =>
                dispatch(
                  sleepSelectSong({
                    songId: item._id,
                    queueName: "recentlyPlayed",
                  })
                )
              }
              toggleLike={() =>
                dispatch(sleepToggleLike({ lullabyId: item._id }))
              }
            />
          ))}
        </View>
      )}

      {/* Extra Space */}
      <View style={{ height: 70 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
  },
  discover: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  discoverTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 22,
  },
  discoverIcon: {
    height: 120,
    width: 120,
  },
  search: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 2,
    padding: 16,
    borderRadius: 15,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    backgroundColor: "white",
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 14,
    marginHorizontal: 20,
  },
  section: {
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  headerTxt: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  viewAll: {
    color: Colors.textSecondary,
  },
  exploreCategories: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -14,
  },
  yourLibrary: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export const SleepHomenOptions = ({ navigation }) => {
  return {
    headerTitle: "Sleep",
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
