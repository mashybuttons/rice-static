# Rice
> Rice provides intelligently customized recommendations for you and your friends.

## Table of Contents
2. [Getting started](#Getting-Started)
  1. Clone the latest version
  2. Install Dependencies
  3. Setup Environment Variables
  4. Start the application
3. [Architecture](#Architecture)
  1. [System Diagram] (#system)
  2. [Directory Layout] (#directory)
4. [API Endpoints](#Endpoint)
  1. [Business Service Endpoints] (#business)
  2. [Users Service Endpoints] (#users)
5. [Technologies] (#Technologies)
6. [Team] (#Team)
6. [Contributing] (#Contributing)


## <a id="Getting-Started"></a> Getting Started
#### 1. Clone the latest version

  Start by cloning the latest version of Rice on your local machine by running:

  ```sh
  $ git clone https://github.com/dadamaka/rice
  $ cd rice
  ```
  
#### 2. Install Dependencies
  From within the root/static directory run the following command to install all dependencies:

  ```sh
  $ npm install
  ```

#### 3. Run the application

1. Start the server by running the following command from the root directory:

    ```sh
    $ npm start
    ```
2. Your server is now live at ```http://localhost:3000```
        
## <a id="Architecture"></a>Architecture

### <a id="system"></a>System Diagram
![alt text] (https://cloud.githubusercontent.com/assets/8594433/16996630/fe4151b8-4e66-11e6-987b-b75a767f6d35.png "Rice System Architecture")

### <a id="directory"></a>Directory Layout
```
└── static
    ├── client
    │   ├── assets
    │   ├── fonts
    │   ├── public
    │   ├── src
    │   │   ├── components
    │   │   ├── containers
    │   │   ├── layouts
    │   │   ├── modules
    │   │   │   ├── Friend-View
    │   │   │   ├── Group-View
    │   │   │   ├── Home-View
    │   │   │   ├── Landing-View
    │   │   │   ├── Pref-View
    │   │   │   ├── Ratings-View
    │   │   │   ├── Restaurant-View
    │   │   │   └── SignIn-View
    │   │   ├── redux
    │   │   └── utils
    │   └── styles
    ├── node_modules
    ├── public
    │   └── externals
    │       └── apiGateway-js-sdk
    └── server
       └── server.js

```

## <a id="Endpoint"></a>API Endpoints
### <a id="business"></a>[Business Service Endpoints] (https://github.com/dadamaka/rice-business)
- `GET` /api/business/info  
- `GET` /api/business/review  
- `POST` /api/business/review  
- `GET` /api/business/detail  
- `POST` /api/business/yelp  

### <a id="users"></a>[Users Service Endpoints] (https://github.com/dadamaka/rice-users)

- `GET` /api/users/users
- `POST` /api/users/user
- `POST` /api/users/user/update
- `POST` /api/users/friends
- `POST` /api/users/friends/new  
- `POST` /api/users/preferences  
- `POST` /api/users/preferences/update
- `POST` /api/users/group/preferences

## <a id="Technologies"></a>Technologies

##### Authentication:
- Auth0
- AWS API Gateway
- AWS IAM
- AWS SDK
- SAML

##### Front End:
- Axios
- React Redux
- React Router
- Webpack

##### Styling:
- Bootstrap CSS
- SASS

##### Back end:
- Node.js
- Express
- AWS Lambda

##### Database:
- Bookshelf/Knex
- MySQL

##### Testing:
- Mocha
- Chai

##### Deployment:
- AWS EC2
- AWS RDS
- Docker
- Heroku

##### API:
- Yelp
- Google Maps

##### Microservices:
- Rice-Business
- Rice-Users
- Rice-Recommendations
- Notifcations

## <a id="Team"></a>Team
[Dan Conger] (https://github.com/dconger)  
[Dan Fiore] (https://github.com/taptapdan)  
[Katherine Hao] (https://github.com/mashybuttons)  
[Matt Naing] (https://github.com/mattgrisanu)

## <a id="Contributing"></a>Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.


