import ClientDAO, { ClientDao } from "../daos/client-dao";
import Account from "../account";
import Client from "../client";
import { ClientContext, Container } from "@azure/cosmos";
import {v4} from "uuid";


export interface ClientServices{


    addAccounttoClient(id:string, account: Account):Promise<Client>;
    getallAccounts(id:string):Promise<Account[]>;
    getclientbyID(id:string): Promise<Client>;
}

export class ClientServicesImp implements ClientServices{

    constructor (private clientdao: ClientDao){}

    async addAccounttoClient(id: string, account:Account): Promise<Client> {
        const client:Client = await this.clientdao.getClientbyID(id);
        //if statement- if no account, create one
        if(!client.accounts){
            client.accounts = [];
        }
        client.accounts.push(account)
        await this.clientdao.updateClient(client);
        return client;
    }
    async getclientbyID(id:string):Promise<Client>{
       return await this.clientdao.getClientbyID(id);
    
    }
    
    async getallAccounts(id:string):Promise<Account[]> {
        const client: Client = await this.clientdao.getClientbyID(id);
        return client.accounts;
    }

    }
  
        

