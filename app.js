const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const fname = req.body.first_name;
    const lname = req.body.last_name;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const data_json = JSON.stringify(data);

    const url = `https://us8.api.mailchimp.com/3.0/lists/3309ebcaf4`;

    const options = {
        method: "POST",
        auth: "alessio1:2aff91ff332e58b8c0a47410a41e150e-us8"
    };

    const request = https.request(url, options, (response) => {
        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        }else{
            console.log(JSON.parse(response));
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(data_json);
    request.end();
});

app.post('/failure', (req, res) => {
    res.redirect('/');
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server attivo sulla porta 3000");
});

//2aff91ff332e58b8c0a47410a41e150e-us8
//3309ebcaf4