export function damageFix(cause) {

    const replace = {

        'projectile': 'entityAttack'
    }

    return replace[cause] ?? cause
} 