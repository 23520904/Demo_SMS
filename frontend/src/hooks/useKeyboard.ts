import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent } from "react-native";

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return {
    keyboardHeight,
    isKeyboardVisible,
    dismissKeyboard: Keyboard.dismiss,
  };
};
