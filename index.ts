import Express from "express";
import ClientDAO, { ClientDao } from "./daos/client-dao";
import Account from "./account";
import Client from "./client";
import { ClientServicesImp, ClientServices } from "./Services/account-services";
import {clientdaoazure} from "./daos/client-dao";
import { StatusCodes } from "@azure/cosmos";


const app = Express();
app.use(Express.json());

const clientservice: ClientServices = new ClientServicesImp(clientdaoazure);

//GET /clients => gets all clients
app.get('/clients', async (req, res) => {
        const clients: Client[] = await clientdaoazure.getAllClients();
        res.status(200);
        res.send(clients);
})

//GET /clients/10 => get client with id of 10, return 404 if no such client exist
app.get('/clients/:id', async (req, res) =>{
    try{
         const client: Client = await clientdaoazure.getClientbyID(req.params.id);
         res.send (client);
     }
     catch(error:any){
            res.status(404);
            res.send("404: Client not found");
        }
     }
     )

//POST creates new account for client with id
app.post('/clients/:id/accounts', async(req,res)=>{
    const newacct: Account = req.body
    let id = req.params.id;
    await clientservice.addAccounttoClient(req.params.id, newacct)
    res.status(201)  
    res.send("New account created for id " + id);
})

//POST Creates new client
app.post('/clients', async (req, res)=>{

        let newclient: Client = req.body;
        newclient = await clientdaoazure.createClient(newclient);
        res.status(201);
        res.send("Client created!");
})

//GET /clients/7/accounts => get all accounts for client 7, return 404 if no client exists
app.get('/clients/:id/accounts', async (req, res)=>{
    try {
        let account: Account = req.body
        let accounts = await clientservice.getallAccounts(req.params.id);
        res.send(accounts);
    } catch (error:any) {
        res.status(404);
        res.send("Client not found");
    }
})

//DELETE /clients/15 => deletes client with the id of 15, return 404 if no such client exist, return 205 if success
app.delete ('/clients/:id', async (req,res)=>{
    try{
        const deletedAssociate: boolean = await clientdaoazure.deleteClientById(req.params.id)
        res.status(205);
        res.send("Client Deleted");
    }
    catch(error:any){
        res.status(404);
        res.send("Client not found");
}
})

// // //PUT /clients/12 => updates client with id of 12, return 404 if no such client exist
//**TO KEEP ACCT INFO** getclient by id first, get the accounts, and then assign those accounts to the new client
app.put('/clients/:id', async (req,res)=>{
    const client: Client = await clientdaoazure.getClientbyID(req.params.id)
    if (client.id === req.params.id){
        let newclient: Client[] = req.body;
        await clientdaoazure.updateClient(newclient);
        res.send(newclient);
    }
    else{
        res.status(404);
        res.send("Client not found");
        }
    })

// //PATCH /clients/7/accounts/checking/deposit => deposit given amount (Body {"amount":500} ), return 404 if no account exists
app.patch('/clients/:id/accounts/:acctname/deposit', async (req, res)=>{
        try{
            const amount = Number(req.body.amount);
        const client: Client = await clientdaoazure.getClientbyID(req.params.id);
        for(let i = 0; i< client.accounts.length; i++){
            if(client.accounts[i].acctname == req.params.acctname){
                client.accounts[i].balance += amount;
            }
        }
        clientdaoazure.updateClient(client);
        res.send(`${req.body.amount} dollars added to ${req.params.acctname}`)
        }
       catch{
           res.status(404);
           res.send("Client not found");
       }
})

// //PATCH /clients/7/accounts/vacationfund/withdraw => deposit given amount (Body {"amount":500} ), return 404 if no account exists, return 422 if insufficient funds
    app.patch('/clients/:id/accounts/:acctname/withdraw', async (req, res)=>{
        try{
            const amount = Number(req.body.amount);
        const client: Client = await clientdaoazure.getClientbyID(req.params.id);
        for(let i = 0; i< client.accounts.length; i++){
            if(client.accounts[i].acctname == req.params.acctname){
                if(client.accounts[i].balance < amount){
                    res.status(422);
                    res.send("Insufficient Funds");
                }
                else{
                client.accounts[i].balance -= amount;
                }
            }
        }
        clientdaoazure.updateClient(client);
        res.send(`${req.body.amount} dollars withdrawn from ${req.params.acctname}`)
        }
       catch{
           res.status(404);
           res.send("Client not found");
       }
})


// //GET /clients/7/accounts?amountLessThan=2000&amountGreaterThan400 => get all accounts between 400 and 2000 for client 7
app.get('/clients/:id/accounts', async (req, res)=>{
    try{
        let query = require('url').parse(req.url,true).query;
        const {id} = req.params;
        const amountLessThan: number = query.amountLessThan;
        const amountGreaterThan: number = query.amountGreaterThan;
        const accounts: Account[] = await clientservice.getallAccounts(id);
        for(let i = 0; i<accounts.length;i++){
            if((accounts[i].balance) < amountLessThan && (accounts[i].balance) > amountGreaterThan){
                res.send(accounts[i]);
            }
        }
        res.send(accounts);
    }
    catch(error:any){
        res.status(404);
        res.send("Client not found")
    }
})

app.listen(3000, () => console.log('App started'))






