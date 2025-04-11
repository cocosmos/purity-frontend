import { ChevronRight } from "@tamagui/lucide-icons";
import {
  ListItem,
  Paragraph,
  Separator,
  XStack,
  YStack,
  YGroup,
  H1,
  ScrollView,
} from "tamagui";
import { Game } from "@/types/Game";
import { useEffect, useState } from "react";
import { getGames } from "@/api/game";
import { usePlayer } from "@/contexts/PlayerContext";
import { startGameSession } from "@/api/gameSession";
import { OrganismPlayer } from "@/components/Organisms/OrganismPlayer";
import { useRouter } from "expo-router";

export default function TabOneScreen() {
  const router = useRouter();
  const { player, getPlayerFromApi } = usePlayer();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getGames().then((response) => {
      setGames(response.data);
    });

    if (player) {
      getPlayerFromApi(player.id);
    }
  }, []);

  const handleGamePress = async (game: Game) => {
    if (player) {
      try {
        setLoading(true);
        const { data } = await startGameSession(game.id, player.id);
        // Navigate to game session screen
        router.push(`/game/${data.game_session_id}`);
      } catch (error) {
        console.error("Error starting game session:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedGame(game);
    }
  };

  const handleSessionStarted = (sessionId: number) => {
    router.push(`/game/${sessionId}`);
    setSelectedGame(null);
  };

  return (
    <ScrollView
      maxHeight="100%"
      width="100%"
      backgroundColor="$background"
      padding="$4"
      borderRadius="$4"
    >
      <YStack
        flex={1}
        items="center"
        gap="$8"
        px="$10"
        pt="$5"
        bg="$background"
      >
        <H1>Purity Game</H1>

        <OrganismPlayer
          game={selectedGame}
          onSessionStarted={handleSessionStarted}
          setGame={setSelectedGame}
        />

        <XStack $sm={{ flexDirection: "column" }} paddingHorizontal="$4" space>
          <XStack
            $sm={{ flexDirection: "column" }}
            paddingHorizontal="$4"
            space
          >
            <Paragraph fontSize="$5">Games</Paragraph>
            <YGroup
              alignSelf="center"
              bordered
              width={240}
              size="$5"
              separator={<Separator />}
            >
              {games.map((game) => (
                <YGroup.Item key={game.id} width="100%">
                  <ListItem
                    hoverTheme
                    pressTheme
                    title={game.name}
                    subTitle={game.description}
                    iconAfter={<ChevronRight size="$2" />}
                    onPress={() => handleGamePress(game)}
                    disabled={loading}
                  />
                </YGroup.Item>
              ))}
            </YGroup>
          </XStack>
        </XStack>

        {player && player.game_sessions && (
          <XStack
            $sm={{ flexDirection: "column" }}
            paddingHorizontal="$4"
            space
          >
            <XStack
              $sm={{ flexDirection: "column" }}
              paddingHorizontal="$4"
              space
            >
              <Paragraph fontSize="$5">Games Sessions</Paragraph>
              <YGroup
                alignSelf="center"
                bordered
                width={240}
                size="$5"
                separator={<Separator />}
              >
                {player?.game_sessions.map((game_session) => (
                  <YGroup.Item key={game_session.id} width="100%">
                    <ListItem
                      hoverTheme
                      pressTheme
                      title={game_session.id}
                      subTitle={game_session.status}
                      iconAfter={<ChevronRight size="$2" />}
                      onPress={() => handleSessionStarted(game_session.id)}
                      disabled={loading}
                    />
                  </YGroup.Item>
                ))}
              </YGroup>
            </XStack>
          </XStack>
        )}
      </YStack>
    </ScrollView>
  );
}
