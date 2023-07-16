import {createContext, useContext, useState} from "react";
import {Alert, Snackbar} from "@mui/material";

const AlertSnackbarContext = createContext(null);

const AlertSnackbarProvider = (props) => {
    const [alertText, setAlertText] = useState("");
    // const snackbarOpenRef = useRef(false);
    const [open, setOpen] = useState(false);

    return (
        <AlertSnackbarContext.Provider value={{setAlertText, setOpen}} {...props}>
            {props.children}
            {alertText && <AlertSnackbar alertText={alertText} open={open} setOpen={setOpen}/>}
        </AlertSnackbarContext.Provider>
    )
}

const AlertSnackbar = ({alertText, open, setOpen}) => {
    const onClose = () => {
        setOpen(false);
    }

    return (
        <Snackbar open={open} autoHideDuration={2000} onClose={onClose}>
            <Alert severity="success">{alertText}</Alert>
        </Snackbar>
    )
}

const useAlertSnackbar = () => {
    const context = useContext(AlertSnackbarContext);

    if (context === undefined) {
        throw new Error("useAlertSnackbar must be used within a UserProvider");
    }

    return (val: string) => {
        context.setOpen(true);
        context.setAlertText(val);
    }
}

export {AlertSnackbarProvider, useAlertSnackbar};