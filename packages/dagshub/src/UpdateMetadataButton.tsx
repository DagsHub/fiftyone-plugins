import {Button} from "@fiftyone/components";
import {Box, Checkbox, FormControlLabel, FormGroup, Modal, TextField} from "@mui/material";
import {useState} from "react";
import {ButtonContainer, ModalHeader, modalStyle, TooltipDiv} from "./common";

export function UpdateMetadataButton() {

    const [modalOpen, setModalOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [errorText, setErrorText] = useState("");


    const closeModal = () => {
        setModalOpen(false);
    }


    return (
    <>
        <Button onClick={() => setModalOpen(true)}>Update metadata for selected</Button>
        <Modal open={modalOpen} onClose={closeModal}>
            <Box sx={modalStyle}>
                <ModalHeader>
                    Save dataset
                </ModalHeader>
                <FormGroup>
                </FormGroup>
            </Box>
        </Modal>
    </>
    )
}