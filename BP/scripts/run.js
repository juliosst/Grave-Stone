import { world, system } from '@minecraft/server';

import './events/event';

system.run(() => {
    world.gameRules.keepInventory = true;
});

export function generateId(max = 15) {

    let id = '';

    for (let a = 0; a <= max; a++) {

        const vaults = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';

        id += vaults[Math.floor(Math.random() * vaults.length)]
    }

    return id;
}