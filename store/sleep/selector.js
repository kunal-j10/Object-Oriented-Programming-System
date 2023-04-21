export const sleepQueue = (state) => state.sleep.queue;

export const sleepSelectedSong = (state) => state.sleep.selectedSong;

export const sleepPrevSongId = (state) => state.sleep.prevSongId;

export const sleepIsPlaying = (state) => state.sleep.isPlaying;

export const sleepIsBuff = (state) => state.sleep.isBuff;

export const sleepElapsedString = (state) => state.sleep.elapsedString;

export const sleepElapsedMill = (state) => state.sleep.elapsedMill;

export const sleepTotalMill = (state) => state.sleep.totalMill;

export const sleepTotalString = (state) => state.sleep.totalString;

export const sleepLoop = (state) => state.sleep.loop;

export const sleepLoopWarn = (state) => state.sleep.loopWarn;

export const sleepRecentlyPlayed = (state) => state.sleep.recentlyPlayed;

export const sleepDetailView = (state) => state.sleep.detailView;

export const sleepDetailViewCountSelector = (state) =>
  state.sleep.detailViewCount;

export const sleepExploreCategoriesSelector = (state) =>
  state.sleep.exploreCategories;

export const sleepPlaylistCategoriesSelector = (state) =>
  state.sleep.playlistCategories;

export const sleepExploreCategoryLoadingSelector = (state) =>
  state.sleep.exploreCategoryLoading;

export const sleepPlaylistCategoryLoadingSelector = (state) =>
  state.sleep.playlistCategoryLoading;

export const sleepTimer = (state) => state.sleep.timer;

export const sleepLoadingDetail = (state) => state.sleep.loadingDetail;

export const sleepLoadingAll = (state) => state.sleep.loadingAllSleep;

export const sleepLoadingRecently = (state) => state.sleep.loadingRecently;



export const sleepError = (state) => state.sleep.error;

export const sleepListError = (state) => state.sleep.listError;
