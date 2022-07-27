// region Imports
import { Meteor } from 'meteor/meteor'
import { segurancaApi } from '/imports/seguranca/api/SegurancaApi'
import { Recurso } from '../config/Recursos'
import { exampleSch, IExample } from './exampleSch'
import { getUser } from '/imports/libs/getUser'
import { userprofileServerApi } from '/imports/userprofile/api/UserProfileServerApi'
import { ProductServerBase } from '/imports/api/productServerBase'
// endregion

class ExampleServerApi extends ProductServerBase<IExample> {
    constructor() {
        super('example', exampleSch)

        this.addTransformedPublication(
            'exampleList',
            (filter = {}, options = {}) => {
                const user = getUser()

                if (!segurancaApi.podeAcessarRecurso(user, Recurso.EXEMPLO_VIEW))
                    throw new Meteor.Error(
                        'erro.example.permissaoInsuficiente',
                        'Você não possui permissão o suficiente para visualizar estes dados!'
                    )

                const newFilter = { ...filter }
                const newOptions = {
                    ...options,
                    projection: { image: 1, title: 1, description: 1, createdby: 1 },
                }
                return this.defaultCollectionPublication(newFilter, newOptions)
            },
            (doc: IExample & { nomeUsuario: string }) => {
                const userProfileDoc = userprofileServerApi
                    .getCollectionInstance()
                    .findOne({ _id: doc.createdby })
                return { ...doc, nomeUsuario: userProfileDoc?.username }
            }
        )

        this.addPublication('exampleDetail', (filter = {}, options = {}) => {
            const newFilter = { ...filter }
            const newOptions = { ...options }
            return this.defaultCollectionPublication(newFilter, newOptions)
        })
    }
}

export const exampleServerApi = new ExampleServerApi()
