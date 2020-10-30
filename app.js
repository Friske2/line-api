import express from 'express';
import bodyParser from 'body-parser'
import request from 'request'
const app = express();
const PORT = process.env.PORT || 3000;
const access_token = `rCzdtQar2QHfxY0WihWLJFlrJIY+EH5r9ItdktsFQec0PHfCn/1xG7iHGeMTSR12gABvgSamQ/ajAaj2K1nMRNe+ryd4Bv2FvqtEMLa/byUITkoXDYv2yWxABq3uOHmZwwSIAkAej7Khv3PnxnZBMwdB04t89/1O/w1cDnyilFU=`
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/webhook', (req, res) => {
  let reply_token = req.body.events[0].replyToken
  let msg = req.body.events[0].message.text
  reply(reply_token,msg)
  res.sendStatus(200)
})
app.use("*", (req, res) => {
     let text = "Hello world";
     return res.send(text);
})
app.listen(PORT,() => {
  console.log(`server start port ${PORT}`);
})

function reply(reply_token,msg) {
  if(msg === '#checkin') {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer {${access_token}}`
    }
    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
          type: 'text',
          text: msg
        }
        ]
    })
    let formValue = new FormData()
    formValue.append('actionstate','checkin')
    formValue.append('employee','checkin')
    formValue.append('in_time','')
    formValue.append('latitude','13.7456517')
    formValue.append('longitude','100.5408732')
    request.post({
      url:'https://hr-terrabit-uat.demo1.webcontrol.com/app/branch1/api.php',
      body: formValue
    }, (err,res,body)=> {
      try {
        request.post({
            url: 'https://api.line.me/v2/bot/message/reply',
            headers: headers,
            body: res
        }, (err, res, body) => {
          try {
            console.log(res,body,err)
          } catch (err) {
            console.err
          }
            console.log('status = ' + res.statusCode);
        });
      } catch (error) {
        request.post({
          url: 'https://api.line.me/v2/bot/message/reply',
          headers: headers,
          body: error
        }, (err, res, body) => {
          try {
            console.log(res,body,err)
          } catch (err) {
            console.err
          }
            console.log('status = ' + res.statusCode);
        });
      }
    })
  }
}