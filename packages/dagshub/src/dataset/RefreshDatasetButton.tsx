import {CircularProgress} from "@mui/material";
import {Button} from "@fiftyone/components";
import styled from "styled-components";
import {useState} from "react";
import {fetchOrFail, usePluginUrl} from "../util";
import {useErrorModal} from "../ErrorModal";
import {useAlertSnackbar} from "../AlertSnackbar";

const HorizontalStack = styled.div`
  display: flex;
`

const RefreshButton = styled(Button)`
  flex-grow: 1;
`

const Progress = styled(CircularProgress)<{ $show?: boolean }>`
  flex-shrink: 1;
  transition: width 0.5s ease-in-out;

  width: ${props => props.$show ? "28px !important" : "0 !important"};
`

export function RefreshDatasetButton() {
    const [loading, setLoading] = useState(false);
    const setErrorModal = useErrorModal();
    const setAlert = useAlertSnackbar();


    const pluginUrl = usePluginUrl();

    const reloadDataset = () => {
        setLoading(true);

        fetchOrFail(pluginUrl("dataset/refresh")).then(
            () => {
                setAlert("Dataset refreshed");
            }
        ).catch((errorText) => {
            setErrorModal(errorText);
        }).finally(
            () => {
                setLoading(false);
            }
        )
    }

    return <>
        <HorizontalStack>
            <RefreshButton onClick={reloadDataset} disabled={loading}>Refresh Dataset</RefreshButton>
            <Progress size={28} $show={loading}/>
        </HorizontalStack>
    </>
}