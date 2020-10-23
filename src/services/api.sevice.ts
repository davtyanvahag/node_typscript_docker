import {User} from '../Interfaces/Users.interface';
import fetch from 'node-fetch';
import {Request, Response} from 'express';

export default class ApiService {
    public getUsersByName = async (req: Request, res: Response) => {
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

    public getUsersTodosCount = async (req: Request, res: Response) => {
        const users = await this.getUsersByName(req, res);
        const todos: any = await this.filterHelper(users, this.getUserTodos);

        let newUsersArray = [];
        for (let i = 0; i < todos.length; i++) {
            const us = users.filter((user: User) => {
                return user.id === todos[i][0].userId
            })[0];
            newUsersArray.push({userId: us.id, name: us.name, todosCount: todos[i].length});
        }
        return res.status(200).json({error: null, data: newUsersArray});
    };


    public getCompanyName = async (req: Request, res: Response) => {

        const users = await this.getUsersByName(req, res);
        const todos = await this.filterHelper(users, this.getCompletedTodos);

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

    public getUsersByPosts = async (req: Request, res: Response) => {

        const users = await this.getUsersByName(req, res);
        const posts = await this.filterHelper(users, this.getPosts);

        const filterdResultArrayForPosts: any = posts.filter((el: any) => {
            return el.length > 2;
        });

        //comments
        let userResult: User[] = [];
        let postIds: {id: number}[] = []

        filterdResultArrayForPosts.forEach((el: any) => {
            postIds.push({id: el.id});
        });

        const comments = await this.filterHelper(postIds, this.getCommentsByPostId);

        comments.filter( (el: any) => {
            return el.length > 3;
        });

        comments.forEach((el: any) => {
            postIds.forEach((id) => {
                if (el.postId === id) {
                    const user:User = users.filter((user: User) => {
                        return user.id === el[0].userId;
                    })[0];
                    userResult.push({name: user.name, email: user.email})
                }
            })
        });

        return res.status(200).json({error: null, data: userResult});
    };



    private filterHelper = async (array: {id: number}[], func: any, ) => {
        const promiseArray: any = [];
        array.forEach(async (el) => {
            const request = await func(el.id);
            promiseArray.push(request.json());
        });
        const result = await Promise.all(promiseArray);
        return result;
    };

    public getCompletedTodos = async (userId: number, res: Response) => {
        try {
            const resp = await fetch('https://jsonplaceholder.typicode.com/todos?userId=' + userId + '&completed=true');
            return resp;
        } catch (e) {
            res.status(500).json({error: e.message, data: null});
        }
    };

    public getUserTodos = async (userId: number, res: Response) => {
        try {
            const resp = await fetch('https://jsonplaceholder.typicode.com/todos?userId=' + userId);
            return resp;
        } catch (e) {
            res.status(500).json({error: e.message, data: null});
        }
    };

    public getPosts = async (userId: number, res: Response) => {
        try {
            const resp = await fetch('https://jsonplaceholder.typicode.com/posts?userId=' + userId);
            return resp;
        } catch (e) {
            res.status(500).json({error: e.message, data: null});
        }
    };

    public getCommentsByPostId = async (postId: number, res: Response) => {
        try {
            const resp = await fetch('https://jsonplaceholder.typicode.com/comments?postId=' + postId);
            const json = await resp.json();
            return json;
        } catch (e) {
            res.status(500).json({error: e.message, data: null});
        }
    };
}



