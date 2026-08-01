import { system, world } from '@minecraft/server';
import { openGrave } from './openGrave';

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {

    if (hitEntity.typeId == 'grave:grave_stone' && damagingEntity.typeId == 'minecraft:player') {

        const display = damagingEntity.onScreenDisplay;

        if (!damagingEntity.isSneaking) display.setActionBar({ translate: 'grave.info.quickloot' });

        if (damagingEntity.isSneaking) {

            system.run(() => { openGrave(hitEntity, damagingEntity) })
        }
    }
});

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {

    const player = event.player;
    const target = event.target;

    if (target.typeId === 'grave:grave_stone' && player.typeId === 'minecraft:player') {

        if (player.isSneaking) {

            system.run(() => { openGrave(target, player) })
            event.cancel = true;
        }
    }
})