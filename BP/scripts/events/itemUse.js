import { world, system } from '@minecraft/server';

world.afterEvents.itemUse.subscribe(({ source, itemStack }) => {

    system.run(() => {

        if (source.typeId === 'minecraft:player' && itemStack.typeId === 'grave:map') {

            const location = JSON.parse(itemStack?.getDynamicProperty('location'));

            if (location) {

                const dimension = location.dimension.replace('minecraft:', '');

                const x = location.x - 0.5
                const y = location.y
                const z = location.z - 0.5

                source.sendMessage(`
§r§3Dimension: §6${dimension}
§cX: ${x}, Y: ${y}, Z: ${z}`);
            }
        }
    })
})