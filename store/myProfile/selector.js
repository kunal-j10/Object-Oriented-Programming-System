export const EditProfileLoadingSelector = (state) =>
  state.myProfile.parentEditLoading;

export const PasswordChangeLoadingSelector = (state) =>
  state.myProfile.parentPasswordChnageLoading;

export const FailedPasswordMessageSelector = (state) => state.myProfile.error;

export const MyProfileSectionSelector = (state) =>
  state.myProfile.myProfileSection;

export const errorMessageSelector =(state)=> state.myProfile.error;

export const successMessageSelector = (state)=> state.myProfile.successMessage;
