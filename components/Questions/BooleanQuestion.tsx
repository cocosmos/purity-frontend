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
    <XStack justifyContent="space-around" marginTop="$4">
      <Button
        size="$5"
        theme="green"
        icon={<Check size="$1.5" />}
        disabled={isAnswering}
        onPress={() => onAnswer(null, true)}
        paddingHorizontal="$8"
      >
        True
      </Button>
      <Button
        size="$5"
        theme="red"
        icon={<X size="$1.5" />}
        disabled={isAnswering}
        onPress={() => onAnswer(null, false)}
        paddingHorizontal="$8"
      >
        False
      </Button>
    </XStack>
  );
}
