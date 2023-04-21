import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Animated,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";

import Colors from "../../../../constants/Colors";
import CreateComment from "../../community/CreateComment";
import FirstLevelComment from "../../community/FirstLevelComment";
import {
  activityFetchLvl1Com,
  activityFetchLvl2Com,
  activityRemoveLvl2Com,
  activityAddCom,
  activityToggleComLike,
  activitySetReplyHandler,
  activityCloseReplyHandler,
  activityCommentDelete,
  activityRemoveSuccessMessage,
} from "../../../../store/activity/operation";
import {
  activityComReachedTillEndSelector,
  activityIsComLoadingSelector,
  activityLvl1comSelector,
  activityLvl1ParentNameSelector,
  activityLvl2comSelector,
  activitySuccessMessageSelector,
} from "../../../../store/activity/selector";
import ExtraOptionModalComment from "../../community/ExtraOptionModalComment";
import useToast from "../../../hooks/useToast";

const ActivityContentComments = React.forwardRef((props, ref) => {
  const { selectedActivityId, paddingTop, onScroll } = props;

  const [lvl2Expanded, setLvl2Expanded] = useState([]);
  const [isModalVis, setIsModalVis] = useState(false);
  const [selectedCommObj, setSelectedCommObj] = useState(null);

  const inputRef = useRef(null);

  const lvl1comments = useSelector(activityLvl1comSelector);
  const commentReachedTillEnd = useSelector(activityComReachedTillEndSelector);
  const lvl1ParentName = useSelector(activityLvl1ParentNameSelector);
  const lvl2comments = useSelector(activityLvl2comSelector);
  const isLoading = useSelector(activityIsComLoadingSelector);

  useToast(activitySuccessMessageSelector, activityRemoveSuccessMessage);

  const route = useRoute();
  const navigation = useNavigation();

  const dispatch = useDispatch();

  // Toggle Lvl2 of given commentId
  const toggleLvl2 = (commentId, status) => {
    if (status) {
      setLvl2Expanded([...lvl2Expanded, commentId]);
    } else {
      setLvl2Expanded(lvl2Expanded.filter((id) => id !== commentId));
    }
  };

  // Add Comment for given post
  const addComment = (comment) => {
    if (comment === "") {
      return;
    }
    dispatch(activityAddCom({ activityId: selectedActivityId, comment }));
    Keyboard.dismiss();
  };

  const replyHandler = (lvl1ComId, lvl1ParentName) => {
    dispatch(activitySetReplyHandler({ lvl1ComId, lvl1ParentName }));
    inputRef.current.focus();
  };

  const replyCLoseHandler = () => {
    dispatch(activityCloseReplyHandler());
    Keyboard.dismiss();
  };

  const addExtra = () => {
    dispatch(activityFetchLvl1Com({ activityId: selectedActivityId }));
  };

  const extraOptionModalOpen = (commentObj) => {
    setIsModalVis(true);
    setSelectedCommObj(commentObj);
  };

  const extraOptionModalClose = () => {
    setIsModalVis(false);
    setSelectedCommObj(null);
  };

  const deleteComment = (commentId) => {
    Alert.alert(
      "Delete comment",
      "Are you sure, you want to delete these comment",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setIsModalVis(false);
            dispatch(
              activityCommentDelete({
                commentId,
                activityId: selectedActivityId,
              })
            );
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  const reportComment = (commentId) => {
    setIsModalVis(false);

    navigation.navigate("ReportSuggestion", {
      reportId: commentId,
      returnScreen: route.name,
    });
  };

  const loadingFooter = () =>
    !commentReachedTillEnd ? (
      <ActivityIndicator
        size="large"
        color={Colors.primary}
        style={{ marginBottom: paddingTop }}
      />
    ) : (
      <Text style={[styles.flatListFooterStyle, { marginBottom: paddingTop }]}>
        ---------
      </Text>
    );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: paddingTop,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Animated.FlatList
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop }}
        onScroll={onScroll}
        ref={ref}
        data={lvl1comments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <FirstLevelComment
            data={item}
            lvl2Data={lvl2comments.filter(
              (comment) => comment.level1_comment_id === item._id
            )}
            lvl2Expanded={lvl2Expanded.includes(item._id)}
            setLvl2Expanded={toggleLvl2}
            replyHandler={replyHandler}
            fetchLvl2Com={(id) => dispatch(activityFetchLvl2Com(id))}
            removeLvl2Com={(id) => dispatch(activityRemoveLvl2Com(id))}
            toggleComLike={(commentObj) =>
              dispatch(activityToggleComLike(commentObj))
            }
            extraOptionModalOpen={extraOptionModalOpen}
          />
        )}
        onEndReached={addExtra}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loadingFooter}
      />
      <CreateComment
        ref={inputRef}
        addComment={addComment}
        replyCLoseHandler={replyCLoseHandler}
        lvl1ParentName={lvl1ParentName}
      />

      <ExtraOptionModalComment
        isModalVis={isModalVis}
        commentObj={selectedCommObj}
        modalClose={extraOptionModalClose}
        deleteComment={deleteComment}
        reportComment={reportComment}
      />
    </View>
  );
});

export default React.memo(ActivityContentComments);

const styles = StyleSheet.create({
  section: {
    flex: 1,
    paddingTop: 20,
    width: "100%",
  },
  flatListFooterStyle: {
    fontSize: 15,
    color: "gray",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 25,
  },
});
