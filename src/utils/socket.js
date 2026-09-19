import socket from "socket.io-client";
import {BASE_URL} from "./constants.js";

const createSocketConnection= ()=>{
return(socket(BASE_URL));
}
export default createSocketConnection;