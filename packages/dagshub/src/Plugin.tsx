import * as fos from '@fiftyone/state';
import * as foa from '@fiftyone/aggregations';
import * as fop from '@fiftyone/plugins';
import {useRecoilValue} from 'recoil';
import {Button} from "@fiftyone/components";
import {useEffect, useState, ReactDOM} from "react";
import {DefaultSettings, Settings} from "./Settings";
// import Modal from "@mui/material/Modal";
import Modal from "@mui/material";

export function Plugin() {
    const dataset = useRecoilValue(fos.dataset);
    const view = useRecoilValue(fos.view);
    const filters = useRecoilValue(fos.filters);

    const settings = fop.usePluginSettings<Settings>("dagshub", DefaultSettings());

    const [saveDatasetModalOpen, setSaveDatasetModalOpen] = useState(false);

    // selectedSampleNames.forEach((e: string) => selectedSampleElems.push(
    //     <SampleView objName={"aaa"}/>
    // ))


    const toLabelStudio = () => {
        fetch(`${settings.server}/labelstudio`, {
            method: "POST",
        }).then(
            (res) => console.log("Event sent!!")
        );
    }

    const saveDataset = () => {
        setSaveDatasetModalOpen(true);

        fetch(`${settings.server}/save_dataset`, {
            method: "POST",
            body: JSON.stringify({
                filters: filters,
            })
        }).then(
            (res) => console.log("Event sent!!")
        );
    }

    const handleSaveDatasetModalClose = () => {
        setSaveDatasetModalOpen(false);
    }


    return (
        <>
            {/*<h1>*/}
            {/*    Selected samples in dataset*/}
            {/*</h1>*/}
            {/*<ul>*/}
            {/*    {sample_ids.map(id => <li key={id}>{id}</li>)}*/}
            {/*</ul>*/}
            {/*<div>*/}
            {/*    <h3>{JSON.stringify(result)}</h3>*/}
            {/*</div>*/}
            <div style={{display: "flex", gap: "16px", margin: "50px"}}>
                <Button onClick={toLabelStudio}>Annotate selected in LabelStudio</Button>
                <Button onClick={saveDataset}>Save dataset</Button>
                <Modal.Modal open={saveDatasetModalOpen} onClose={handleSaveDatasetModalClose}>
                    <div>Hello!!!</div>
                </Modal.Modal>
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

