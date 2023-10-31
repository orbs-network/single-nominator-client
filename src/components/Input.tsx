import styled from "styled-components";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { RowFlex, Typography } from "styles";
import { ReactNode } from "react";
import { ZERO_ADDR } from "consts";
import { makeElipsisAddress } from "utils";

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
  button?: ReactNode;
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
    button,
  } = props;
  return (
    <StyledContainer>
      {label && <Label>{label}</Label>}
      <StyledInputContainer $error={!!error}>
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
          <>
            <input
              onFocus={onFocus}
              {...field}
              value={
                field.value === ZERO_ADDR
                  ? makeElipsisAddress(field.value, 10)
                  : field.value || ""
              }
              placeholder={placeholder}
            />
            {button}
          </>
        )}
      </StyledInputContainer>
      {info && <Info>{info}</Info>}
      {error && <Error>{error}</Error>}
    </StyledContainer>
  );
}

const StyledInputContainer = styled(RowFlex)<{ $error: boolean }>`
  background-color: ${({ theme }) => theme.colors.container};
  border: 1px solid
    ${({ $error, theme }) =>
      $error
        ? "red"
        : theme.dark
        ? theme.colors.border
        : "rgba(0, 0, 0, 0.23)"};
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  button {
    margin-right: 10px;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.blue};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  & input {
    border: none;
    outline: none;
    text-indent: 10px;
    height: 48px;
    font-size: 16px;
    flex: 1;
    font-size: 16px;
  }
`;

const Info = styled(Typography)`
  margin-top: 10px;
  font-size: 14px;
  margin-bottom: 5px;
  padding-left: 5px;
  line-height: 19px;
  opacity: 0.8;
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

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
 
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
