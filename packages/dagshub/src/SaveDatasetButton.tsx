import {DefaultSettings, Settings} from "./Settings";
import {useRecoilValue} from "recoil";
import * as fop from '@fiftyone/plugins';
import * as fos from '@fiftyone/state';
import {useState} from "react";
import {Modal, Box, Checkbox, FormGroup, FormControlLabel, TextField, useFormControl} from "@mui/material";
import styled from "styled-components";
import {Button} from "@fiftyone/components";

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
  justify-content: flex-end;
`;

interface SaveDatasetFormValue {
    name?: string;
    saveVoxelFilters?: boolean;
}


export function SaveDatasetButton() {
    const filters = useRecoilValue(fos.filters);

    const settings = fop.usePluginSettings<Settings>("dagshub", DefaultSettings());

    const [modalOpen, setModalOpen] = useState(false);

    const [formState, setFormState] = useState<SaveDatasetFormValue>({
        saveVoxelFilters: true
    });

    console.log(formState);

    const saveDataset = () => {
        fetch(`${settings.server}/save_dataset`, {
            method: "POST",
            body: JSON.stringify({
                filters: filters,
            })
        }).then(
            (res) => {
                console.log("Event sent!!");
                handleSaveDatasetModalClose();
            }
        );
    }

    const handleSaveDatasetModalClose = () => {
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
        return !!formState.name;
    }


    return (
        <>
            <Button onClick={() => setModalOpen(true)}>Save view</Button>
            <Modal open={modalOpen} onClose={handleSaveDatasetModalClose}>
                <Box sx={modalStyle}>
                    <h2>Save view</h2>
                    <FormGroup>
                        <TextField label={"View name"} name={"name"} value={formState.name}
                                   onChange={handleEvent(false)}/>
                        <FormControlLabel control={<Checkbox checked={formState.saveVoxelFilters}
                                                             name={"saveVoxelFilters"}
                                                             onChange={handleEvent(true)}/>}
                                          label={"Include current FiftyOne filters"}/>
                        <ButtonContainer>
                            <Button onClick={saveDataset} disabled={!canSubmit()}>Save!</Button>
                        </ButtonContainer>
                    </FormGroup>
                </Box>
            </Modal>
        </>

    )
}
