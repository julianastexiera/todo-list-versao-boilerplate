import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { taskApi } from '../../api/taskApi';
import { userprofileApi } from '../../../../userprofile/api/UserProfileApi';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { SimpleTable } from '/imports/ui/components/SimpleTable/SimpleTable';
import _ from 'lodash';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import TablePagination from '@mui/material/TablePagination';
import { ReactiveVar } from 'meteor/reactive-var';
import { initSearch } from '/imports/libs/searchUtils';
import * as appStyle from '/imports/materialui/styles';
import shortid from 'shortid';
import { PageLayout } from '/imports/ui/layouts/pageLayout';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import SearchDocField from '/imports/ui/components/SimpleFormFields/SearchDocField/SearchDocField';
import {
    IDefaultContainerProps,
    IDefaultListProps,
    IMeteorError,
} from '/imports/typings/BoilerplateDefaultTypings';
import { ITask } from '../../api/taskSch';
import { IConfigList } from '/imports/typings/IFilterProperties';
import { Recurso } from '../../config/Recursos';
import { RenderComPermissao } from '/imports/seguranca/ui/components/RenderComPermisao';
import { isMobile } from '/imports/libs/deviceVerify';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import { ComplexTable } from '/imports/ui/components/ComplexTable/ComplexTable';
import ToggleField from '/imports/ui/components/SimpleFormFields/ToggleField/ToggleField';
import { List } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import { getUser } from '/imports/libs/getUser';
import { Task } from './task';
import Switch from '@mui/material/Switch';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface ITaskList extends IDefaultListProps {
    remove: (doc: ITask) => void;
    viewComplexTable: boolean;
    setViewComplexTable: (_enable: boolean) => void;
    tasks: ITask[];
    setFilter: (newFilter: Object) => void;
    clearFilter: () => void;
    home: boolean;
}

export const TaskList = (props: ITaskList) => {
    const {
        tasks,
        navigate,
        remove,
        showDeleteDialog,
        onSearch,
        total,
        loading,
        viewComplexTable,
        setViewComplexTable,
        setFilter,
        clearFilter,
        setPage,
        setPageSize,
        searchBy,
        pageProperties,
        isMobile,
        showWindow,
        showDrawer,
        showModal,
    } = props;

    console.log(tasks);
    let { screenState, taskId } = useParams();

    React.useEffect(() => {
        setFilter({});
    }, [Meteor.status().connected]);

    console.log('PARAMETROS');

    const idTask = shortid.generate();

    const onClick = (_event: React.SyntheticEvent, id: string) => {
        navigate('/task/view/' + id);
    };

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number
    ) => {
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(1);
    };

    const [text, setText] = React.useState(searchBy || '');

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearFilter();
        if (text.length !== 0 && e.target.value.length === 0) {
            onSearch();
        }
        setText(e.target.value);
    };
    const keyPress = (_e: React.SyntheticEvent) => {
        // if (e.key === 'Enter') {
        if (text && text.trim().length > 0) {
            //  onSearch(text.trim());
            setFilter({ title: text.trim() });
        } else {
            onSearch();
        }
        // }
    };

    const click = (_e: any) => {
        if (text && text.trim().length > 0) {
            //onSearch(text.trim());
            setFilter({ title: text.trim() });
        } else {
            onSearch();
        }
    };

    const callUpdate = (doc: ITask) => {
        console.log(doc._id);
        navigate('/task/view/' + doc._id);
    };

    const callRemove = (doc: ITask) => {
        const title = 'Remover tarefa';
        const message = `Deseja remover a tarefa "${doc.title}"?`;
        showDeleteDialog && showDeleteDialog(title, message, doc, remove);
    };

    const handleSearchDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        !!e.target.value ? setFilter({ createdby: e.target.value }) : clearFilter();
    };

    const [checked, setChecked] = React.useState(false);

    const handleCheckSituationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        console.log(event);
    };

    const user = getUser();

    console.log(user);

    /*  const [checkedConcluidas, setCheckedConcluidas] = React.useState(false);

    const handleChangeConcluidas = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedConcluidas(event.target.checked);
        setFilter({ situation: event.target.checked });
    }; */

    const [filtro, setFiltro] = React.useState('');

    let valor: boolean;

    const handleFiltroChange = (event: SelectChangeEvent) => {
        console.log('entrou');
        setFiltro(event.target.value as string);
        event.target.value == '1'
            ? clearFilter()
            : event.target.value == '2'
            ? setFilter({ situation: false })
            : setFilter({ situation: true });
    };

    return (
        <PageLayout title={'Lista de Tarefas'} actions={[]}>
            {(!viewComplexTable || isMobile) && (
                <>
                    <TextField
                        name={'pesquisar'}
                        label={'Pesquisar'}
                        value={text}
                        onChange={change}
                        onKeyPress={keyPress}
                        placeholder="Digite aqui o que deseja pesquisa..."
                        action={{ icon: 'search', onClick: click }}
                    />

                    {/* <div style={{ display: 'flex', flexDirection: 'row' }}>
                        Concluidas?
                        <Switch
                            checked={checkedConcluidas}
                            onChange={handleChangeConcluidas}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </div> */}

                    <Box sx={{ minWidth: 50 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Escolha um filtro</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filtro}
                                label="Filtro"
                                onChange={handleFiltroChange}
                            >
                                <MenuItem value={1}>Todos</MenuItem>
                                <MenuItem value={2}>Não concluídas</MenuItem>
                                <MenuItem value={3}>Concluídas</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <List>
                        {tasks.map((task) => (
                            <Task
                                key={task._id}
                                task={task}
                                username={user.username}
                                showWindow={showWindow}
                                showDrawer={showDrawer}
                                showModal={showModal}
                                // onCheckboxClick={toggleChecked}
                                onUpdateClick={callUpdate}
                                onDeleteClick={callRemove}
                            />
                        ))}
                    </List>
                </>
            )}

            {/* {!isMobile && viewComplexTable && (
                <ComplexTable
                    data={tasks}
                    schema={_.pick(
                        {
                            ...taskApi.schema,
                            nomeUsuario: { type: String, label: 'Criado por' },
                        },
                        ['title', 'description', 'isPersonal', 'situation', 'nomeUsuario']
                    )}
                    onRowClick={(row) => navigate('/task/view/' + row.id)}
                    searchPlaceholder={'Pesquisar tarefa'}
                    onDelete={callRemove}
                    onEdit={(row) => navigate('/task/edit/' + row._id)}
                    toolbar={{
                        selectColumns: true,
                        exportTable: { csv: true, print: true },
                        searchFilter: true,
                    }}
                    onFilterChange={onSearch}
                    loading={loading}
                />
            )} */}

            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <TablePagination
                    style={{ width: 'fit-content', overflow: 'unset' }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    labelRowsPerPage={''}
                    component="div"
                    count={total || 0}
                    rowsPerPage={pageProperties.pageSize}
                    page={pageProperties.currentPage - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                    }}
                />
            </div>

            <RenderComPermissao recursos={[Recurso.TASK_CREATE]}>
                <div
                    style={{
                        position: 'fixed',
                        bottom: isMobile ? 80 : 30,
                        right: 30,
                    }}
                >
                    <Button
                        key={'voltar'}
                        style={{ marginRight: 10 }}
                        onClick={() => navigate(`/`)}
                        color={'secondary'}
                        variant="contained"
                    >
                        Voltar
                    </Button>
                    <Fab
                        id={'add'}
                        onClick={() => navigate(`/task/create/${idTask}`)}
                        color={'primary'}
                    >
                        <Add />
                    </Fab>
                </div>
            </RenderComPermissao>
        </PageLayout>
    );
};

export const subscribeConfig = new ReactiveVar<IConfigList & { viewComplexTable: boolean }>({
    pageProperties: {
        currentPage: 1,
        pageSize: 25,
    },
    sortProperties: { field: 'createdat', sortAscending: true },
    filter: {},
    searchBy: null,
    viewComplexTable: false,
});

const taskSearch = initSearch(
    taskApi, // API
    subscribeConfig, // ReactiveVar subscribe configurations
    ['title', 'description'] // list of fields
);

let onSearchTaskTyping: any;

const viewComplexTable = new ReactiveVar(false);

export const TaskListContainer = withTracker((props: IDefaultContainerProps) => {
    const { user, showNotification } = props;

    //Reactive Search/Filter
    const config = subscribeConfig.get();
    const sort = {
        [config.sortProperties.field]: config.sortProperties.sortAscending ? 1 : -1,
    };
    taskSearch.setActualConfig(config);

    //Subscribe parameters -   ORIGINAL
    // const filter = { ...config.filter };

    // MEUS PARÂMETROS
    const filter = {
        ...config.filter,
        $or: [
            { username: user?.username },
            { $and: [{ username: { $not: { $eq: user?.username } } }, { isPersonal: false }] },
        ],
    };

    // const filter = filtroPag;
    const limit = config.pageProperties.pageSize;
    const skip = (config.pageProperties.currentPage - 1) * config.pageProperties.pageSize;

    //Collection Subscribe
    const subHandle = taskApi.subscribe('taskList', filter, {
        sort,
        limit,
        skip,
    });
    const tasks = subHandle?.ready() ? taskApi.find(filter, { sort }).fetch() : [];

    return {
        tasks,
        loading: !!subHandle && !subHandle.ready(),
        remove: (doc: ITask) => {
            taskApi.remove(doc, (e: IMeteorError) => {
                if (!e) {
                    showNotification &&
                        showNotification({
                            type: 'success',
                            title: 'Operação realizada!',
                            message: `A tarefa foi removida com sucesso!`,
                        });
                } else {
                    console.log('Error:', e);
                    showNotification &&
                        showNotification({
                            type: 'warning',
                            title: 'Operação não realizada!',
                            message: `Erro ao realizar a operação: ${e.reason}`,
                        });
                }
            });
        },
        viewComplexTable: viewComplexTable.get(),
        setViewComplexTable: (enableComplexTable: boolean) =>
            viewComplexTable.set(enableComplexTable),
        searchBy: config.searchBy,
        onSearch: (...params: any) => {
            onSearchTaskTyping && clearTimeout(onSearchTaskTyping);
            onSearchTaskTyping = setTimeout(() => {
                config.pageProperties.currentPage = 1;
                subscribeConfig.set(config);
                taskSearch.onSearch(...params);
            }, 1000);
        },
        total: subHandle ? subHandle.total : tasks.length,
        pageProperties: config.pageProperties,
        filter,
        sort,
        setPage: (page = 1) => {
            config.pageProperties.currentPage = page;
            subscribeConfig.set(config);
        },
        setFilter: (newFilter = {}) => {
            config.filter = { ...filter, ...newFilter };
            Object.keys(config.filter).forEach((key) => {
                if (config.filter[key] === null || config.filter[key] === undefined) {
                    delete config.filter[key];
                }
            });
            subscribeConfig.set(config);
        },
        clearFilter: () => {
            config.filter = {};
            subscribeConfig.set(config);
        },
        setSort: (sort = { field: 'createdat', sortAscending: true }) => {
            config.sortProperties = sort;
            subscribeConfig.set(config);
        },
        setPageSize: (size = 25) => {
            config.pageProperties.pageSize = size;
            subscribeConfig.set(config);
        },
    };
})(showLoading(TaskList));
