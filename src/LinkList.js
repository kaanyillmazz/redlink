import React from 'react'
import axios from "axios";

import List from '@mui/material/List';
import {Pagination, Typography} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import {Box, Grid, Paper} from '@mui/material'
import Fab from '@mui/material/Fab';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


import Button from "@mui/material/Button";
import Paginator from "./Pagination";

const client = axios.create({
    baseURL: "https://mockend.com/kaanyillmazz/redlink/posts"
});

let obj = function (id, title, points) {
    this.id = id;
    this.title = title;
    this.points = points;
}
let obj1 = new obj(1, "Loading...", "0");
let obj2 = new obj(2, "Loading...", "0");
let obj3 = new obj(3, "Loading...", "0");

let postsHolder = [obj1, obj2, obj3];

function LinkList() {


    const [posts, setPosts] = React.useState(postsHolder);


    React.useEffect(() => {
        async function getPosts() {
            const response = await client.get("");
            postsHolder = response.data;
            setPosts(response.data);
        }

        getPosts();
    }, []);


    console.log(posts);
    console.log(posts.at(0));

    const MyListItem = ({index}) => {
        const [open, setOpen] = React.useState(false);
        const [show, setShow] = React.useState(false);
        const AlertDialogNew = () => {

            const handleClick = () => {
                setOpen(true);
            };
            const handleClose = () => {
                setOpen(false);
            };
            const handleDelete = () => {
                deleteHandler();
                setOpen(false);
            };

            let box;
            if (show) {
                box = <Box sx={{'& > :not(style)': {m: 1}}}>
                    <Fab size="small" color="secondary" aria-label="edit" style={{position: 'absolute'}}>
                        <DeleteOutlineIcon onClick={handleClick}/>
                    </Fab>
                </Box>
            }
            return (
                <div>
                    {box}
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">
                            {"Are you sure you want to delete this?"}
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={handleClose}>No</Button>
                            <Button onClick={handleDelete} autoFocus> Yes </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }

        const handleFocusEnter = () => {
            setShow(true)
        };
        const handleFocusLeave = () => {
            setShow(false);
        };

        const likeHandler = async () => {
            let post = posts[index];
            const id = post.id;
            const points = post.points;
            const title = post.title;
            const article = {id: id, title: title, points: points + 1};
            const response = await client.put(`/${id}`, article);
            postsHolder[index] = article;
            setPosts(postsHolder);
        };

        const dislikeHandler = async () => {
            const id = posts[index].id;
            const points = posts[index].points
            const title = posts[index].title
            const article = {id: id,  title: title, points: points - 1};
            const response = await client.put(`/${id}`, article);
            postsHolder[index] = article;
            setPosts(postsHolder);

        };

        const deleteHandler = async () => {
            const id = posts[index].id;
            const response = await client.delete(`/${id}`);
            let value0 = posts[index];
            postsHolder = postsHolder.filter(item => item !== value0)
            setPosts(postsHolder);
        };

        let ListItem0;
        if (posts[index]) {
            let str = posts[index].title;
            let str1 = "https://" + str + ".com"
            ListItem0 =
                <ListItem alignItems="flex-start" onMouseEnter={handleFocusEnter} onMouseLeave={handleFocusLeave}>
                    <div>
                        <Fab onClick={function () {likeHandler();}}
                             size="small"
                             style={{position: 'absolute', right: 0, bottom: 5, height: 20, width: 20, minHeight: 20}}>
                            <KeyboardArrowUpIcon/>
                        </Fab>
                        <Fab onClick={function () {dislikeHandler();}}
                             size="small"
                             style={{position: 'absolute', right: 26, bottom: 5, height: 20, width: 20, minHeight: 20}}>
                            <KeyboardArrowDownIcon/>
                        </Fab>
                    </div>
                    <Paper variant="outlined" square style={{padding: "1px", marginRight: "10px"}}>
                        <Grid container textAlign="center" justifyContent="center"
                              style={{minHeight: 80, maxHeight: 80, minWidth: 80}}>
                            <Grid item>
                                <h1 style={{fontSize: "medium"}}>{posts[index].points}</h1>
                                <h1 style={{fontSize: "medium"}}>Points</h1>
                            </Grid>
                        </Grid>
                    </Paper>
                    <ListItemText
                        primary={str}
                        secondary={
                            <React.Fragment>
                                {str1}
                            </React.Fragment>
                        }/>
                    <AlertDialogNew/>
                </ListItem>
        }

        return ListItem0;
    }


    const [page, setPage] = React.useState(1);
    let index = (((3*page)-3));

    const paginateHandler = (event) => {
        let page1 = event.target.innerText;
        setPage(page1);
        index = (((3*page)-3));

    };
    return (
        <div>
            <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>

            <MyListItem index={index}/>
            <Divider variant="inset" component="li"/>
            <MyListItem index={index + 1}/>
            <Divider variant="inset" component="li"/>
            <MyListItem index={index + 2}/>
        </List>
            <Pagination count={10} page={page} onChange={paginateHandler}/>
        </div>


    );
}
export default LinkList;