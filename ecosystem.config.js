module.exports = {
    apps: [
        {
            name: "client",
            script: "npm run frontend",
            
            env: {
                "PORT": 3000,
                "NODE_ENV": "development"
            },
           
            env_production: {
                "PORT": 80,
                "NODE_ENV": "production"
            }
        },{
            name      : "server",
            script    : "npm run backend",
            
            env: {
                "PORT": 5000,
                "NODE_ENV": "development"
            },
        
            env_production: {
                "PORT": 5000,
                "NODE_ENV": "production"
            }
        }
    ]
};