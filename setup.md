# setup the ui 
- create a vite+ react app
- removing the unrequired code
- install tailwind 
- git init 
- install the daisy ui and use the component things
- nav bar 
- routing 
- install react-router-dom for routing 
- create BrowserRouter > Routes > Route =/Body > RouteChildren
- create a footer 
- create a login page 
- install axios for making api calls
- handle the CORS error - install cors in backend => add middleware to with Configurations: origin , credentials:true
- whenever you're making API call so pass axios => { withCredentials: true}
- install react-redux + @reduxjs/toolkit - from redux toolkit website 
- configureStore => Provider=> createSlice => add recducer to store
- add redux devtools in chrome
- login and see if your data is coming properly in the store
- navbar should update as soon as user logs in 
- Refactor our code to add constants file + create a components folder 
- You should not be access other routes without login 
- if token is not present, redirect user to login page 
- logout 
- feed 
- profile
- showtoast message
- signup 



- BODY
  nav 
  Route = / => feed
  Route=/login => login
  Route =/connection => connection
  Route =/profile => profile
  

   # Deployment 
  - signup on AWS
  - Launch the instance (EC2 machine )
  - Modify permission - chmod 400 secret-key(filename).pem
  - connect with ssh command - ssh i ...
  