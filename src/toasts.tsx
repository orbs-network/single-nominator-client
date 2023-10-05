/* eslint-disable react-refresh/only-export-components */
import toast, { ToastPosition } from "react-hot-toast";
import styled from "styled-components";

interface ToastConfig {
  duration?: number;
  position: ToastPosition;
}

const ToastContent = ({
  message,
}: {
  message: string;
}) => {
  return <Container>{message}</Container>;
};



export const showToast = (message: string, config?: ToastConfig) => {
  return toast(() => <ToastContent message={message} />, {
    duration: config?.duration || Infinity,
    position: config?.position || "top-center",
  });
};


export const showSuccessToast = (message: string) => {
  toast.success(() => <ToastContent message={message} />, {
    duration: 40000,
  });
};



export const clearAllToasts = () => toast.dismiss();

const Container = styled.div`
 font-size: 15,
  p: {
    font-size: 15px!important,
  }
`;
