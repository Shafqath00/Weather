import express, { response } from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { render } from "ejs";

const app = express();
const port = 3000;
const API_KEY = "c6364156213459594897e986835c30c0";
const icon_url="https://openweathermap.org/img/wn/";
let wind,humidity,name,pressure,main,tem,test,location;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        res.render("index.ejs",{
            temp:tem,
            icon:test,
            wind:wind,
            humidity:humidity,
            pressure:pressure,
            name:name,
            main:main,
        });
    } catch (error) {
        console.log(error.response.data);
        res.status(500);
    }
});

app.post("/get-city", async (req, res) => {
    try {
        location = req.body.location;
        const result = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
            params: {
                q:location,
                appid: API_KEY,
                units:"metric",
            },
        });
        console.log(result.data.weather[0].icon);
        // wind speed colllection
        wind = result.data.wind.speed;
        // humidity collection
        humidity= result.data.main.humidity;
        // name od the city
        name=result.data.name;
        // pressure collection
        pressure= result.data.main.pressure;
        // weather type collection
        main =result.data.weather[0].main;

        console.log(wind,humidity,pressure,name,main);
        // icon url generated
        test = icon_url+result.data.weather[0].icon+"@2x.png";
        // temp collection
        tem = Math.round(result.data.main.temp);

        

        res.redirect("/");
    } catch (error) {
        //console a error
        console.log(error.response.data.message);

        res.status(500);
        //send a error message
        res.render("index.ejs",{er:error.response.data.message});
    }
})
app.listen(port, () => {
    console.log(`Server is running on ${port}...`);
})