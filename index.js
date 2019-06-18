const express = require('express')
const app = express()
const port = 3000
const azure = require('azure-storage');

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/pingpong/status', (req, res) => 
{
    const storageAccountName = "nallehw";
    const primaryKey = "YmJVrE8p+8LBc9p3mHRs5AhhCrCjTU/JXDCZEpPFKYtuQY7Wpfeshp/lTo3yoSmDfrufm9pj4NIjVeFhUJ42Hw==";

    var tableSvc = azure.createTableService(storageAccountName, primaryKey);
    
    var query = new azure.TableQuery()
        .top(5)
        .where('PartitionKey eq ?', 'raspiMaru');

    tableSvc.queryEntities('EventsLog', query, null, function(error, result, response){
        let isAvailable = true;
        if(!error){
            const values = response.body.value;
            values.forEach(element => {
                if (element.Activity == 1){
                    isAvailable = false;
                }
            });
            return res.send(isAvailable ? "Available" : "Unavailable"); 
        }
      });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))