import {ChevronRight, ExternalLink, Star} from '@tamagui/lucide-icons'
import {Anchor, Card, H2, Image, ListItem, Paragraph, Separator, XStack, YGroup, YStack, Input, Button} from 'tamagui'
import {ToastControl} from "@/components/CurrentToast";
import {Game} from "@/types/Game";
import {useEffect, useState} from "react";
import {getGames} from "@/api/game";
import {GameSession} from "@/types/GameSession";
import {startGameSession} from "@/api/gameSession";
import {Player} from "@/types/Answer";
import {createPlayer} from "@/api/player";

export default function TabOneScreen() {
    const [games, setGames] = useState<Game[]>([]);
    const [gameSession, setGameSession] = useState<GameSession | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [username, setUsername] = useState<string>('');
    useEffect(() => {
        getGames().then((response) => {
            setGames(response.data);
        });
    }, []);

    const handleGamePress = async (game: Game) => {
        const {data} = await startGameSession(game.id, player!.id);
        setGameSession(data.game_session);
    };

    const handlePlayerPress = async () => {
        const {data} = await createPlayer(username);
        setPlayer(data.player);
    };

    return (
        <YStack flex={1} items="center" gap="$8" px="$10" pt="$5" bg="$background">
            <H2>Tamagui + Expo</H2>
            {player ? (
                <Card
                    background="$background"
                    hoverTheme
                    pressTheme
                    padding="$4"
                    borderRadius="$4"
                    width={240}
                    space="$2"
                >
                    {/*<Image*/}
                    {/*    source={{uri: player.avatar}}*/}
                    {/*    width={40}*/}
                    {/*    height={40}*/}
                    {/*    borderRadius="$8"*/}
                    {/*    alt="Player Avatar"*/}
                    {/*/>*/}
                    <Paragraph fontSize="$5">{player.username}</Paragraph>
                </Card>
            ): <XStack alignItems="center" space="$2">
                <Input flex={1} placeholder={`Username`} onChangeText={(text) => setUsername(text)} value={username} />
                <Button onPress={() => handlePlayerPress()}>
                    Create Player
                </Button>
            </XStack>}


            <XStack $sm={{ flexDirection: 'column' }} paddingHorizontal="$4" space>
                <XStack $sm={{ flexDirection: 'column' }} paddingHorizontal="$4" space>
                    <Paragraph fontSize="$5">Games</Paragraph>
                    <YGroup alignSelf="center" bordered width={240} size="$5" separator={<Separator />}>
                        {games.map((game) => (
                            <YGroup.Item key={game.id} width="100%">
                                <ListItem
                                    background={game.image}
                                    hoverTheme
                                    pressTheme
                                    title={game.name}
                                    subTitle={game.description}
                                    iconAfter={<ChevronRight size="$6"/>}
                                    onPress={() => handleGamePress(game)}
                                />
                            </YGroup.Item>
                        ))}
                    </YGroup>

                </XStack>
            </XStack>

            <ToastControl />

            <XStack
                items="center"
                justify="center"
                flexWrap="wrap"
                gap="$1.5"
                position="absolute"
                b="$8"
            >
                <Paragraph fontSize="$5">Add</Paragraph>

                <Paragraph fontSize="$5" px="$2" py="$1" color="$blue10" bg="$blue5">
                    tamagui.config.ts
                </Paragraph>

                <Paragraph fontSize="$5">to root and follow the</Paragraph>

                <XStack
                    items="center"
                    gap="$1.5"
                    px="$2"
                    py="$1"
                    rounded="$3"
                    bg="$green5"
                    hoverStyle={{ bg: '$green6' }}
                    pressStyle={{ bg: '$green4' }}
                >
                    <Anchor
                        href="https://tamagui.dev/docs/core/configuration"
                        textDecorationLine="none"
                        color="$green10"
                        fontSize="$5"
                    >
                        Configuration guide
                    </Anchor>
                    <ExternalLink size="$1" color="$green10" />
                </XStack>

                <Paragraph fontSize="$5" text="center">
                    to configure your themes and tokens.
                </Paragraph>
            </XStack>
        </YStack>
    )
}
