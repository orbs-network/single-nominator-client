import styled from "styled-components";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { NumericFormat } from "react-number-format";

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
    <StyledContainer>
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

const Label = styled.p``;

const Error = styled.p``;


const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  & > input {
    border: 1px solid rgba(0, 0, 0, 0.23);
    outline: none;
    width: 100%;
    border-radius: 10px;
    text-indent: 10px;
    height: 48px;
    font-size: 16px;
  }
`;
