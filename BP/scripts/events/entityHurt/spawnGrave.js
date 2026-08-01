import { graveSave, antiSpam } from '../../functions/function';
import { BlockVolume } from '@minecraft/server';
import { inventory, totalXp } from './saveInv';

export function spawnGrave(player, { x, y, z }) {

    if (antiSpam(`Grave:${player.id}`, 1000)) return;

    const dimension = player.dimension

    const fromTo = new BlockVolume(
        { x: (x + 2), y: (y - 1), z: (z + 2) },
        { x: (x - 2), y: (y - 2), z: (z - 2) }
    )

    dimension.fillBlocks(fromTo, 'minecraft:ice', { blockFilter: { includeTypes: ['minecraft:water', 'minecraft:flowing_water'] }, ignoreChunkBoundErrors: true })
    dimension.fillBlocks(fromTo, 'minecraft:magma', { blockFilter: { includeTypes: ['minecraft:lava', 'minecraft:flowing_lava'] }, ignoreChunkBoundErrors: true })

    if (dimension.getBlock({ x, y: (y - 1), z }).typeId == 'minecraft:air') {

        dimension.fillBlocks(fromTo, 'minecraft:coarse_dirt', { blockFilter: { includeTypes: ['minecraft:air'] }, ignoreChunkBoundErrors: true })
    }

    const grave = dimension.spawnEntity('grave:grave_stone', { x, y, z })

    graveSave().player[player.name] = { dimension: dimension.id, location: { x: (x - 0.5), y, z: (z - 0.5) } }

    grave.setDynamicProperty('grave', JSON.stringify({ totalXp: totalXp[player.name], name: player.name }))
    grave.nameTag = `§6Grave of§r\n${player.name}`;

    for (let s = 0; s <= 40; s++) {

        const itemStack = inventory[player.name][s]

        grave.getComponent('inventory').container.setItem(s, itemStack);
    }
}