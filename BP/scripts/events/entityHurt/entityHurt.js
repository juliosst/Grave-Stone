import { correctUp, correctDown } from './correctPos';
import { damageFix } from '../../functions/function';
import { world, system } from '@minecraft/server';
import { spawnGrave } from './spawnGrave';
import { saveInv } from './saveInv';

let skipHurt = {}

world.beforeEvents.entityHurt.subscribe((event) => {

    const { hurtEntity, damage } = event
    let { damagingEntity, damagingProjectile, cause } = event.damageSource

    const x = Math.floor(hurtEntity.location.x) + 0.5
    let y = Math.floor(hurtEntity.location.y)
    const z = Math.floor(hurtEntity.location.z) + 0.5

    const dim = hurtEntity.dimension

    cause = damageFix(cause)

    if (hurtEntity.typeId == 'minecraft:player') {

        const health = hurtEntity.getComponent('health').currentValue

        const equ = hurtEntity.getComponent('equippable')

        if (skipHurt[hurtEntity.name]) return delete skipHurt[hurtEntity.name]

        if (

            health <= 0 &&
            ((cause === 'selfDestruct' || cause === 'void') ||
                (equ.getEquipment('Offhand')?.typeId !== 'minecraft:totem_of_undying' && equ.getEquipment('Mainhand')?.typeId !== 'minecraft:totem_of_undying'))
        ) {

            event.cancel = true

            system.run(() => {

                saveInv(hurtEntity);

                if (y > dim.heightRange.max) y = dim.heightRange.max
                if (y < dim.heightRange.min) y = dim.heightRange.min

                const blockId = dim.getBlock({ x, y, z }).typeId

                if (blockId == 'minecraft:air') {

                    if (correctDown(hurtEntity, dim, { x, y, z })) return;
                    if (correctUp(hurtEntity, dim, { x, y, z })) return;

                } else if (blockId !== 'minecraft:air') {

                    if (correctUp(hurtEntity, dim, { x, y, z })) return;
                    if (correctDown(hurtEntity, dim, { x, y, z })) return;
                }

                spawnGrave(hurtEntity, { x, y: (y + 2), z })
            })

            system.runTimeout(() => {

                if (damagingProjectile) {

                    damagingProjectile = dim.spawnEntity(damagingProjectile.typeId, { x, y, z })
                }

                if (damagingEntity && damagingEntity.typeId !== 'minecraft:player') {

                    damagingEntity = dim.spawnEntity(damagingEntity.typeId, { x, y, z })
                }

                skipHurt[hurtEntity.name] = true
                hurtEntity.applyDamage(damage * 2, { cause, damagingProjectile, damagingEntity })

                if (damagingProjectile) damagingProjectile.remove()
                if (damagingEntity && damagingEntity.typeId !== 'minecraft:player') damagingEntity.remove()
            }, 1)
        }
    }
})