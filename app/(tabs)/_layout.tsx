import { Stack, Tabs } from "expo-router";
import { useTheme } from "tamagui";
import { Atom } from "@tamagui/lucide-icons";
import { LogoutPopover } from "@/components/Molecules/MoleculeLogoutPopover";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Purity Game",
          headerRight: () => <LogoutPopover />,
        }}
      />
    </Stack>
  );
}
