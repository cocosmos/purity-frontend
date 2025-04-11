import { Button, XStack } from "tamagui";
import { Check, X } from "@tamagui/lucide-icons";
import { Question } from "@/types/Question";
import { useCallback, memo } from "react";

interface BooleanQuestionProps {
  question: Question;
  onAnswer: (questionAnswerId: number | null, value: boolean) => void;
  isAnswering: boolean;
}

// Memoize the component to prevent unnecessary re-renders
export const BooleanQuestion = memo(function BooleanQuestion({
  question,
  onAnswer,
  isAnswering,
}: BooleanQuestionProps) {
  // Create stable callback references
  const handleTruePress = useCallback(() => {
    onAnswer(null, true);
  }, [onAnswer]);

  const handleFalsePress = useCallback(() => {
    onAnswer(null, false);
  }, [onAnswer]);

  return (
    <XStack
      justifyContent="center"
      alignItems="center"
      padding="$2"
      marginTop="$4"
      gap={"$4"}
      flexWrap="wrap"
    >
      <Button
        size="$5"
        theme="green"
        icon={() => <Check size="$1.5" />}
        onPress={handleTruePress}
        flexGrow={1}
        maxW={"250px"}
      >
        True
      </Button>
      <Button
        size="$5"
        theme="red"
        icon={() => <X size="$1.5" />}
        onPress={handleFalsePress}
        flexGrow={1}
        maxW={"250px"}
      >
        False
      </Button>
    </XStack>
  );
});
