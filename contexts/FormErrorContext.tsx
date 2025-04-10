import React, { createContext, useState, useContext } from "react";

type FormErrorsContextType = {
  fieldErrors: Record<string, string[]>;
  setFieldErrors: (errors: Record<string, string[]>) => void;
  getFieldError: (fieldName: string) => string | null;
  clearFieldErrors: () => void;
};

const FormErrorsContext = createContext<FormErrorsContextType>({
  fieldErrors: {},
  setFieldErrors: () => {},
  getFieldError: () => null,
  clearFieldErrors: () => {},
});

export const useFormErrors = () => useContext(FormErrorsContext);

export const FormErrorsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const getFieldError = (fieldName: string): string | null => {
    const errors = fieldErrors[fieldName];
    return errors && errors.length > 0 ? errors[0] : null;
  };

  const clearFieldErrors = () => {
    setFieldErrors({});
  };

  return (
    <FormErrorsContext.Provider
      value={{
        fieldErrors,
        setFieldErrors,
        getFieldError,
        clearFieldErrors,
      }}
    >
      {children}
    </FormErrorsContext.Provider>
  );
};
