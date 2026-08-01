import { sendMessage } from '../../functions/function';
import { world, system } from '@minecraft/server';

export let teleports = {}

export function teleportPlayer(player) {

    sendMessage('grave.teleport.startTeleport', { name: player.name });

    teleports[player.name] = {

        count: 10,
        location: player.location,
        slot: player.selectedSlotIndex
    }

    teleports[player.name].check = system.runInterval(() => {

        const { x, y, z } = teleports[player.name].location

        player.spawnParticle('grave:teleport', { x, y: y + 1, z })

        const mainHand = player.getComponent('equippable').getEquipment('Mainhand')

        if (

            mainHand?.typeId !== 'grave:map' ||
            teleports[player.name]?.slot !== player.selectedSlotIndex ||
            JSON.stringify(teleports[player.name]?.location ?? '{}') !== JSON.stringify(player.location)

        ) {

            sendMessage('grave.teleport.abortedTeleport', { name: player.name });
            player.playSound('random.break');
            stop(player.name);
        }
    }, 5)

    teleports[player.name].teleport = system.runInterval(() => {

        const equippable = player.getComponent('equippable')
        const mainHand = equippable.getEquipment('Mainhand')
        const itemSave = JSON.parse(mainHand?.getDynamicProperty('mapSave') ?? '{}')

        if (

            mainHand?.typeId === 'grave:map' &&
            teleports[player.name]?.slot === player.selectedSlotIndex &&
            JSON.stringify(teleports[player.name]?.location) === JSON.stringify(player.location)

        ) {

            const { x, y, z } = itemSave.location
            const dimension = world.getDimension(itemSave.dimension)

            if (teleports[player.name].count == 4) {

                player.playSound('portal.trigger');
            }

            if (teleports[player.name].count <= 0) {

                equippable.setEquipment('Mainhand');

                sendMessage('grave.teleport.teleportTo', { name: player.name, withs: [x, y, z] });
                player.teleport({ x: (x + 0.5), y: (y + 0.5), z: (z + 0.5) }, { dimension });

                stop(player.name);

                system.runTimeout(() => {

                    player.playSound('mob.shulker.teleport');
                }, 5)

            } else {

                sendMessage('grave.teleport.teleportIn', { name: player.name, withs: [teleports[player.name].count] });
                teleports[player.name].count--
            }
        }

    }, 20)
}

function stop(name) {

    system.clearRun(teleports[name].check)
    system.clearRun(teleports[name].teleport)

    delete teleports[name]
}