import {User} from '../Interfaces/Users.interface';
import fetch from 'node-fetch';
import {Request, Response} from 'express';
import {Todos} from "../Interfaces/Todos.interface";


export const getUsersByName = async (req: Request, res: Response) => {
    try {
        const resp = await fetch('https://jsonplaceholder.typicode.com/users');
        const json = await resp.json();
        if (json) {
            const result = req.params.searchStr ? json.filter((el: User) => el.name?.match(new RegExp(req.params.searchStr, 'g'))) : json;
            return result;
        } else {
            res.status(500).json({error: 'Error on getting data!!', data: null});
        }
    } catch (e) {
        res.status(500).json({error: e.message, data: null});
    }

};

export const getUsersTodosCount = async (req: Request, res: Response) => {
    const users = await getUsersByName(req, res);
    const todos: [Todos][] = await filterHelper(users, getUserTodos);

    let newUsersArray = [];
    for (let i = 0; i < todos.length; i++) {
        const us = users.filter((user: User) => {
            return user.id === todos[i][0].userId
        })[0];
        newUsersArray.push({userId: us.id, name: us.name, todosCount: todos[i].length});
    }
    return res.status(200).json({error: null, data: newUsersArray});
};


export const getCompanyName = async (req: Request, res: Response) => {

    const users = await getUsersByName(req, res);
    const todos = await filterHelper(users, getCompletedTodos);

    const filterdResultArrayForTodos = todos.filter((el: any) => {
      return el.length > 3;
    });

    let companyNames: string[] = [];
    filterdResultArrayForTodos.forEach((el: any) => {
        companyNames.push(users.filter((user: User) => {
            return user.id === el[0].userId;
        })[0].company.name)
    });

    return res.status(200).json({error: null, data: companyNames});
};

export const getUsersByPosts = async (req: Request, res: Response) => {

    const users = await getUsersByName(req, res);
    const posts = await filterHelper(users, getPosts);

    const filterdResultArrayForPosts = posts.filter(el => {
        return el.length > 2;
    });

    //comments
    let commnentsIds = [];
    for (let i = 0; i < filterdResultArrayForPosts.length; i++) {
        commnentsIds.push({id: filterdResultArrayForPosts[i][0].id})
    }

    let userResult: User[] = [];
    commnentsIds.forEach(comment => {
        filterdResultArrayForPosts.forEach(posts => {
            posts.forEach((post: any) => {
                if (comment.id === post.id) {
                    const user:User = users.filter((user: User) => {
                        return user.id === post.userId;
                    })[0];
                    userResult.push({name: user.name, email: user.email})
                }
            })

        })
    });
    return res.status(200).json({error: null, data: userResult});
};



const filterHelper = async (array: {id: number}[], func: any, ) => {
    const promiseArray = [];
    for (let i = 0; i < array.length; i++) {
        const request = await func(array[i].id);
        promiseArray.push(request.json());
    }
    const result = await Promise.all(promiseArray);
    return result;
};

export const getCompletedTodos = async (userId: number, res: Response) => {
    try {
         const resp = await fetch('https://jsonplaceholder.typicode.com/todos?userId=' + userId + '&completed=true');
         return resp;
    } catch (e) {
        res.status(500).json({error: e.message, data: null});
    }
};

export const getUserTodos = async (userId: number, res: Response) => {
    try {
         const resp = await fetch('https://jsonplaceholder.typicode.com/todos?userId=' + userId);
         return resp;
    } catch (e) {
        res.status(500).json({error: e.message, data: null});
    }
};

export const getPosts = async (userId: number, res: Response) => {
    try {
         const resp = await fetch('https://jsonplaceholder.typicode.com/posts?userId=' + userId);
         return resp;
    } catch (e) {
        res.status(500).json({error: e.message, data: null});
    }
};

export const getCommentsByPostId = async (postId: number, res: Response) => {
    try {
         const resp = await fetch('https://jsonplaceholder.typicode.com/comments?postId=' + postId);
         return resp;
    } catch (e) {
        res.status(500).json({error: e.message, data: null});
    }
};


