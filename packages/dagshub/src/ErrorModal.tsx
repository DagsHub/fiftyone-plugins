import {useState, useCallback, createContext, useContext, useEffect, ProviderProps} from "react";
import {Box, Modal} from "@mui/material";
import {ModalHeader, wideModalStyle} from "./common";
import {Button} from "@fiftyone/components";

const ErrorContext = createContext(null);

const ErrorModalProvider = (props) => {
    const [errorText, setErrorText] = useState();
    const unSetModal = useCallback(() => {
        setErrorText(undefined);
    }, [setErrorText]);

    return (
        <ErrorContext.Provider value={{unSetModal, setErrorText}} {...props}>
            {errorText && <ErrorModal errorText={errorText} unSetModal={unSetModal}/>}
            {props.children}
        </ErrorContext.Provider>
    )
}

const ErrorModal = ({errorText, unSetModal}) => {
    const onClose = () => {
        unSetModal();
    }

    return (
        <Modal onClose={onClose} open={errorText !== undefined}>
            <Box sx={wideModalStyle}>
                <ModalHeader>
                    Error
                </ModalHeader>
                <Box component="pre" sx={{
                    // whiteSpace: "pre-line",
                    overflowX: "auto",
                    overflowY: "auto",
                    fontFamily: "Monospace",
                    background: "var(--fo-palette-background-level1)",
                    maxHeight: "50vh",
                    padding: "15px",
                }}>
                    {errorText}
                </Box>
                <Button onClick={onClose}>Close</Button>
            </Box>
        </Modal>
    )
}

const useErrorModal = () => {
    const context = useContext(ErrorContext);

    if (context === undefined) {
        throw new Error("useModal must be used within a UserProvider");
    }

    return context.setErrorText;
}

export {ErrorModalProvider, useErrorModal};