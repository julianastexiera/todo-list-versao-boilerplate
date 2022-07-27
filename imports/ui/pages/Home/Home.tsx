import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import Container from '@mui/material/Container';
import { getUser } from '/imports/libs/getUser';
import Card from '@mui/material/Card';
import { List } from '@mui/material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import NoiseControlOffIcon from '@mui/icons-material/NoiseControlOff';

import { TaskList } from '/imports/modules/task/ui/pages/taskList';
//import { taskServerApi} from 'imports/modules/task/api/taskServerApi';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import * as appStyle from '/imports/materialui/styles';
import { taskApi } from '/imports/modules/task/api/taskApi';

const Home = () => {
    const user = getUser();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);

    // const filter = filtroPag;
    React.useEffect(() => {
        taskApi.callMethod('getLastTask', (e, r) => {
            if (!e) {
                console.log(r);
                setTasks(r);
            } else {
                console.error('error', e);
            }
        });
    }, [Meteor.status().connected]);
    const subHandle = taskApi.subscribe('taskList', {}, {});

    console.log('FORA');
    console.log(tasks);
    return (
        <>
            <Container>
                <h1>Olá, {!!user && user.username}</h1>
                <p></p>
                <p>Seus projetos muitos mais organizados.</p>
                <p>Veja as tarefas adicionadas por seu time, por você e para você!</p>
                <p></p>
                <p></p>
                <h2>Lista de tarefas</h2>
                {!!tasks &&
                    tasks.map((task) => (
                        <div
                            key={'Card'}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'left',
                                paddingTop: 5,
                                paddingBottom: 5,
                            }}
                        >
                            <Card sx={{ minWidth: 275 }} style={{ display: 'flex' }}>
                                <List style={{ flexDirection: 'row' }}>
                                    <ListItemText
                                        style={{ flexDirection: 'row' }}
                                        primary={task.title}
                                        secondary={task.username}
                                    />
                                </List>
                            </Card>
                        </div>
                    ))}
                <Button
                    key={'home-b1'}
                    style={{ marginRight: 10 }}
                    onClick={() => navigate(`/task/list`)}
                    color={'secondary'}
                    variant="contained"
                >
                    Tarefas
                </Button>
            </Container>
        </>
    );
};

export default Home;
