import * as fos from '@fiftyone/state';
import * as foa from '@fiftyone/aggregations';
import * as fop from '@fiftyone/plugins';
import {useRecoilValue} from 'recoil';
import {Button} from "@fiftyone/components";
import {useEffect} from "react";
import {DefaultSettings, Settings} from "./Settings";

export function Plugin() {
    const dataset = useRecoilValue(fos.dataset);
    const view = useRecoilValue(fos.view);
    const filters = useRecoilValue(fos.filters);

    const settings = fop.usePluginSettings<Settings>("dagshub", DefaultSettings());

    // Have to use the names, because selectedSampleObjects returns wrong values if there's anything pre-selected
    const selectedSampleNames: Set<string> = useRecoilValue(fos.selectedSamples);
    const sample_ids = Array.from(selectedSampleNames);
    console.log("Selected sample names:", selectedSampleNames);
    const selectedSampleElems = [];

    // selectedSampleNames.forEach((e: string) => selectedSampleElems.push(
    //     <SampleView objName={"aaa"}/>
    // ))



    let [aggregate, result, loading] = foa.useAggregation({view, filters, dataset, sample_ids})

    const load = () => {
        if (sample_ids.length === 0) {
            result = [];
            return Promise.resolve();
        }
        const aggregations = [
            new foa.aggregations.Values({fieldOrExpr: "url"})
        ];
        return aggregate(aggregations, dataset.name);
    }

    const send = fos.useSendEvent();

    const toLabelStudio = () => {
        send((session) => {
            console.log(`Sending event for session ${session}`);
        })
        fetch(`${settings.server}/labelstudio`, {
            method: "POST",
            body: JSON.stringify({
                data: {samples: result},
            })
        }).then(
            (res) => console.log("Event sent!!")
        );
        console.log("TO LABEL STUDIO")
    }

    useEffect(() => {load();}, [selectedSampleNames]);


    return (
        <>
            <h1>
                Selected samples in dataset
            </h1>
            <ul>
                {sample_ids.map(id => <li key={id}>{id}</li>)}
            </ul>
            <div>
                <h3>{JSON.stringify(result)}</h3>
            </div>
            <Button onClick={toLabelStudio}>To Label Studio</Button>
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

