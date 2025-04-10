import React from "react";
import { Input, Paragraph, YStack, Label, styled, getTokens } from "tamagui";
import { useFormErrors } from "@/contexts/FormErrorContext";

type FormFieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
};

// Create a styled input that shows red border when has error
const ErrorInput = styled(Input, {
  variants: {
    hasError: {
      true: {
        borderColor: "$red10",
        borderWidth: 2,
      },
    },
  },
});

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize,
  autoCorrect,
}) => {
  const { getFieldError } = useFormErrors();
  const errorMessage = getFieldError(name);
  const tokens = getTokens();

  return (
    <YStack space="$1" marginBottom="$3">
      {label && <Label htmlFor={name}>{label}</Label>}
      <ErrorInput
        id={name}
        name={name}
        hasError={!!errorMessage}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
      />
      {errorMessage && (
        <Paragraph color="$red10" fontSize="$1">
          {errorMessage}
        </Paragraph>
      )}
    </YStack>
  );
};
