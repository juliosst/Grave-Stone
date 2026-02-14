import { world, system } from '@minecraft/server';

function openGrave(grave, player) {

    system.run(() => {

        const level = grave?.getDynamicProperty('totalXp');
        const graveInv = grave.getComponent('inventory').container;
        const playerInv = player.getComponent('inventory').container;

        player.playSound('random.pop');

        if (level) { player.addExperience(level) }

        for (let slot = 0; slot <= 40; slot++) {

            if (slot <= 35) {

                if (!playerInv?.getItem(slot)) {

                    playerInv.setItem(slot, graveInv?.getItem(slot));
                    graveInv?.setItem(slot);
                }
            }

            function setArmor(type) {

                const playerArmor = player.getComponent('equippable');

                if (!playerArmor?.getEquipment(type)) {

                    playerArmor.setEquipment(type, graveInv.getItem(slot));
                    graveInv?.setItem(slot);
                }
            }

            if (slot === 36) { setArmor('Head') }
            if (slot === 37) { setArmor('Chest') }
            if (slot === 38) { setArmor('Legs') }
            if (slot === 39) { setArmor('Feet') }
            if (slot === 40) { setArmor('Offhand') }

            grave.triggerEvent('grave:open');
        }
    })
}

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {

    if (hitEntity.typeId === 'grave:grave' && damagingEntity.typeId === 'minecraft:player') {

        openGrave(hitEntity, damagingEntity);
    }
});

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {

    const player = event.player;
    const target = event.target

    if (target.typeId === 'grave:grave' && player.typeId === 'minecraft:player') {

        openGrave(target, player);
        event.cancel = true;
    }
})