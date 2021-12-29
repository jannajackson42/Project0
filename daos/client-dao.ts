import  Client from "../client";
import Account from "../account"
import {CosmosClient} from "@azure/cosmos";
import {v4} from "uuid";

export default interface ClientDAO{
    //Create
    createClient(client:Client): Promise<Client>;

    //Read
    getAllClients(): Promise<Client[]>;
    getClientbyID(id:string): Promise<Client>;
    getAllAccountsByID(id:string): Promise<Account[]>;

    //Update
    updateClient(client:Client): Promise<Client>

    //Delete
    deleteClientById(id: string): Promise<boolean>
}

export class ClientDao implements ClientDAO{

    private client = new CosmosClient ('AccountEndpoint=https://banking-app.documents.azure.com:443/;AccountKey=fNWIKUvIKwoxY5AKiu4EYPWGVkH7M6zyIynFfJxbacCiqKjHZLCikawR6uUn1hczBhs5T1EYMu0h34A6VIJdbQ==;');
    private database = this.client.database('bankingdb');
    private container = this.database.container ('Accounts');

    async createClient(client:Client) : Promise<Client>{
        const response = await this.container.items.create(client); //waiting until new client is created
        return response.resource;
    }

    async getAllClients(): Promise<Client[]> {
        const response= await this.container.items.readAll<Client>().fetchAll();
        return response.resources.map(i => ({id: i.id, fname:i.fname, lname:i.lname, accounts:i.accounts}));
        }
    
    async getAllAccountsByID(id: string): Promise<Account[]> {
        const client: Client = await this.getClientbyID(id);
        return client.accounts;
    }

    async getClientbyID(id:string): Promise<Client> {
        const client = await this.getAllClients();
        const clientByID: Client = client.find(a => a.id === id);
        return clientByID;
    }

    async updateClient(client:Client): Promise<Client> {
        const response = await this.container.items.upsert<Client>(client);
        return response.resource
    }

    async deleteClientById(id: string): Promise<boolean> {
        const client = await this.getClientbyID(id);
        const response = await this.container.item(id,id).delete();
        return true;
    }
    }
    
    export const clientdaoazure = new ClientDao();



