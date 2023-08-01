import {CircularProgress} from "@mui/material";
import {Button} from "@fiftyone/components";
import styled from "styled-components";

const HorizontalStack = styled.div`
  display: flex;
  gap: 8px;
`

const RefreshButton = styled(Button)`
    flex-grow: 1;
`

const Progress = styled(CircularProgress)`
  flex-shrink: 1;
`

export function RefreshDatasetButton() {
    return <>
        <HorizontalStack>
            <RefreshButton>Refresh Dataset</RefreshButton>
            <Progress/>
        </HorizontalStack>
    </>
}