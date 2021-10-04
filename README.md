# DHT11 Firebase

This is for ESP32 DHT11 POST Data to Heroku Server and FireBase(Data Base)

## console

```
> npm install express --save
> npm install firebase-admin --save
> npm install body-parser --save
```

## dht11firebase.js

### Link

* [class Firestore]("#class-firestore")
* [serviceAccountKey.json](#serviceaccountkeyjson)
* [async checkIdPasswd(ckeckIdPasswdData)](#async-checkidpasswdckeckidpasswddata)
* [async getDHT11Data(dateData)](#async-getdht11datadatedata)
* [async setDHT11Data(DHT11Data)](#async-setdht11datadht11data)

### class Firestore

```js
constructor(serviceAccount) {
    const admin = require("firebase-admin");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    this.db     = admin.firestore();
}
```
#### serviceAccountKey.json

```json
{
    "type": "service_account",
    "project_id": "tXXt-7XXX6",
    "private_key_id": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "private_key": "-----BEGIN PRIVATE KEY-----\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-7pgpu@XXXXXXXXXXXXXXX.iam.gserviceaccount.com",
    "client_id": "000000000000000000000000000",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.iam.gserviceaccount.com"
  }
```


### async checkIdPasswd(ckeckIdPasswdData)

```js
async checkIdPasswd(ckeckIdPasswdData) {
    let _json;

    try {
        _json = {
            Name:   ckeckIdPasswdData["Name"],
            Id:     ckeckIdPasswdData["Id"],
            Passwd: ckeckIdPasswdData["Passwd"],
        };

        if(_json.Name !== "checkIdPasswd")
            return getReturnData("CHECK_ID_PASSWD", "ERROR", "JSON_NAME_ERROR");
    } catch(e) {
        return getReturnData("CHECK_ID_PASSWD", "ERROR", "JSON_ERROR");
    }

    try {
        const snapshot  = await this.db.collection('Users').where('Id', '==', _json.Id).where('Passwd', '==', _json.Passwd).get();

        if(snapshot.empty)
            return getReturnData("CHECK_ID_PASSWD", "ERROR", "ID_OR_PASSWD_ERROR");

        let returnData = getReturnData("CHECK_ID_PASSWD", "OK", NaN);
        snapshot.forEach(doc => {
            returnData["Key"] = doc.id;
        });
        return returnData;

    } catch(e) {
        return getReturnData("CHECK_ID_PASSWD", "ERROR", "DATABASE_WHERE_ERROR");
    }
}
```
#### Client Json

```json
{
    "Name":   "checkIdPasswd",
    "Id":     "<Enter your ID>",
    "Passwd": "<Enter your Password>"
}
```

#### Server Json

Type -> OK

```json
{
    "Name":  "checkIdPasswd",
    "Type":  "OK",
    "Error":  null,
    "Key":   "XXXXXXXXXXXXXX"
}
```

Type -> Error

```json
{
    "Name":  "checkIdPasswd",
    "Type":  "ERROR",
    "Error": "<Error Code>",
}
```

* JSON_NAME_ERROR
* JSON_ERROR
* ID_OR_PASSWD_ERROR
* DATABASE_WHERE_ERROR

### async getDHT11Data(dateData)

```js
async getDHT11Data(dateData) {
    let _json;

    try {
        let date  = new Date(dateData["Year"], dateData["Month"], dateData["Day"], dateData["Hour"]);
        _json = {
            Name:   dateData["Name"],
            Date:   date.getTime(),
        }

        if(_json.Name !== "getDHT11Data")
            return getReturnData("GET_TEMP_HUM", "ERROR", "JSON_NAME_ERROR");

    } catch(e) {
        return getReturnData("GET_TEMP_HUM", "ERROR", "JSON_ERROR");
    }

    try {
        const cityRef = this.db.collection("DHT11").doc(_json.Date.toString());
        const doc = await cityRef.get();

        if (!doc.exists)
            return getReturnData("GET_TEMP_HUM", "ERROR", "DATABASE_NOTFOUND_DATA_ERROR");

        
        let data = getReturnData("GET_TEMP_HUM", "OK", NaN);
        data["Data"]    = doc.data()
        return data;
        
    } catch(e) {
        return getReturnData("GET_TEMP_HUM", "ERROR", "DATABASE_GET_DATA_ERROR");
    }

}
```

#### Client Json

```json
{
    "Name":  "getDHT11Data",
    "Year":  "<Enter Year>",
    "Month": "<Enter Month>",
    "Day":   "<Enter Day>",
    "Hour":  "<Enter Hour>"
}
```

#### Server Json

Type -> OK

```json
{
    "Name":  "checkIdPasswd",
    "Type":  "OK",
    "Error":  null,
    "Data": {
        "Date":  1635523200000,
        "0": {
            "Temp": [20, 20, 20, 20, 20,20],
            "Hun":  [50, 50, 50, 50, 50,50],
        },
        "1": {
            "Temp": [20, 20, 20, 20, 20,20],
            "Hun":  [50, 50, 50, 50, 50,50],
        },
        .
        .
        .
    }
}
```

Type -> Error

```json
{
    "Name":  "GET_TEMP_HUM",
    "Type":  "ERROR",
    "Error": "<Error Code>",
}
```

* JSON_NAME_ERROR
* JSON_ERROR
* DATABASE_NOTFOUND_DATA_ERROR
* DATABASE_GET_DATA_ERROR

### async setDHT11Data(DHT11Data)

```js
async setDHT11Data(DHT11Data) {
    let _json;

    try {
        let date  = new Date(DHT11Data["Year"], DHT11Data["Month"], DHT11Data["Day"], DHT11Data["Hour"]);
        _json = {
            Name: DHT11Data["Name"],
            Date: date.getTime(),
            Min:  DHT11Data["Min"],
            Temp: DHT11Data["Temp"],
            Hum:  DHT11Data["Hum"]
        }

        if(_json.Name !== "setDHT11Data")
            return getReturnData("SET_DHT11", "ERROR", "JSON_NAME_ERROR");

    } catch(e) {
        return getReturnData("SET_DHT11", "ERROR", "JSON_ERROR");
    }

    try {
        let firebaseData = {}
        firebaseData[_json.Min.toString()] = {
            Temp: _json.Temp,
            Hum:  _json.Hum,
        };

        const myDoc = this.db.collection("DHT11").doc(_json.Date.toString());
        const doc = await myDoc.get();

        if (!doc.exists) {
            await myDoc.set({Date: _json.Date});
        }

        await myDoc.update(firebaseData);

    } catch(e) {
        return getReturnData("SET_DHT11", "ERROR", "DATABASE_SAVE_DATA_ERROR");
    }

    return getReturnData("SET_DHT11", "OK", NaN);
}
```

#### Client Json

```json
{
    "Name":  "setDHT11Data",
    "Year":  "<Enter Year>",
    "Month": "<Enter Month>",
    "Day":   "<Enter Day>",
    "Hour":  "<Enter Hour>",
    "Min":   "<Enter Min>",
    "Temp":  [20, 20, 20, 20, 20,20],
    "Hun":   [50, 50, 50, 50, 50,50],
}
```

#### Server Json

Type -> OK

```json
{
    "Name": "checkIdPasswd",
    "Type": "OK",
    "Error": null,
}
```

Type -> Error

```json
{
    "Name":  "SET_DHT11",
    "Type":  "ERROR",
    "Error": "<Error Code>",
}
```

* JSON_NAME_ERROR
* JSON_ERROR
* DATABASE_SAVE_DATA_ERROR