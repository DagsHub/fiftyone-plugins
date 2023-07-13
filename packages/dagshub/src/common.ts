import styled from "styled-components";

export const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: 'translate(-50%, -50%)',
    width: 400,
    minWidth: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

export const wideModalStyle = {
    ...modalStyle,
    width: "50%",
}

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
`;

export const ErrorDiv = styled.div`
  color: red;
`;

export const TooltipDiv = styled.div`
  color: var(--fo-palette-text-secondary);
`;

export const ModalHeader = styled.h2`
  margin-top: 0;
`;

