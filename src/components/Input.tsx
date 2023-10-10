import styled from "styled-components";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Typography } from "styles";

interface Props {
  placeholder?: string;
  error?: string;
  field: ControllerRenderProps<FieldValues, string>;
  label?: string;
  onFocus?: () => void;
  type?: string;
  suffix?: string;
}

export function Input({
  placeholder,
  error,
  label,
  onFocus,
  type = "text",
  field,
  suffix,
}: Props) {
  return (
    <StyledContainer $error={!!error}>
      {label && <Label>{label}</Label>}
      {type === "number" ? (
        <NumericFormat
          value={field.value || ""}
          onValueChange={(e) => field.onChange(e.value)}
          thousandSeparator={true}
          suffix={suffix}
        />
      ) : (
        <input
          onFocus={onFocus}
          {...field}
          value={field.value || ""}
          placeholder={placeholder}
        />
      )}

      {error && <Error>{error}</Error>}
    </StyledContainer>
  );
}

const Label = styled(Typography)`
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 600;
`;

const Error = styled.p`
  color: red;
  font-size: 13px;
  font-weight: 500;
  margin-top: 5px;
`;

const StyledContainer = styled.div<{ $error: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  & > input {
    background-color: ${({ theme }) => theme.colors.container};
    border: 1px solid
      ${({ $error, theme }) =>
        $error
          ? "red"
          : theme.dark
          ? theme.colors.border
          : "rgba(0, 0, 0, 0.23)"};
    width: 100%;
    outline: none;
    border-radius: 10px;
    text-indent: 10px;
    height: 48px;
    font-size: 16px;
  }
`;
