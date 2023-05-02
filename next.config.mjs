// @ts-check
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

export default withVanillaExtract({});
