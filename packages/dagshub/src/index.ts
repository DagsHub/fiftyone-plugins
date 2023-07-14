import {registerComponent, PluginComponentType} from '@fiftyone/plugins'
import {Plugin} from './Plugin';
import {DagsHubIcon} from './Icon';
import "./operator";

registerComponent({
  name: 'dagshub',
  label: 'DagsHub',
  component: Plugin,
  type: PluginComponentType.Panel,
  Icon: DagsHubIcon,
  activator,
})

function activator({dataset}) {
  return true
}
