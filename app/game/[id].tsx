import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  YStack,
  XStack,
  H2,
  Paragraph,
  Button,
  Spinner,
  Progress,
  Card,
  ScrollView,
  H3,
} from "tamagui";
import { getGameSession, answerQuestion } from "@/api/gameSession";
import { usePlayer } from "@/contexts/PlayerContext";
import { Question, QuestionType } from "@/types/Question";
import { GameSession } from "@/types/GameSession";
import { useFormErrors } from "@/contexts/FormErrorContext";
import { LogoutPopover } from "@/components/Molecules/MoleculeLogoutPopover";
import { BooleanQuestion } from "@/components/Questions/BooleanQuestion";
import { MultipleChoiceQuestion } from "@/components/Questions/MultipleChoiceQuestion";
import { RangeQuestion } from "@/components/Questions/RangeQuestion";
import { GameResultsCard } from "@/components/Molecules/GameResultsCard";

export default function GameSessionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { player, getPlayerFromApi } = usePlayer();
  const { clearFieldErrors } = useFormErrors();
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const loadGameSession = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data } = await getGameSession(Number(id));
      setGameSession(data.game_session);

      // Check if session is completed
      if (!data.game_session.current_question) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Error loading game session:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!player) {
      router.replace("/");
      return;
    }

    loadGameSession();

    // Clear form errors when component unmounts
    return () => {
      clearFieldErrors();
    };
  }, [id, player]);

  const handleAnswer = useCallback(
    async (questionAnswerId: number | null, value: number | boolean | null) => {
      if (!gameSession?.current_question || answering) return;

      try {
        setAnswering(true);
        clearFieldErrors(); // Clear any existing errors

        const { data } = await answerQuestion(
          gameSession.id,
          gameSession.current_question.id,
          questionAnswerId,
          value
        );

        // Update game session with next question from response
        setGameSession((prev) => {
          if (!prev) return null;

          return {
            ...prev,
            current_question: data.next_question || null,
            answered_questions: prev.answered_questions + 1,
          };
        });

        // Check if we've completed all questions
        if (!data.next_question) {
          setIsCompleted(true);
        }
      } catch (error) {
        console.error("Error answering question:", error);
      } finally {
        setAnswering(false);
      }
    },
    [gameSession, answering, clearFieldErrors]
  );

  const handleBooleanAnswer = useCallback(
    (questionAnswerId: number | null, value: boolean) => {
      handleAnswer(null, value);
    },
    [handleAnswer]
  );

  const handleMultipleChoiceAnswer = useCallback(
    (optionId: number) => {
      handleAnswer(optionId, null);
    },
    [handleAnswer]
  );

  const handleRangeAnswer = useCallback(
    (questionAnswerId: number | null, value: number) => {
      handleAnswer(null, value);
    },
    [handleAnswer]
  );

  // Helper function to render the appropriate question component
  const renderQuestion = () => {
    const question = gameSession?.current_question;
    if (!question) return null;
    switch (question.type) {
      case QuestionType.BOOLEAN:
        return (
          <BooleanQuestion
            question={question}
            onAnswer={handleBooleanAnswer}
            isAnswering={answering}
          />
        );
      case QuestionType.MULTIPLE:
        return (
          <MultipleChoiceQuestion
            question={question}
            onAnswer={handleMultipleChoiceAnswer}
            isAnswering={answering}
          />
        );
      default:
        // Handle range questions (if they exist in your system)
        if (
          question.min_value !== undefined &&
          question.max_value !== undefined
        ) {
          return (
            <RangeQuestion
              question={question}
              minValue={question.min_value}
              maxValue={question.max_value}
              onAnswer={handleRangeAnswer}
              isAnswering={answering}
            />
          );
        }
        return (
          <Paragraph>Unsupported question type: {question.type}</Paragraph>
        );
    }
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Spinner size="large" />
        <Paragraph marginTop="$4">Loading game session...</Paragraph>
      </YStack>
    );
  }

  if (isCompleted) {
    return <GameResultsCard gameSession={gameSession} />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: gameSession?.game.name || "Game Session",
          headerRight: () => <LogoutPopover />,
        }}
      />
      <ScrollView>
        <YStack flex={1} padding="$4" space="$4">
          {gameSession && (
            <>
              <Card padding="$4" bordered>
                <H2>{gameSession.game.name}</H2>
                <Paragraph>{gameSession.game.description}</Paragraph>
              </Card>

              <YStack marginVertical="$4">
                <XStack justifyContent="space-between" marginBottom="$2">
                  <Paragraph>Progress</Paragraph>
                  <Paragraph>
                    {gameSession.answered_questions} /{" "}
                    {gameSession.total_questions}
                  </Paragraph>
                </XStack>
                <Progress
                  value={
                    (gameSession.answered_questions /
                      gameSession.total_questions) *
                    100
                  }
                >
                  <Progress.Indicator animation="bouncy" />
                </Progress>
              </YStack>

              {gameSession.current_question && (
                <Card
                  bordered
                  padding="$4"
                  marginVertical="$4"
                  borderColor="$accentColor"
                >
                  <YStack space="$4" alignItems="center">
                    <H3>{gameSession.current_question.question}</H3>
                    {renderQuestion()}
                  </YStack>
                </Card>
              )}
            </>
          )}
        </YStack>
      </ScrollView>
    </>
  );
}
