import { useRouter } from "expo-router";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { H4, XStack, Button } from "tamagui";
import { LogoutPopover } from "@/components/Molecules/MoleculeLogoutPopover";

interface HeaderGameSessionProps {
  title: string;
}

export function HeaderGameSession({ title }: HeaderGameSessionProps) {
  const router = useRouter();

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="$4"
      paddingVertical="$2"
    >
      <XStack alignItems="center" space="$2">
        <Button
          chromeless
          circular
          icon={<ChevronLeft size="$1.5" />}
          onPress={() => router.back()}
        />
        <H4 ellipsizeMode="tail" numberOfLines={1} maxWidth={200}>
          {title}
        </H4>
      </XStack>
      <LogoutPopover />
    </XStack>
  );
}
