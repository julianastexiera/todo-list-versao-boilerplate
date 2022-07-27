import { Recurso as Exemplo } from '/imports/modules/example/config/Recursos';
import { Recurso as Task } from '/imports/modules/task/config/Recursos';

import { RoleType } from '/imports/seguranca/config/RoleType';

type MapRolesRecursos = {
    [key: string]: string[];
};

// @ts-ignore
function obterStringsEnum(enumValue: { [s: number]: string | number }): [string] {
    // @ts-ignore
    return Object.values(enumValue).filter((value) => typeof value === 'string');
}

/**
 * Mapeamento entre as roles (perfil de usuário) e os recursos.
 * chave: role.
 * valores: recursos.
 *
 *
 * O nome do recurso deve ser prefixado com nome do módulo.
 *
 * Favor manter a ordem alfabética no nome dos módulos.
 *
 */
export const mapRolesRecursos: MapRolesRecursos = {
    [RoleType.ADMINISTRADOR]: [
        Exemplo.EXEMPLO_VIEW,
        Exemplo.EXEMPLO_CREATE,
        Task.TASK_VIEW,
        Task.TASK_CREATE,
    ],
    [RoleType.USUARIO]: [
        Exemplo.EXEMPLO_VIEW,
        Exemplo.EXEMPLO_CREATE,
        Task.TASK_VIEW,
        Task.TASK_CREATE,
    ],
    [RoleType.PUBLICO]: [],
};
