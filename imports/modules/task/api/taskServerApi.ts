// region Imports
import { Meteor } from 'meteor/meteor';
import { segurancaApi } from '/imports/seguranca/api/SegurancaApi';
import { Recurso } from '../config/Recursos';
import { taskSch, ITask } from './taskSch';
import { getUser } from '/imports/libs/getUser';
import { userprofileServerApi } from '/imports/userprofile/api/UserProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { IContext } from '/imports/typings/IContext';
import { countsCollection } from '/imports/api/countCollection';
import { check } from 'meteor/check';
// endregion

class TaskServerApi extends ProductServerBase<ITask> {
    constructor() {
        super('task', taskSch);
        // como será chamado no front-end e o método que está sendo registrado
        this.registerMethod('getLastTask', this.getLastTask);

        this.registerMethod('MudarSituacao', this.serverMudarSituacao);

        this.registerMethod('MudarIsPersonal', this.serverMudarIsPersonal);

        this.addTransformedPublication(
            'taskList',
            (filter = {}, options = {}) => {
                const user = getUser();

                if (!segurancaApi.podeAcessarRecurso(user, Recurso.TASK_VIEW))
                    throw new Meteor.Error(
                        'erro.task.permissaoInsuficiente',
                        'Você não possui permissão o suficiente para visualizar estes dados!'
                    );

                const newFilter = { ...filter };
                const newOptions = {
                    ...options,
                    projection: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        isPersonal: 1,
                        situation: 1,
                        username: 1,
                    },
                };
                return this.defaultCollectionPublication(newFilter, newOptions);
            },
            (doc: ITask & { nomeUsuario: string }) => {
                const userProfileDoc = userprofileServerApi
                    .getCollectionInstance()
                    .findOne({ _id: doc.createdby });
                return { ...doc, nomeUsuario: userProfileDoc?.username };
            }
        );

        this.addPublication('taskDetail', (filter = {}, options = {}) => {
            const user = getUser();

            const newFilter = { ...filter };
            const newOptions = { ...options };
            return this.defaultCollectionPublication(newFilter, newOptions);
        });
    }

    getLastTask() {
        console.log('GETLASTTASK');
        const tasks = taskServerApi.find({}, { limit: 5, sort: { createdat: -1 } }).fetch();

        return tasks;
    }

    serverMudarSituacao = (id: string, novaSituacao: boolean, context: IContext) => {
        console.log('SERVIDOR');
        if (Meteor.isServer) {
            check(id, String);
            check(novaSituacao, Boolean);
            const { user } = context;
            const doc = this.getCollectionInstance().findOne({ _id: id });
            console.log(doc);
            doc.situation = novaSituacao;
            console.log('no servidor' + doc.situation);
            return this.serverUpdate(doc, context);
        }
    };
    serverMudarIsPersonal = (id: string, novaSituacao: boolean, context: IContext) => {
        console.log('SERVIDOR');
        if (Meteor.isServer) {
            check(id, String);
            check(novaSituacao, Boolean);
            const { user } = context;
            const doc = this.getCollectionInstance().findOne({ _id: id });
            console.log(doc);
            doc.isPersonal = novaSituacao;
            console.log('no servidor' + doc.isPersonal);
            return this.serverUpdate(doc, context);
        }
    };

    beforeInsert(docObj: ITask, context: IContext): boolean {
        const user = getUser();
        !!docObj.isPersonal ? (docObj.isPersonal = true) : (docObj.isPersonal = false);
        docObj.situation = false;
        docObj.username = user.username;
        console.log(
            docObj.title +
                ' ' +
                docObj.description +
                ' ' +
                docObj.situation +
                ' ' +
                docObj.isPersonal +
                ' ' +
                docObj.username
        );
        return super.beforeInsert(docObj, context);
    }
}

export const taskServerApi = new TaskServerApi();
