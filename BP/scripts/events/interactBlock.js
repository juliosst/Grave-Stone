import { sendMessage } from '../functions/function';
import { world } from '@minecraft/server';

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {

    const { itemStack, player, block } = event

    const lore = itemStack?.getRawLore()[0]?.text

    if (lore?.includes('This block cannot be placed') && (player.isSneaking || (block.typeId !== 'minecraft:frame' && block.typeId !== 'minecraft:glow_frame'))) {

        sendMessage('grave.interactBlock.blockPlace', { name: player.name })
        event.cancel = true
    }
})