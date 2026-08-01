import { spawnGrave } from './spawnGrave';

export function correctUp(player, dim, { x, y, z }) {

    for (let yy = y; yy <= dim.heightRange.max; yy++) {

        if (dim.getBlock({ x, y: yy, z }).typeId !== 'minecraft:air' && dim.getBlock({ x, y: (yy + 1), z }).typeId == 'minecraft:air') {

            return spawnGrave(player, { x, y: (yy + 1), z })
        }
    }

    return false
}

export function correctDown(player, dim, { x, y, z }) {

    for (let yy = y; yy >= dim.heightRange.min; yy--) {

        if (dim.getBlock({ x, y: yy, z }).typeId !== 'minecraft:air' && dim.getBlock({ x, y: (yy + 1), z }).typeId == 'minecraft:air') {

            return spawnGrave(player, { x, y: (yy + 1), z })
        }
    }

    return false
}