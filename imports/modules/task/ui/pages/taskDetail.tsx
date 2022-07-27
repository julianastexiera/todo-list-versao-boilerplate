import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { taskApi } from '../../api/taskApi';
import SimpleForm from '../../../../ui/components/SimpleForm/SimpleForm';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import TextMaskField from '../../../../ui/components/SimpleFormFields/TextMaskField/TextMaskField';
import RadioButtonField from '../../../../ui/components/SimpleFormFields/RadioButtonField/RadioButtonField';
import SelectField from '../../../../ui/components/SimpleFormFields/SelectField/SelectField';
import UploadFilesCollection from '../../../../ui/components/SimpleFormFields/UploadFiles/uploadFilesCollection';
import ChipInput from '../../../../ui/components/SimpleFormFields/ChipInput/ChipInput';
import SliderField from '/imports/ui/components/SimpleFormFields/SliderField/SliderField';
import AudioRecorder from '/imports/ui/components/SimpleFormFields/AudioRecorderField/AudioRecorder';
import ImageCompactField from '/imports/ui/components/SimpleFormFields/ImageCompactField/ImageCompactField';
import Print from '@mui/icons-material/Print';
import Close from '@mui/icons-material/Close';
import { PageLayout } from '/imports/ui/layouts/pageLayout';
import { ITask } from '../../api/taskSch';
import {
    IDefaultContainerProps,
    IDefaultDetailProps,
    IMeteorError,
} from '/imports/typings/BoilerplateDefaultTypings';
import { useTheme } from '@mui/material/styles';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import CheckBoxField from '/imports/ui/components/SimpleFormFields/CheckBoxField/CheckBoxField';

interface ITaskDetail extends IDefaultDetailProps {
    taskDoc: ITask;
    save: (doc: ITask, _callback?: any) => void;
}

const TaskDetail = (props: ITaskDetail) => {
    const { isPrintView, screenState, loading, taskDoc, save, navigate } = props;

    const theme = useTheme();

    const handleSubmit = (doc: ITask) => {
        save(doc);
    };

    return (
        <PageLayout
            key={'TaskPageLayoutDetailKEY'}
            title={
                screenState === 'view'
                    ? 'Visualizar exemplo'
                    : screenState === 'edit'
                    ? 'Editar Exemplo'
                    : 'Criar exemplo'
            }
            onBack={() => navigate('/task')}
            actions={[
                !isPrintView ? (
                    <span
                        key={'TaskDetail-spanPrintViewKEY'}
                        style={{
                            cursor: 'pointer',
                            marginRight: 10,
                            color: theme.palette.secondary.main,
                        }}
                        onClick={() => {
                            navigate(`/task/printview/${taskDoc._id}`);
                        }}
                    >
                        <Print key={'TaskDetail-spanPrintKEY'} />
                    </span>
                ) : (
                    <span
                        key={'TaskDetail-spanNotPrintViewKEY'}
                        style={{
                            cursor: 'pointer',
                            marginRight: 10,
                            color: theme.palette.secondary.main,
                        }}
                        onClick={() => {
                            navigate(`/task/view/${taskDoc._id}`);
                        }}
                    >
                        <Close key={'TaskDetail-spanCloseKEY'} />
                    </span>
                ),
            ]}
        >
            <SimpleForm
                key={'TaskDetail-SimpleFormKEY'}
                mode={screenState}
                schema={taskApi.getSchema()}
                doc={taskDoc}
                onSubmit={handleSubmit}
                loading={loading}
            >
                <FormGroup key={'fieldsOne'}>
                    <TextField key={'txt-tituloKEY'} placeholder="Titulo" name="title" />
                    <TextField
                        key={'txt-descricaoKEY'}
                        placeholder="Descrição"
                        name="description"
                    />
                </FormGroup>

                <CheckBoxField placeholder="Pessoal" name="isPersonal" />

                {screenState !== 'create' && (
                    <CheckBoxField placeholder="Concluida?" name="situation" />
                )}

                <div
                    key={'Buttons'}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'left',
                        paddingTop: 20,
                        paddingBottom: 20,
                    }}
                >
                    {!isPrintView ? (
                        <Button
                            key={'b1'}
                            style={{ marginRight: 10 }}
                            onClick={
                                screenState === 'edit'
                                    ? () => navigate(`/task/view/${taskDoc._id}`)
                                    : () => navigate(`/task/list`)
                            }
                            color={'secondary'}
                            variant="contained"
                        >
                            {screenState === 'view' ? 'Voltar' : 'Cancelar'}
                        </Button>
                    ) : null}

                    {!isPrintView && screenState === 'view' ? (
                        <Button
                            key={'b2'}
                            onClick={() => {
                                navigate(`/task/edit/${taskDoc._id}`);
                            }}
                            color={'primary'}
                            variant="contained"
                        >
                            {'Editar'}
                        </Button>
                    ) : null}
                    {!isPrintView && screenState !== 'view' ? (
                        <Button
                            key={'b3'}
                            color={'primary'}
                            variant="contained"
                            {...{ submit: true }}
                        >
                            {'Salvar'}
                        </Button>
                    ) : null}
                </div>
            </SimpleForm>
        </PageLayout>
    );
};

interface ITaskDetailContainer extends IDefaultContainerProps {}

export const TaskDetailContainer = withTracker((props: ITaskDetailContainer) => {
    const { screenState, id, navigate, showNotification } = props;

    const subHandle = !!id ? taskApi.subscribe('taskDetail', { _id: id }) : null;
    let taskDoc = id && subHandle?.ready() ? taskApi.findOne({ _id: id }) : {};

    return {
        screenState,
        taskDoc,
        save: (doc: ITask, _callback: () => void) => {
            const selectedAction = screenState === 'create' ? 'insert' : 'update';
            taskApi[selectedAction](doc, (e: IMeteorError, r: string) => {
                if (!e) {
                    navigate(`/task/view/${screenState === 'create' ? r : doc._id}`);
                    showNotification &&
                        showNotification({
                            type: 'success',
                            title: 'Operação realizada!',
                            description: `A tarefa foi ${
                                doc._id ? 'atualizada' : 'cadastrada'
                            } com sucesso!`,
                        });
                } else {
                    console.log('Error:', e);
                    showNotification &&
                        showNotification({
                            type: 'warning',
                            title: 'Operação não realizada!',
                            description: `Erro ao realizar a operação: ${e.reason}`,
                        });
                }
            });
        },
    };
})(showLoading(TaskDetail));
