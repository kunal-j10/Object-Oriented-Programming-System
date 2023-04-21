import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-root-toast";

export default function useToast(
  selector,
  removeDispatch,
  ToastOptions = {},
) {
  const message = useSelector(selector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (message !== "") {
      Toast.show(message, {
        
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          dispatch(removeDispatch());
        },
        ...ToastOptions,
      });
    }
  }, [message]);

  return message;
}
