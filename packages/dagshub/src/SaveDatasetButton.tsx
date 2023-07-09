import {DefaultSettings, Settings} from "./Settings";
import {useRecoilValue} from "recoil";
import * as fop from '@fiftyone/plugins';
import * as fos from '@fiftyone/state';
import {useState} from "react";
import {Modal, Box, Checkbox, FormGroup, FormControlLabel, TextField, useFormControl} from "@mui/material";
import styled from "styled-components";
import {Button, Tooltip} from "@fiftyone/components";

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
`;

const ErrorDiv = styled.div`
    color: red;
`;

const TooltipDiv = styled.div`
  color: var(--fo-palette-text-secondary);
`;

interface SaveDatasetFormValue {
    name?: string;
    saveVoxelFilters?: boolean;
}

const ModalHeader = styled.h2`
    margin-top: 0;
`;


export function SaveDatasetButton() {
    const filters = useRecoilValue(fos.filters);

    const settings = fop.usePluginSettings<Settings>("dagshub", DefaultSettings());

    const [modalOpen, setModalOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [errorText, setErrorText] = useState("");

    const [formState, setFormState] = useState<SaveDatasetFormValue>({
        saveVoxelFilters: true
    });

    const requestData = () => {
        return JSON.stringify({
            ...formState,
            filters: filters,
        });
    }

    const saveDataset = () => {
        setSending(true);
        setErrorText("");
        fetch(`${settings.server}/save_dataset`, {
            method: "POST",
            body: requestData(),
        }).then(
            (res) => {
                if (res.ok) {
                    closeModal();
                    return res.json();
                } else {
                    throw res;
                }
            }
        ).catch(
            (err) => {
                err.text().then(text => {
                    setErrorText(text);
                })
            }
        ).finally(() => {
            setSending(false);
        });
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const handleEvent = (isCheckbox: boolean) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            const val = (isCheckbox) ? event.target.checked : event.target.value;
            setFormState({
                ...formState,
                [event.target.name]: val,
            });
        }
    }

    const canSubmit = () => {
        return !sending && !!formState.name;
    }

    const tooltipText = "Note: does not save limits, e.g. head()"


    return (
        <>
            <Button onClick={() => setModalOpen(true)}>Save dataset</Button>
            <Modal open={modalOpen} onClose={closeModal}>
                <Box sx={modalStyle}>
                    <ModalHeader>
                        Save dataset
                    </ModalHeader>
                    <FormGroup>
                        <TextField label={"Dataset name"} name={"name"} value={formState.name}
                                   onChange={handleEvent(false)}/>
                        <FormControlLabel control={<Checkbox checked={formState.saveVoxelFilters}
                                                             name={"saveVoxelFilters"}
                                                             onChange={handleEvent(true)}/>}
                                          label={"Include current FiftyOne filters"}/>
                        <TooltipDiv>{tooltipText}</TooltipDiv>
                        <ButtonContainer>
                            <Button onClick={saveDataset} disabled={!canSubmit()}>Save!</Button>
                            {errorText && <ErrorDiv>{errorText}</ErrorDiv>}
                        </ButtonContainer>
                    </FormGroup>
                </Box>
            </Modal>
        </>

    )
}
