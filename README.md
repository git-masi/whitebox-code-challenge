# Whitebox code challenge

### Eric Masi, October 2021

## Run the code

To run the code simply run `npm start` in your terminal

**IMPORTANT NOTE:** The code creates an output.xlsx file in the project directory. If one already exists it will be deleted before a new one is created.

## Init a new database

**IMPORTANT NOTE:** These steps are not production ready.

To initialize the database please make sure that you have Docker installed. These steps assume you are using a Mac (other operating systems may differ).

Initialize the database with the following command in your terminal:

`docker run --name whitebox-code-challenge-database -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password123 mysql`

To seed the database using a data.sql.gz file, open a new terminal window/tab and complete the following steps.
PATH_TO_YOUR_DATA_FILE

First unzip the file

`gunzip /Users/emasi/Documents/misc/code-challenge-excel-master/data.sql.gz`

Then create the database by executing the following commands one at a time

`docker exec -it whitebox-code-challenge-database bash`

`mysql -uroot -ppassword123`

`create database code_challenge;`

Exit the mysql cli

`exit`

Exit the Docker bash cli

`exit`

Run the SQL file

```
cat /Users/emasi/Documents/misc/code-challenge-excel-master/data.sql | docker exec -i whitebox-code-challenge-database \
 /usr/bin/mysql -u root \
 -ppassword123 code_challenge
```

## Using your own database instance

If you have your own database instance you'd like to connect to, update the variables in the .env file.

**IMPORTANT NOTE:** You should not save database user/password as plain text in a .env file and git commit in a production application
