import {Button} from "@fiftyone/components";
import * as fop from "@fiftyone/plugins";
import * as fos from "@fiftyone/state";
import {DefaultSettings, Settings} from "../Settings";
import {fetchOrFail} from "../util";
import {useErrorModal} from "../ErrorModal";
import {useAlertSnackbar} from "../AlertSnackbar";
import {useRecoilValue} from "recoil";

export function AnnotateSelectedButton() {
    const settings = fop.usePluginSettings<Settings>("dagshub", DefaultSettings());

    const selected = useRecoilValue(fos.selectedSamples);

    const setErrorModal = useErrorModal();
    const setAlert = useAlertSnackbar();

    const btnDisabled = () => {
        return selected.size == 0;
    }

    const toLabelStudio = () => {
        fetchOrFail(`${settings.server}/labelstudio`, {
            method: "POST",
        }).then(res => {
            const url = res["link"];
            console.log("Annotation link:", url)
            setAlert(`Opening annotation link: ${url}`)
            window.open(url, '_blank').focus();
        }).catch(errText => {
            setErrorModal(`Error while sending to annotation to labelstudio:\r\n${errText}`);
        });
    }


    return <Button onClick={toLabelStudio} disabled={btnDisabled()}>Annotate selected in LabelStudio</Button>
}