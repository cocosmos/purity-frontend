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
import { useEffect, useState, useCallback } from "react";
import { getGames } from "@/api/game";
import { usePlayer } from "@/contexts/PlayerContext";
import { startGameSession } from "@/api/gameSession";
import { OrganismPlayer } from "@/components/Organisms/OrganismPlayer";
import { useRouter, useFocusEffect } from "expo-router";

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
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (player) {
        getPlayerFromApi(player.id);
      }
    }, [])
  );

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
      padding="$5"
      borderRadius="$4"
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <YStack flex={1} gap="$6" pb="$10" bg="$background">
        {/* Header Section with Gradient */}
        <YStack
          backgroundColor="$blue5"
          backgroundImage="linear-gradient(135deg, $blue4, $purple4)"
          padding="$5"
          borderRadius="$6"
          marginBottom="$5"
          marginHorizontal="$2"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.15}
          shadowRadius={12}
          elevation={5}
        >
          <H1
            color="white"
            textAlign="center"
            textShadowColor="$blue9"
            textShadowOffset={{ width: 1, height: 1 }}
            textShadowRadius={2}
            marginVertical="$2"
          >
            Purity Game
          </H1>
        </YStack>

        {/* Player Component */}
        <YStack paddingHorizontal="$4">
          <OrganismPlayer
            game={selectedGame}
            onSessionStarted={handleSessionStarted}
            setGame={setSelectedGame}
          />
        </YStack>

        {/* Games Section */}
        <YStack
          backgroundColor="$background"
          borderRadius="$6"
          padding="$4"
          marginHorizontal="$4"
          borderWidth={1}
          borderColor="$borderColor"
          animation="bouncy"
          enterStyle={{ opacity: 0, y: 10 }}
          exitStyle={{ opacity: 0, y: 10 }}
        >
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$4"
          >
            <XStack space="$2" alignItems="center">
              <Paragraph fontSize="$6" fontWeight="bold" color="$blue10">
                Games
              </Paragraph>
            </XStack>
          </XStack>

          <YGroup
            width="100%"
            size="$5"
            separator={<Separator backgroundColor="$gray5" />}
            borderRadius="$4"
            overflow="hidden"
          >
            {games.map((game) => (
              <YGroup.Item key={game.id} width="100%">
                <ListItem
                  hoverTheme
                  pressTheme
                  title={game.name}
                  subTitle={game.description}
                  iconAfter={<ChevronRight size="$2" color="$blue10" />}
                  onPress={() => handleGamePress(game)}
                  disabled={loading}
                  animation="bouncy"
                  pressStyle={{
                    scale: 0.98,
                    backgroundColor: "$blue2",
                  }}
                  borderRadius="$2"
                />
              </YGroup.Item>
            ))}
          </YGroup>
        </YStack>

        {/* Game Sessions Section */}
        {player && player.game_sessions && player.game_sessions.length > 0 && (
          <YStack
            backgroundColor="$background"
            borderRadius="$6"
            padding="$4"
            marginHorizontal="$4"
            borderWidth={1}
            borderColor="$borderColor"
            animation="bouncy"
            enterStyle={{ opacity: 0, y: 10 }}
            exitStyle={{ opacity: 0, y: 10 }}
          >
            <XStack
              justifyContent="space-between"
              alignItems="center"
              marginBottom="$4"
            >
              <XStack space="$2" alignItems="center">
                <Paragraph fontSize="$6" fontWeight="bold" color="$blue10">
                  Game Sessions
                </Paragraph>
              </XStack>
            </XStack>

            <YGroup
              width="100%"
              size="$5"
              separator={<Separator />}
              borderRadius="$4"
              overflow="hidden"
            >
              {player?.game_sessions.map((game_session) => (
                <YGroup.Item key={game_session.id} width="100%">
                  <ListItem
                    hoverTheme
                    pressTheme
                    title={"Game Session #" + game_session.id}
                    subTitle={game_session.status}
                    iconAfter={<ChevronRight size="$2" color="$blue10" />}
                    onPress={() => handleSessionStarted(game_session.id)}
                    disabled={loading}
                    animation="bouncy"
                    pressStyle={{
                      scale: 0.98,
                      backgroundColor: "$blue2",
                    }}
                    borderRadius="$2"
                  />
                </YGroup.Item>
              ))}
            </YGroup>
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
