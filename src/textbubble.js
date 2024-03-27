import startApp from './bubble.js';
import {loading} from './init.js';

(async () =>{
    await loading()
    startApp()
}) ()