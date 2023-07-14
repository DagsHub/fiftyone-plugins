import {
    Operator,
    OperatorConfig,
    registerOperator,
    useOperatorExecutor,
    types,
} from "@fiftyone/operators";

class OpenDagsHubPanel extends Operator {
    get config() {
        return new OperatorConfig({
            name: "open_dagshub_panel",
            label: "Open DagsHub Panel",
        });
    }
    useHooks(): object {
        const openPanelOperator = useOperatorExecutor("open_panel");
        return { openPanelOperator };
    }
    async resolvePlacement() {
        return new types.Placement(
            types.Places.SAMPLES_GRID_SECONDARY_ACTIONS,
            new types.Button({
                label: "Open DagsHub Panel",
                icon: "/assets/dagshub.svg",
            })
        );
    }
    async execute({ hooks }) {
        const { openPanelOperator } = hooks;
        openPanelOperator.execute({
            name: "dagshub",
            isActive: true,
            layout: "horizontal",
        });
    }
}

registerOperator(OpenDagsHubPanel, "dagshub");
