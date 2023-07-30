import {Button} from "@fiftyone/components";
import {Autocomplete, Box, Checkbox, FormControlLabel, FormGroup, Grid, Modal, TextField} from "@mui/material";
import {useEffect, useState, useRef} from "react";
import {ModalHeader, TooltipDiv, wideModalStyle} from "./common";
import {useRecoilState, useRecoilValue} from "recoil";
import * as fop from '@fiftyone/plugins';
import * as fos from '@fiftyone/state';
import {fetchOrFail, usePluginUrl} from "./util";
import {DefaultSettings, Settings} from "./Settings";
import {metadataFields} from "./datasourceUtil";
import {MetadataFieldSchema, MetadataFieldType, validateFieldValue} from "./types";
import styled from "styled-components";
import {useErrorModal} from "./ErrorModal";
import {useAlertSnackbar} from "./AlertSnackbar";

// const FieldContainer = styled.div`
//   display: flex;
//   gap: 8px;
//   margin: 8px 0;
// `

const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`

const FieldPlaceholder = styled(TooltipDiv)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

interface UpdateMetadataFormValue {
    field: MetadataFieldSchema;
    value: any;
}

export function UpdateMetadataButton() {

    const selected = useRecoilValue(fos.selectedSamples)

    const [modalOpen, setModalOpen] = useState(false);

    const [fieldValue, setFieldValue] = useState(undefined);
    const [selectedField, setSelectedField] = useState<MetadataFieldSchema | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const setErrorModal = useErrorModal();
    const setAlert = useAlertSnackbar();

    const closeModal = () => {
        setModalOpen(false);
    }

    const [fields, setFields] = useRecoilState(metadataFields);
    const pluginUrl = usePluginUrl();

    const editableFields = useRef<MetadataFieldSchema[]>([]);
    useEffect(() => {
        editableFields.current = fields.filter(f => f.valueType !== MetadataFieldType.BLOB)
    }, [fields])

    const raiseError = (res) => {
        console.error("ERRROR:", res);
        setErrorModal(res);
    }


    const fetchFields = () => {
        if (!fields.length) {
            fetchOrFail(pluginUrl("datasource/fields"))
                .then((res: string[]) => {
                    setFields(res.map(a => JSON.parse(a)));
                })
                .catch(res => raiseError(res))
        }
    }

    useEffect(fetchFields, []);

    const selectedFieldChanged = (event: any, newValue: MetadataFieldSchema | null) => {
        setSelectedField(newValue);
        setValidationError(null);
        if (newValue !== null && newValue.valueType == MetadataFieldType.BOOLEAN) {
            setFieldValue(false);
        } else {
            setFieldValue(undefined);
        }
    }

    const fieldValueChanged = (val: any) => {
        setFieldValue(val);
    }

    const fieldStyle = {
        flexGrow: 1,
        width: "100%",
        height: "100%",
    };

    const updateMetadata = () => {
        // Validate the field
        setValidationError(null);
        let val = null;
        try {
            val = validateFieldValue(selectedField.valueType, fieldValue);
        } catch (error) {
            setValidationError(error.message);
            return;
        }

        // Send it to the plugin server
        const requestData: UpdateMetadataFormValue = {
            field: selectedField,
            value: val
        };
        fetchOrFail(pluginUrl("datasource/update_metadata"), {
            method: "POST",
            body: JSON.stringify(requestData)
        })
            .then(_ => {
                setAlert("Metadata updated");
                closeModal();
            })
            .catch(res => raiseError(res));
    }

    const canSubmit = () => {
        return fieldValue !== undefined;
    }

    let fieldEdit;
    if (!selectedField) {
        fieldEdit = <FieldPlaceholder>Choose a field</FieldPlaceholder>;
    } else if (selectedField.valueType == MetadataFieldType.BOOLEAN) {
        fieldEdit = <FormControlLabel
            control={<Checkbox onChange={(ev) => fieldValueChanged(ev.target.checked)}/>}
            label="Value" style={fieldStyle}
        />;
    } else {
        fieldEdit = <TextField
            error={validationError !== null}
            helperText={validationError}
            onChange={(ev) => fieldValueChanged(ev.target.value)}
            label="Value" style={fieldStyle}
        />;
    }

    return (
        <>
            <Button onClick={() => setModalOpen(true)}>Update metadata for selected</Button>
            <Modal open={modalOpen} onClose={closeModal}>
                <Box sx={wideModalStyle}>
                    <ModalHeader>
                        Update metadata for selected samples
                    </ModalHeader>
                    <FormGroup>
                        <TooltipDiv>
                            Currently {selected.size} sample(s) are selected
                        </TooltipDiv>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Autocomplete options={editableFields.current}
                                              getOptionLabel={(option) => option.name}
                                              renderInput={(params) => (
                                                  <TextField {...params}
                                                             label="Field"/>
                                              )}
                                              onChange={selectedFieldChanged}
                                              style={fieldStyle}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {fieldEdit}
                            </Grid>
                        </Grid>
                        <SubmitButtonContainer>
                            <Button onClick={updateMetadata} disabled={!canSubmit()}>Save!</Button>
                        </SubmitButtonContainer>
                    </FormGroup>
                </Box>
            </Modal>
        </>
    )
}
