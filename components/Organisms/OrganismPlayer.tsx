import { useEffect, useState } from "react";
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
} from "tamagui";
import { usePlayer } from "@/contexts/PlayerContext";
import { Game } from "@/types/Game";
import { startGameSession } from "@/api/gameSession";
import { FormField } from "@/components/FormField";
import { useFormErrors } from "@/contexts/FormErrorContext";

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
  const [loading, setLoading] = useState(false);

  const handleCreatePlayer = async () => {
    if (!username.trim()) return;

    setLoading(true);
    try {
      const newPlayer = await createNewPlayer(username);

      if (game && newPlayer) {
        const { data } = await startGameSession(game.id, newPlayer.id);
        onSessionStarted(data.game_session_id);
      }

      setOpen(false);
    } catch (error) {
      console.error("Error creating player:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (game && !player) {
      setOpen(true);
    }
  }, [game]);

  const handleCloseModal = () => {
    setOpen(false);
    setGame(null);
    setUsername("");
    clearFieldErrors(); // Clear any field errors when closing the modal
  };

  /*   if (player) {
    return (
      <Card
        background="$background"
        hoverTheme
        pressTheme
        padding="$4"
        borderRadius="$4"
        width={240}
        space="$2"
      >
        <XStack alignItems="center" space="$2">
          {player.avatar && (
            <Image
              source={{ uri: player.avatar }}
              width={40}
              height={40}
              borderRadius="$8"
              alt={player.username}
            />
          )}
          <Paragraph fontSize="$5">{player.username}</Paragraph>
        </XStack>
      </Card>
    );
  } */

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
          >
            <Dialog.Title>Create a Player</Dialog.Title>
            <Dialog.Description>
              To start playing {game?.name || "this game"}, you need to create a
              player first.
            </Dialog.Description>

            <YStack space="$3" padding="$2">
              <H4>Enter your username</H4>
              <FormField
                name="username"
                value={username}
                onChangeText={setUsername}
                placeholder="Your username"
                autoCapitalize="none"
              />
            </YStack>

            <XStack alignSelf="flex-end" gap="$3">
              <Dialog.Close asChild onPress={handleCloseModal}>
                <Button variant="outlined">Cancel</Button>
              </Dialog.Close>
              <Button
                theme="active"
                onPress={handleCreatePlayer}
                disabled={!username.trim() || loading}
                loading={loading}
              >
                Create Player
              </Button>
            </XStack>

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
