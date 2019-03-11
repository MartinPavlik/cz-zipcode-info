const { pipe, uniqBy, map, join, keys, prop } = require('ramda');
const parsedData = require('./index');

const asString = v => v ? `'${v}'` : 'null';
const asNumber = v => v || 'null';

const escapeFnByKey = {
  id: asNumber,
  zipcode: asNumber,
  city: asString,
  district: asString,
  selfGoverningRegion: asString,
  region: asString,
  country: asString,
};

const sql = pipe(
  uniqBy(prop('zipcode')),
  map(zipcodeInfo =>
    pipe(
      keys,
      map(k => escapeFnByKey[k](zipcodeInfo[k])),
      join(', '),
      res => `(${res})`,
    )(escapeFnByKey),
  ),
  join(', \n'),
  newRows =>
    `
INSERT INTO
\`zipcode_info\` (${
  pipe(
    keys,
    map(asString),
    join(', ')
  )(escapeFnByKey)
})
VALUES
${newRows}
;
    `
)(parsedData);

console.log(sql);