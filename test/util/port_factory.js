'use strict';

const BASE_PORT = 9225;
let port_index = 0;

module.exports = () => BASE_PORT + port_index++;