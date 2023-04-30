import * as fos from '@fiftyone/state';
import {useRecoilValue} from 'recoil';

export function Plugin() {
    const dataset = useRecoilValue(fos.dataset);
    // Have to use the names, because selectedSampleObjects returns wrong values if there's anything pre-selected
    const selectedSampleNames: Set<string> = useRecoilValue(fos.selectedSamples);
    console.log("Selected sample names:", selectedSampleNames);
    const selectedSampleElems = [];

    // selectedSampleNames.forEach((e: string) => selectedSampleElems.push(
    //     <SampleView objName={"aaa"}/>
    // ))

    for (const e of selectedSampleNames) {
        console.log("Adding", e);
        // selectedSampleElems.push(<SampleView objName={e}/>)
        selectedSampleElems.push(<SampleView objName={e}/>)
        // selectedSampleElems.push(SampleView(e));
    }

    console.log("SampleElems", selectedSampleElems);

    return (
        <>
            <h1>
                Selected views in dataset
            </h1>
            <ul>
                {selectedSampleElems}
            </ul>
        </>

    )
}

type SampleViewProps = {
    objName: string;
};

const SampleView = (props: SampleViewProps) => {
    return <li>{props.objName}</li>
}


