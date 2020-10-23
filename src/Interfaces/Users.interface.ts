import {Address} from './Address.interface';
export  interface  User {
        id?: number;
        name?: string;
        username?: string;
        email?: string;
        address?: Address;
        phone?: string;
        website?: string;
        company?: {
            name: string,
            catchPhrase: string,
            bs: string
        };

}
