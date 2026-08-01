import { system, CustomCommandParamType } from '@minecraft/server';
import { settings } from './settings';

export const option = ['allowTeleporting']

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {

    customCommandRegistry.registerEnum('grave:option', option)

    customCommandRegistry.registerCommand({
        name: 'grave:settings',
        description: 'grave.command.settings.description',
        permissionLevel: 1,
        mandatoryParameters: [
            { type: CustomCommandParamType.Enum, name: 'grave:option' },
            { type: CustomCommandParamType.Boolean, name: 'true/false' }
        ]
    }, settings)
})