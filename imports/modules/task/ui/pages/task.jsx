import React from 'react';
import { useNavigate } from 'react-router-dom';
import { List } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import { taskApi } from '/imports/modules/task/api/taskApi';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CardActionArea } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

//export const Task = ({ task, username, onCheckboxClick, onDeleteClick }) => {
export const Task = ({
    task,
    username,
    showWindow,
    showDrawer,
    showModal,
    onDeleteClick,
    onUpdateClick,
}) => {
    const navigate = useNavigate();
    const { _id } = task;

    const isEditable = task.username === username;

    const color = isEditable ? '#5a9902' : '#ccc';

    const mudarSituacao = (id, novaSituacao) => {
        taskApi.callMethod('MudarSituacao', id, novaSituacao);
    };

    const mudarIsPersonal = (id, novaSituacao) => {
        taskApi.callMethod('MudarIsPersonal', id, novaSituacao);
    };

    const [checkedIsPersonal, setCheckedIsPersonal] = React.useState(task.isPersonal);

    const handleCheckIsPersonalChange = (event) => {
        if (username == task.username) {
            setCheckedIsPersonal(event.target.checked);
            mudarIsPersonal(_id, event.target.checked);
        }
    };
    const [checkedSituation, setCheckedSituation] = React.useState(task.situation);

    const handleCheckSituationChange = (event) => {
        if (username == task.username) {
            setCheckedSituation(event.target.checked);
            mudarSituacao(_id, event.target.checked);
        }
    };

    const createModalWindow = () => {
        showModal({ title: 'Tarefa', url: '/task/view/' + _id });
    };

    return (
        <List>
            <Card sx={{ minWidth: 275 }}>
                <CardActionArea>
                    <CardActions>
                        <Button key={_id} onClick={createModalWindow} size="small"></Button>
                    </CardActions>
                    <ListItem
                        secondaryAction={[
                            <FormControlLabel
                                style={{ color: color }}
                                label="Pessoal?"
                                control={
                                    <Checkbox
                                        style={{ color: color }}
                                        checked={task.isPersonal}
                                        onChange={handleCheckIsPersonalChange}
                                        disabled={!isEditable}
                                    />
                                }
                            />,
                            <FormControlLabel
                                style={{ color: color }}
                                label="Concluída?"
                                control={
                                    <Checkbox
                                        style={{ color: color }}
                                        checked={task.situation}
                                        onChange={handleCheckSituationChange}
                                        disabled={!isEditable}
                                    />
                                }
                            />,
                            <IconButton
                                color={'primary'}
                                edge="end"
                                aria-label="edit"
                                onClick={() => onUpdateClick(task)}
                                disabled={!isEditable}
                            >
                                <EditIcon style={{ color: color }} />
                            </IconButton>,
                            <IconButton
                                color={'primary'}
                                edge="end"
                                aria-label="delete"
                                onClick={() => onDeleteClick(task)}
                                disabled={!isEditable}
                            >
                                <DeleteIcon style={{ color: color }} />
                            </IconButton>,
                        ]}
                    >
                        <ListItemText primary={task.title} secondary={task.username} />
                    </ListItem>
                </CardActionArea>
            </Card>
        </List>
    );
};
