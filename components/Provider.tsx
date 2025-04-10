import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { CurrentToast } from "./CurrentToast";
import { FormErrorsProvider } from "@/contexts/FormErrorContext";
import { APIInterceptorProvider } from "@/contexts/APIInterceptorContext";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider
      config={config}
      defaultTheme={colorScheme === "dark" ? "dark" : "light"}
    >
      <ToastProvider
        swipeDirection="horizontal"
        duration={6000}
        native={
          [
            // uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go
            // 'mobile'
          ]
        }
      >
        <FormErrorsProvider>
          <APIInterceptorProvider>
            <PlayerProvider>
              {children}
              <CurrentToast />
              <ToastViewport top="$8" left={0} right={0} />
            </PlayerProvider>
          </APIInterceptorProvider>
        </FormErrorsProvider>
      </ToastProvider>
    </TamaguiProvider>
  );
};
