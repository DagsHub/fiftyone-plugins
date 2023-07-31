import * as fos from '@fiftyone/state';
import * as foa from '@fiftyone/aggregations';
import * as fop from '@fiftyone/plugins';
import {useRecoilValue} from 'recoil';
import {Button} from "@fiftyone/components";
import {useEffect, useState, ReactDOM} from "react";
import {DefaultSettings, Settings} from "./Settings";
// import Modal from "@mui/material/Modal";
import {Card, CardContent, CardHeader, Stack} from "@mui/material";
import {SaveDatasetButton} from "./SaveDatasetButton";
import styled from "styled-components";
import {UpdateMetadataButton} from "./UpdateMetadataButton";
import {ErrorModalProvider, useErrorModal} from "./ErrorModal";
import {AlertSnackbarProvider} from "./AlertSnackbar";
import {fetchOrFail} from "./util";

const CardStack = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px;
`

const ActionsCard = styled(Card)`
  min-width: 300px;
`

const BoundDatasetInfo = styled.h3`
    margin: 20px 20px 0;
`

export function Plugin() {
    const settings = fop.usePluginSettings<Settings>("dagshub", DefaultSettings());

    const [serverOnline, setServerOnline] = useState(false);
    const [reconnectRetries, setReconnectRetries] = useState(0);

    useEffect(() => {
        console.log("Settings:", settings)
    }, [settings.server, settings.datasource_name])

    useEffect(() => {
        fetchOrFail(settings.server).then(() => setServerOnline(true)).catch(() => setServerOnline(false));
    }, [settings.server, settings.datasource_name, reconnectRetries])

    if (!serverOnline) {
        return <div>
            <h1>The plugin server is not running</h1>
            <Button onClick={() => setReconnectRetries(reconnectRetries + 1)}>Try to reconnect</Button>
        </div>
    }

    const toLabelStudio = () => {
        // TODO: fix to use Fetch Or Fail here
        fetch(`${settings.server}/labelstudio`, {
            method: "POST",
        }).then(
            (res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            }
        ).then(res => {
            console.log("Need to open link", res["link"])
            window.open(res["link"], '_blank').focus();
        }).catch(errResp => {
            errResp.content().then(text => {
                console.error("Error while sending annotation to labelstudio", text)
            })
        });
    }

    if (settings.in_colab) {
        return <div>
            <h1>The plugin currently doesn&apos;t work in Colab</h1>
            <p>We&apos;re working on resolving this problem.
                Let us know on our <a href={"https://discord.com/invite/9gU36Y6"}>Discord</a> if
                you need this for your workflow</p>
        </div>
    }


    return (
        <>
            <ErrorModalProvider>
                <AlertSnackbarProvider>
                    <BoundDatasetInfo>Bound to datasource: {settings.datasource_name}</BoundDatasetInfo>
                    <CardStack>
                        <ActionsCard raised={true}>
                            <CardHeader title={"Metadata"}/>
                            <CardContent>
                                <UpdateMetadataButton/>
                            </CardContent>
                        </ActionsCard>
                        <ActionsCard raised={true}>
                            <CardHeader title={"Dataset"}/>
                            <CardContent>
                                <SaveDatasetButton/>
                            </CardContent>
                        </ActionsCard>
                        <ActionsCard raised={true}>
                            <CardHeader title={"Annotations"}/>
                            <CardContent>
                                <Button onClick={toLabelStudio}>Annotate selected in LabelStudio</Button>
                            </CardContent>
                        </ActionsCard>
                    </CardStack>
                </AlertSnackbarProvider>
            </ErrorModalProvider>
        </>

    )
}

type SampleViewProps = {
    objName: string;
};

const SampleView = (props: SampleViewProps) => {
    return <li>{props.objName}</li>
}

type ValsProps = {
    field: string,
    sample_ids?: string[]
}
//
// function Vals({field, sample_ids}: ValsProps) {
//     const dataset = useRecoilValue(fos.dataset);
//     const view = useRecoilValue(fos.view);
//     const filters = useRecoilValue(fos.filters);
//
//     const [aggregate, result, loading] = foa.useAggregation({view, filters, dataset, sample_ids})
//
//     const load = () => {
//
//         const aggregations = [
//             new foa.aggregations.Values({fieldOrExpr: field})
//         ];
//         aggregate(aggregations, dataset.name);
//     }
//
//     if (!result) {
//         return <Button onClick={load}>Click to load</Button>
//     }
//
//     if (loading) return <Button disabled>Loading...</Button>
//     console.log(result)
//     return <strong>{JSON.stringify(result)}</strong>
// }
//

