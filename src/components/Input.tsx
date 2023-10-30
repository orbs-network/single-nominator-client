import styled from "styled-components";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { RowFlex, Typography } from "styles";

type RadioOption = {
  title: string;
  value: string;
};

interface Props {
  placeholder?: string;
  error?: string;
  field: ControllerRenderProps<FieldValues, string>;
  label?: string;
  onFocus?: () => void;
  type?: string;
  suffix?: string;
  info?: string;
  radioOptions?: RadioOption[];
}

export function Input(props: Props) {
  const {
    placeholder,
    error,
    label,
    onFocus,
    type = "text",
    field,
    suffix,
    info,
  } = props;
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
      ) : type === "radio" ? (
        <RadioInput {...props} />
      ) : (
        <input
          onFocus={onFocus}
          {...field}
          value={field.value || ""}
          placeholder={placeholder}
        />
      )}

      {info && <Info>{info}</Info>}
      {error && <Error>{error}</Error>}
    </StyledContainer>
  );
}

const Info = styled(Typography)`
  margin-top: 10px;
  font-size: 14px;
  margin-bottom: 5px;
  padding-left: 5px;
`;

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

function RadioInput({ radioOptions, field }: Props) {
  return (
    <RadioInputContainer>
      {radioOptions?.map((option) => {
        return (
          <RadioInputOptionContainer key={option.title}>
            <StyledRadio
              {...field}
              type="radio"
              value={field.value || ""}
              onChange={() => field.onChange(option.value)}
            />
            <Typography>{option.title}</Typography>
          </RadioInputOptionContainer>
        );
      })}
    </RadioInputContainer>
  );
}

const StyledRadio = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;
const RadioInputOptionContainer = styled(RowFlex)`
  gap: 10px;
  .title {
    font-size: 14px;
  }
`;

const RadioInputContainer = styled(RowFlex)``;
