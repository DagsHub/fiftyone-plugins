
import {registerComponent, PluginComponentType} from '@fiftyone/plugins'
import {Plugin} from './Plugin'

registerComponent({
  name: 'dagshub',
  label: 'DagsHub',
  component: Plugin,
  type: PluginComponentType.Panel,
  activator
})

function activator({dataset}) {
  return true
}
