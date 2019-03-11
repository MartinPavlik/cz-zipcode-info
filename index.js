const data = require('./data');
const {
  compose,
  equals,
  filter,
  identity,
  isEmpty,
  join,
  keys,
  map,
  match,
  merge,
  not,
  pipe,
  prop,
  reduce,
  split,
  tap,
  uniqBy,
} = require('ramda');

const districtsByRegion = {
  'Hlavní město Praha': [
    'Hlavní město Praha',
  ],
  'Středočeský': [
    'Benešov',
    'Beroun',
    'Kladno',
    'Kolín',
    'Kutná Hora',
    'Mělník',
    'Mladá Boleslav',
    'Nymburk',
    'Praha-východ',
    'Praha-západ',
    'Příbram',
    'Rakovník',
  ],
  'Jihočeský': [
    'České Budějovice',
    'Český Krumlov',
    'Jindřichův Hradec',
    'Písek',
    'Prachatice',
    'Strakonice',
    'Tábor',
  ],
  'Plzeňský': [
    'Domažlice',
    'Klatovy',
    'Plzeň-jih',
    'Plzeň-město',
    'Plzeň-sever',
    'Rokycany',
    'Tachov',
  ],
  'Karlovarský': [
    'Cheb',
    'Karlovy Vary',
    'Sokolov',
  ],
  'Ústecký': [
    'Děčín',
    'Chomutov',
    'Litoměřice',
    'Louny',
    'Most',
    'Teplice',
    'Ústí nad Labem',
  ],
  'Liberecký': [
    'Česká Lípa',
    'Jablonec nad Nisou',
    'Liberec',
    'Semily',
  ],
  'Královéhradecký': [
    'Hradec Králové',
    'Jičín',
    'Náchod',
    'Rychnov nad Kněžnou',
    'Trutnov',
  ],
  'Pardubický': [
    'Chrudim',
    'Pardubice',
    'Svitavy',
    'Ústí nad Orlicí',
  ],
  'Vysočina': [
    'Havlíčkův Brod',
    'Jihlava',
    'Pelhřimov',
    'Třebíč',
    'Žďár nad Sázavou',
  ],
  'Jihomoravský': [
    'Blansko',
    'Brno-město',
    'Brno-venkov',
    'Břeclav',
    'Hodonín',
    'Vyškov',
    'Znojmo',
  ],
  'Olomoucký': [
    'Jeseník',
    'Olomouc',
    'Prostějov',
    'Přerov',
    'Šumperk',
  ],
  'Moravskoslezský': [
    'Bruntál',
    'Frýdek-Místek',
    'Karviná',
    'Nový Jičín',
    'Opava',
    'Ostrava-město',
  ],
  'Zlínský': [
    'Kroměříž',
    'Uherské Hradiště',
    'Vsetín',
    'Zlín',
  ]
};


const regionByDistrict = pipe(
  keys,
  reduce(
    (a, region) => {
      const districts = districtsByRegion[region];
      const districtsInThisRegion = reduce(
        (b, district) => (merge(b, { [district]: region })),
        {},
        districts,
      );

      return merge(a, districtsInThisRegion);
    },
    {},
  ),
)(districtsByRegion);

const matchDataLine = match(/\((\d+), '(\d+)', '([^']*)', '([^']*)', '([^']*)', '([^']*)'\)(;|,)/);

const parsedData = pipe(
  split('\n'),
  map(matchDataLine),
  filter(compose(not, isEmpty)),
  map(([line, _id, _zipcode, city, district, region, country]) => {
    const id = parseInt(_id, 10);
    const zipcode = parseInt(_zipcode, 10);
    const selfGoverningRegion = regionByDistrict[district];
    return {
      id,
      zipcode,
      city,
      district,
      selfGoverningRegion,
      region,
      country,
    };
  }),
  filter(compose(equals('CZ'), prop('country'))),
)(data);

module.exports = parsedData;