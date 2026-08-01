import { sendMessage, graveSave } from '../functions/function';
import { option } from './registry';

export function settings(senders, rule, boolean) {

    const sender = senders.sourceEntity

    if (sender.typeId === 'minecraft:player') {

        if (option.includes(rule)) {

            sendMessage('commands.gamerule.success', { withs: [rule, boolean], name: sender.name });
            graveSave().settings[rule] = boolean
        } else {

            sendMessage('grave.settings.gamerule.unSuccess', { withs: [rule], name: sender.name });
        }
    }
}