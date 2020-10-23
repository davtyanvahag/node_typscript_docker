import express, {Request, Response} from 'express';
import * as bodyparser from 'body-parser';
import cors from 'cors';
import * as ApiService from "./services/api.sevice";

const app = express();
app.use(cors())

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.get('/get_data/:searchStr?', (req: Request, res: Response) => {
    ApiService.getCompanyName(req, res)
});

app.get('/get_users_by_posts/:searchStr?', (req: Request, res: Response) => {
    ApiService.getUsersByPosts(req, res)
});

app.get('/get_users_todos_count/:searchStr?', (req: Request, res: Response) => {
    ApiService.getUsersTodosCount(req, res)
});

app.listen(5000, () => console.log('Server run on 5000 port'));

export default app;
