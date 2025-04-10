import { usePlayer } from "@/contexts/PlayerContext";
import {
  Adapt,
  Avatar,
  Button,
  Label,
  Paragraph,
  Popover,
  XStack,
  YStack,
} from "tamagui";

export const LogoutPopover = () => {
  const { player, createNewPlayer, clearPlayer } = usePlayer();

  if (!player) return null;

  return (
    <Popover size="$5" allowFlip stayInFrame offset={15} resize>
      <Popover.Trigger asChild>
        <XStack mr="$4" alignItems="center">
          <Avatar circular size="$3">
            <Avatar.Image src={player.avatar} />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>
        </XStack>
      </Popover.Trigger>

      <Adapt when="sm" platform="touch">
        <Popover.Sheet animation="medium" modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay
            backgroundColor="$shadowColor"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0, x: -10 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          "quick",
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack gap="$2" padding="0" backgroundColor="$background">
          <Label size="$5">{player.username}</Label>
          <Popover.Close asChild>
            <Button
              size="$5"
              theme="red"
              onPress={() => clearPlayer()}
              padding="$1"
              paddingHorizontal="$3"
            >
              Logout
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  );
};
