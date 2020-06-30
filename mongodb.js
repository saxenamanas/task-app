const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-app';

MongoClient.connect(connectionURL,{
    useNewUrlParser: true
},(error,client)=>{
    if(error){
        return console.log('Unable to connect');
    }

    console.log('Client Connected!');
    const db = client.db(databaseName);
    const updatePromise = db.collection('users').deleteMany({
        check:false
    });

    updatePromise.then((result)=>{
        console.log(result);
    }).catch((error)=>{
        console.log(error);
    });
});