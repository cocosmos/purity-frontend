import { Button, XStack } from "tamagui";
import { Check, X } from "@tamagui/lucide-icons";
import { Question } from "@/types/Question";

interface BooleanQuestionProps {
  question: Question;
  onAnswer: (questionAnswerId: number | null, value: boolean) => void;
  isAnswering: boolean;
}

export function BooleanQuestion({
  question,
  onAnswer,
  isAnswering,
}: BooleanQuestionProps) {
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
        icon={<Check size="$1.5" />}
        disabled={isAnswering}
        onPress={() => onAnswer(null, true)}
        flexGrow={1}
        maxW={"250px"}
      >
        True
      </Button>
      <Button
        size="$5"
        theme="red"
        icon={<X size="$1.5" />}
        disabled={isAnswering}
        onPress={() => onAnswer(null, false)}
        flexGrow={1}
        maxW={"250px"}
      >
        False
      </Button>
    </XStack>
  );
}
