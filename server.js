import express from "express";
import bodyParser from "body-parser";
import pkg from 'pg';


// Imports For Static Files Path
import {dirname} from "path";
import { fileURLToPath } from "url";
import path from 'path';


const { Pool } = pkg;
const app = express();
const port = 23000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "Public")));

app.use(express.static(path.join(__dirname, "views")));

// Set EJS as templating engine
app.set('view engine', 'ejs');

const pool = new Pool({
  user : "postgres",
  host : "localhost",
  database : "HomeHarmony System",
  password: "Password10",
  port: 24000,
  max: 20, // set pool max size to 20
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500 // close (and replace) a connection after it has been used 7500 times 
});


app.get("/Landing_Page", async (req, res) => {
  res.render("Landing_Page");
});


app.get("/Employer_Page", async (req, res) => {
  res.render("Employer_Page");
});

app.get("/employer_Profile", async (req, res) => {
  res.render("employer_Profile");
});



//Recieves input of the Register-form from the client JS file and not directly via the post submit button
app.post("/sign_up", async (req,res) =>{
          // req.body["current-password"];
          let fname = req.body.firstname.charAt(0).toUpperCase() + req.body.firstname.slice(1);
          console.log(fname);
          let lname = req.body.lastname.charAt(0).toUpperCase() + req.body.lastname.slice(1);
          console.log(lname);

          let email = req.body.register_user_email;
          console.log(email);

          let password = req.body.user_password;
          console.log(password);

          let usertype= req.body.user_type;
          console.log(usertype);

          if(usertype === "Employer"){
            pool.connect((err, client, release) => {
              if (err) {
                console.error('Error acquiring client', err.stack);
              } 
              else {
                const query = {
                 text:"insert into registration_employers (firstname,lastname,email,passwords) values($1, $2, $3, $4)",
                 values : [fname,lname,email,password]
                };
        

                client.query(query, (err, res) => {
                  if (err) {
                    console.error("(Post)-Error executing query", err.stack);
                    return res.json({ success: false, message: `Hey there ${fname}, this email address is already in use!` });
                    
                  } else {
                    // countries = res.rows;
                    console.log("Sent to the DB successfully");
                  }
                  release(); // Return the client to the pool
                });
              }
            });
            return res.json({ success: true, message: `Hey ${fname} welcome into the HomeHarmony community 🥳🥳🥳` });
          }

          if(usertype === "employee"){
            pool.connect((err, client, release) => {
              if (err) {
                console.error('Error acquiring client', err.stack);
              } 
              else {
                const query = {
                 text:"insert into public.\"Registration_Employees\"  (firstname,lastname,email,passwords) values($1, $2, $3, $4)",
                 values : [fname,lname,email,password]
                };
        
                client.query(query, (err, res) => {
                  if (err) {
                    console.error("(Post)-Error executing query", err.stack);
                  } else {
                    // countries = res.rows;
                    console.log("Sent to the DB successfully");
                  }
                  release(); // Return the client to the pool
                });
              }
            });
            return res.json({ success: true, message: `Hey ${fname} welcome into the HomeHarmony community 🥳🥳🥳` });
          }
});

app.post('/sign_in', async (req, res) =>{
        let username = req.body.username;

        let password = req.body.password;

        console.log(username);
        console.log(password);

        pool.connect((err, client, release) => {
              if (err) {
                  console.error('Error acquiring client', err.stack);
                  return; // Exit if there's an error acquiring the client
              }
          
              const query1 = {   
                  text: "SELECT firstname,lastname,email, passwords FROM registration_employers WHERE email = $1 AND passwords = $2",
                  values: [username, password]
              };
          
              const query2 = {   
                  text: "SELECT firstname,lastname,email, passwords FROM public.\"Registration_Employees\" WHERE email = $1 AND passwords = $2",
                  values: [username, password]
              };
          
              // Execute the first query
              client.query(query1, (err, res1) => {
                  if (err) {
                      console.error("Error executing query1", err.stack);
                      release(); // Return the client to the pool
                      return; // Exit if there's an error
                  }
          
                  let response1 = res1.rows;
          
                  // Now execute the second query
                  client.query(query2, (err, res2) => {
                      if (err) {
                          console.error("Error executing query2", err.stack);
                      } else {
                          let response2 = res2.rows;
                          // Process both responses as needed
                          console.log('Response from the registered employers table:', response1);
                          console.log('Response from the registered employees table:', response2);


                         // Check if response1 has results
                        if (response1.length > 0 && response1[0].email === username) {
                            return res.json({ type: "employer",success: true, message: `Welcome ${response1[0].firstname} ${response1[0].lastname}!` });
                        }
                        // Check if response2 has results
                        else if (response2.length > 0 && response2[0].email === username) {
                            return res.json({type: "employee", success: true, message: `Welcome ${response2[0].firstname} ${response2[0].lastname}!` });
                        } else {
                            return res.json({ success: false, message: "Invalid credentials" });
                        }
                      }
                      release(); // Return the client to the pool after both queries
                  });
              });

        });
     
});

app.post("/post-job",async (req, res) =>{
  
});

  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
