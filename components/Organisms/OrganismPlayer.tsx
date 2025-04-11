import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Card,
  Paragraph,
  XStack,
  YStack,
  Image,
  Dialog,
  Unspaced,
  H4,
  useMedia,
} from "tamagui";
import { usePlayer } from "@/contexts/PlayerContext";
import { Game } from "@/types/Game";
import { startGameSession } from "@/api/gameSession";
import { FormField } from "@/components/FormField";
import { useFormErrors } from "@/contexts/FormErrorContext";
import { Platform, Keyboard, KeyboardAvoidingView } from "react-native";

interface OrganismPlayerProps {
  game?: Game | null;
  onSessionStarted: (sessionId: number) => void;
  setGame: (game: Game | null) => void;
}

export const OrganismPlayer = ({
  game,
  onSessionStarted,
  setGame,
}: OrganismPlayerProps) => {
  const { player, createNewPlayer } = usePlayer();
  const { clearFieldErrors } = useFormErrors();
  const [username, setUsername] = useState<string>("");
  const [open, setOpen] = useState(false);
  const media = useMedia();

  const handleCreatePlayer = useCallback(async () => {
    if (!username.trim()) return;

    try {
      const newPlayer = await createNewPlayer(username);

      if (game && newPlayer) {
        const { data } = await startGameSession(game.id, newPlayer.id);
        onSessionStarted(data.game_session_id);
      }

      setOpen(false);
    } catch (error) {
      console.error("Error creating player:", error);
    }
  }, [username, game, createNewPlayer, onSessionStarted, setOpen]);

  useEffect(() => {
    if (game && !player) {
      setOpen(true);
    }
  }, [game, player]);

  const handleCloseModal = useCallback(() => {
    Keyboard.dismiss();
    setOpen(false);
    setGame(null);
    setUsername("");
    clearFieldErrors();
  }, [setOpen, setGame, setUsername, clearFieldErrors]);

  return (
    <>
      <Dialog modal open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            space
            width={media.sm ? "90%" : "450px"}
            maxWidth="95%"
            padding="$3"
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: "100%" }}
              keyboardVerticalOffset={100}
            >
              <Dialog.Title>Create a Player</Dialog.Title>
              <Dialog.Description>
                To start playing {game?.name || "this game"}, you need to create
                a player first.
              </Dialog.Description>

              <YStack space="$3" padding="$2" marginBottom="$3">
                <H4>Enter your username</H4>
                <FormField
                  name="username"
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Your username"
                  autoCapitalize="none"
                  autoFocus
                  onSubmitEditing={
                    username.trim() ? handleCreatePlayer : undefined
                  }
                  returnKeyType="done"
                />
              </YStack>

              <XStack alignSelf="flex-end" gap="$3" marginBottom="$2">
                <Dialog.Close asChild>
                  <Button variant="outlined" onPress={handleCloseModal}>
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  theme="active"
                  onPress={handleCreatePlayer}
                  disabled={!username.trim()}
                >
                  Create Player
                </Button>
              </XStack>
            </KeyboardAvoidingView>

            <Unspaced>
              <Dialog.Close asChild>
                <Button
                  position="absolute"
                  top="$3"
                  right="$3"
                  size="$2"
                  circular
                  icon={<Paragraph>✕</Paragraph>}
                  onPress={handleCloseModal}
                />
              </Dialog.Close>
            </Unspaced>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
};
