import { BlockVolume, ItemStack } from '@minecraft/server';

export function openGrave(grave, player) {

    const entitySave = JSON.parse(grave?.getDynamicProperty('grave'));
    const graveInv = grave.getComponent('inventory').container;
    const playerInv = player.getComponent('inventory').container;

    const { x, y, z } = grave.location
    const dimension = grave.dimension

    const fromTo = new BlockVolume(
        { x: (x + 2), y, z: (z + 2) },
        { x: (x - 2), y: (y - 2), z: (z - 2) }
    )

    dimension.fillBlocks(fromTo, 'minecraft:frosted_ice', { blockFilter: { includeTypes: ['minecraft:ice'] }, ignoreChunkBoundErrors: true })

    if (Math.random() * 100 <= 10) {

        const player_head = new ItemStack('minecraft:player_head', 1)
        player_head.setLore([`§r§3Dimension: §6${dimension.id.replace('minecraft:', '')}\n§cX: ${Math.floor(x)}, Y: ${Math.floor(y)}, Z: ${Math.floor(z)}\n\n§cThis block cannot be placed`])
        player_head.nameTag = `§r§eHead: §6${entitySave.name}`

        dimension.spawnItem(player_head, { x, y, z });
    }

    for (let slot = 0; slot <= 35; slot++) {

        if (!playerInv?.getItem(slot)) {

            playerInv.setItem(slot, graveInv.getItem(slot));
            graveInv?.setItem(slot);
        }
    }

    function setArmor(type, slot) {

        const playerArmor = player.getComponent('equippable');

        if (!playerArmor.getEquipment(type)) {

            playerArmor.setEquipment(type, graveInv.getItem(slot));

            if (playerArmor.getEquipment(type)) graveInv.setItem(slot);
        }
    }

    setArmor('Head', 36);
    setArmor('Chest', 37);
    setArmor('Legs', 38);
    setArmor('Feet', 39);
    setArmor('Offhand', 40);

    player.addExperience(entitySave?.totalXp ?? 0)

    player.playSound('random.pop');
    grave.triggerEvent('grave_stone:open');
}