import {expect} from 'chai';
import app from '../app';
import {agent as request} from 'supertest';

describe('Api service', () => {
    it('should Get /get_users_by_posts/le ', async function () {
        const res = await request(app)
            .get('/get_users_by_posts/le');
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.error).to.be.an("null");
    });

    it('should Get /get_users_todos_count/le ', async function () {
        const res = await request(app)
            .get('/get_users_todos_count/le');
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.error).to.be.an("null");
    });

    it('should Get /get_data/le ', async function () {
        const res = await request(app)
            .get('/get_data/le');
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.error).to.be.an("null");
    });
});
