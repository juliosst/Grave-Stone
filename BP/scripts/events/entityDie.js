import { world, system, ItemStack } from '@minecraft/server';
import { generateId } from '../run';

function spawnGrave(player, x, y, z) {

    system.run(() => {

        const dimension = player.dimension.id
        const grave_id = generateId(25);

        const equ = player.getComponent('equippable');

        world.getDimension(dimension).spawnEntity('grave:grave', { x, y, z }).setDynamicProperty('grave_id', grave_id);

        for (const grave of world.getDimension(dimension).getEntities()) {

            if (grave.getDynamicProperty('grave_id') === grave_id && grave.typeId === 'grave:grave') {

                const inv = grave.getComponent('inventory').container

                for (let s = 0; s <= 35; s++) {

                    const slot = player.getComponent('inventory').container?.getItem(s);
                    inv.setItem(s, slot)
                }

                inv.setItem(36, equ?.getEquipment('Head'))
                inv.setItem(37, equ?.getEquipment('Chest'))
                inv.setItem(38, equ?.getEquipment('Legs'))
                inv.setItem(39, equ?.getEquipment('Feet'))
                inv.setItem(40, equ?.getEquipment('Offhand'))

                grave.setDynamicProperty('totalXp', player.getTotalXp())
                grave.nameTag = `§6Grave of§r\n${player.name}`;
                grave.setDynamicProperty('grave_id');
            }
        }

        player.getComponent('inventory').container.clearAll();

        equ.setEquipment('Head');
        equ.setEquipment('Chest');
        equ.setEquipment('Legs');
        equ.setEquipment('Feet');
        equ.setEquipment('Offhand');

        const graveMap = new ItemStack('grave:map');

        graveMap.nameTag = `§r§6Grave of§r ${player.name}`;
        graveMap.setDynamicProperty('location', JSON.stringify({ dimension, x, y, z }));
        graveMap.setLore([`§r§3Dimension: §6${dimension.replace('minecraft:', '')}
§cX: ${x - 0.5}, Y: ${y}, Z: ${z - 0.5}`])

        equ.setEquipment('Mainhand', graveMap);

        player.resetLevel();
    })
}

world.afterEvents.entityDie.subscribe(({ deadEntity }) => {

    system.run(() => {

        if (deadEntity.typeId === 'minecraft:player') {

            const x = Math.floor(deadEntity.location.x) + 0.5
            const y = Math.floor(deadEntity.location.y)
            const z = Math.floor(deadEntity.location.z) + 0.5

            const dimension = deadEntity.dimension.id
            const worlds = world.getDimension(dimension);

            let maxPos, minPos, block;

            if (dimension === 'minecraft:overworld') {

                block = 'grass_block';
                maxPos = 320;
                minPos = -64;
            }

            if (dimension === 'minecraft:the_end') {

                block = 'end_stone';
                maxPos = 256;
                minPos = 0;
            }

            if (dimension === 'minecraft:nether') {

                block = 'netherrack';
                maxPos = 128;
                minPos = 0;
            }

            if (y <= 0) {

                for (let yy = minPos; yy <= maxPos; yy++) {

                    if (worlds.getBlock({ x, y: yy, z })?.typeId !== 'minecraft:air' && worlds.getBlock({ x, y: yy + 1, z })?.typeId === 'minecraft:air') {

                        spawnGrave(deadEntity, x, yy + 1, z);
                        return;
                    }
                }

                spawnGrave(deadEntity, x, minPos + 1, z);
                deadEntity.runCommand(`fill ${x + 2} ${minPos} ${z + 2} ${x - 2} ${minPos} ${z - 2} ${block} keep`);
                return;
            }

            if (worlds.getBlock({ x, y, z })?.typeId === 'minecraft:lava') {

                for (let yy = y; yy <= maxPos; yy++) {

                    if (worlds.getBlock({ x, y: yy, z })?.typeId === 'minecraft:lava' && worlds.getBlock({ x, y: yy + 1, z })?.typeId !== 'minecraft:lava') {

                        spawnGrave(deadEntity, x, yy + 1, z);
                        deadEntity.runCommand(`fill ${x + 2} ${yy} ${z + 2} ${x - 2} ${yy} ${z - 2} magma replace lava`);
                        return;
                    }
                }
            }

            if (!deadEntity.isOnGround) {
                deadEntity.runCommand(`fill ${x + 2} ${y - 1} ${z + 2} ${x - 2} ${y - 1} ${z - 2} ${block} keep`);
            }

            spawnGrave(deadEntity, x, y, z);
        }
    })
})