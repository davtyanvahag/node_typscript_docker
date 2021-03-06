import express, {Request, Response} from 'express';
import * as bodyparser from 'body-parser';
import cors from 'cors';
import ApiService from "./services/api.sevice";
const apiService =  new ApiService()
const app = express();
app.use(cors())

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.get('/get_data/:searchStr?', (req: Request, res: Response) => {
    apiService.getCompanyName(req, res)
});

app.get('/get_users_by_posts/:searchStr?', (req: Request, res: Response) => {
    apiService.getUsersByPosts(req, res)
});

app.get('/get_users_todos_count/:searchStr?', (req: Request, res: Response) => {
    apiService.getUsersTodosCount(req, res)
});

app.listen(3000, () => console.log('Server run on 3000 port'));

export default app;
