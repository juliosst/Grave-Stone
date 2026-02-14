import { world, system } from '@minecraft/server';

world.afterEvents.gameRuleChange.subscribe(({ rule, value }) => {

    system.run(() => {

        if (!value && rule === 'keepInventory') {

            world.gameRules.keepInventory = true;

            for (const admin of world.getPlayers()) {

                if (admin.playerPermissionLevel >= 2) {

                    admin.sendMessage('§ckeepInventory cannot be disabled');
                }
            }
        }
    })
})