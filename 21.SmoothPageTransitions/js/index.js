// import test from "./test";

// const run = () => {
//     console.log("Yo i am runnin");
// };

// test();

import Highway from '@dogstudio/highway';
import Fade from './transition';

const H = new Highway.Core({
    transitions: {
        default: Fade
    }
});
