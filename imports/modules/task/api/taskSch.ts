import { IDoc } from '/imports/typings/IDoc';

export const taskSch = {
    title: {
        type: String,
        label: 'Título',
        defaultValue: '',
        optional: false,
    },
    description: {
        type: String,
        label: 'Descrição',
        defaultValue: '',
        optional: true,
    },
    isPersonal: {
        type: Boolean,
        label: 'Pessoal',
        defaultValue: false,
        optional: true,
    },
    situation: {
        type: Boolean,
        label: 'Situação',
        defaultValue: false,
        optional: true,
    },
    username: {
        type: String,
        label: 'Usuário',
        defaultValue: '',
        optional: false,
    },
};

export interface ITask extends IDoc {
    title: string;
    description: string;
    isPersonal: boolean;
    situation: boolean;
    username: string;
}
