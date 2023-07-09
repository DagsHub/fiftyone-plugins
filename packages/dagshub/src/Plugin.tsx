import * as fos from '@fiftyone/state';
import * as foa from '@fiftyone/aggregations';
import * as fop from '@fiftyone/plugins';
import {useRecoilValue} from 'recoil';
import {Button} from "@fiftyone/components";
import {useEffect, useState, ReactDOM} from "react";
import {DefaultSettings, Settings} from "./Settings";
// import Modal from "@mui/material/Modal";
import Modal from "@mui/material";
import {SaveDatasetButton} from "./SaveDatasetButton";

export function Plugin() {
    const dataset = useRecoilValue(fos.dataset);
    const view = useRecoilValue(fos.view);
    const filters = useRecoilValue(fos.filters);

    const settings = fop.usePluginSettings<Settings>("dagshub", DefaultSettings());

    const toLabelStudio = () => {
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


    return (
        <>
            <div style={{display: "flex", gap: "16px", margin: "50px"}}>
                <Button onClick={toLabelStudio}>Annotate selected in LabelStudio</Button>
                <SaveDatasetButton/>
            </div>
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

