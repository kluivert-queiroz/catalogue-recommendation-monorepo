const { TextEncoder, TextDecoder } = require('util');
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

jest.mock('@xenova/transformers', jest.fn());
