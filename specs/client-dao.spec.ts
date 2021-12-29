import Account from "../account";
import Client from "../client";
import ClientDAO, { ClientDao } from "../daos/client-dao";
import {clientdaoazure} from "../daos/client-dao";

describe('DAO Specs', ()=>{

    const clientDao: ClientDAO = clientdaoazure;
    let savedClient:Client = null;
    let savedAccount:Client = null;

    it('should list all clients', async ()=>{
        const client: Client = {fname:"Kourtney", lname:"Kardashian", id:"", accounts:[{acctname:'Vegas', balance:5000}]}
        savedClient = await clientDao.createClient(client);
    })

    it('Should get a client by ID', async ()=>{
        const retreivedClient: Client = await clientDao.getClientbyID(savedClient.id);
        expect(retreivedClient.fname).toBe("Kourtney");
        expect(retreivedClient.lname).toBe("Kardashian");
    })

    // it("Should update a client", async () => {
    //     const updatedClient: Client = {fname:"North", lname:"West", id:"", accounts:[{acctname:"tiktok",balance:1000}]}
    //     await clientDao.updateClient(updatedClient);
    //     const retreivedClient: Client = await clientdaoazure.getClientbyID(updatedClient.id);
    //     expect(retreivedClient.fname).toBe("North");    
    // })

    it("Should get all clients", async () => {
        const retrievedClients: Client[] = await clientDao.getAllClients();
        expect(retrievedClients).toBeDefined;
    })

    it("Should add a client", async () => {
        const client: Client = {fname:"Kanye", lname:"West", id:"", accounts:[{acctname:"Paris", balance:400}]}
        savedClient = await clientDao.createClient(client);
        expect (savedClient.id).not.toBeFalsy();
    })

    it("should get all accounts by ID", async () => {
        const retrievedAccounts: Account[] = await clientdaoazure.getAllAccountsByID(savedClient.id);
        expect(retrievedAccounts).toBeDefined;
    })

   it("should delete a client", async() =>{
       await clientDao.deleteClientById(savedClient.id)
       expect(async()=>{
           await clientDao.getClientbyID(savedClient.id)
       }).toBeDefined;
   })
})