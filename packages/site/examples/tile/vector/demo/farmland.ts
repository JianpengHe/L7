// @ts-ignore
import {
  Scene,
  Source,
  PolygonLayer,
  RasterLayer,
  LineLayer,
  PointLayer,
} from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
 
  map: new Map({
    center: [-95.7548387434569, 44.82687715672517],
    zoom: 9,
  }),
});

const url1 =
  'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.webp?sku=101ifSAcKcVFs&access_token=pk.eyJ1IjoidW5mb2xkZWRpbmMiLCJhIjoiY2s5ZG90MjMzMDV6eDNkbnh2cDJvbHl4NyJ9.BT2LAvHi31vNNEplsgxucQ';
const layer1 = new RasterLayer({
  zIndex: 1,
}).source(url1, {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
  },
});

const source = new Source(
  'https://cdn.unfolded.ai/indigo/hexify_v5/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      tileSize: 256,
      // minZoom: 9,
    },
  },
);

const layer = new LineLayer({
  featureId: 'id',
  zIndex: 3,
  minZoom: 9,
  sourceLayer: 'state_s10_27', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(source)
  .shape('simple')
  .color('#000')
  .size(0.3)
  .style({
    opacity: 1,
  });

const layer2 = new PolygonLayer({
  featureId: 'id',
  zIndex: 2,
  minZoom: 9,
  sourceLayer: 'state_s10_27', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(source)
  .shape('fill')
  .scale('croptype', {
    type: 'quantize',
    domain: [0, 4],
  })
  .color('croptype', [
    '#C1C9CC',
    '#DFB02F',
    '#7F8120',
    '#DCD0A4',
    '#AD5633',
  ])
  .style({
    opacity: 1,
  });

const layer3 = new PointLayer({
  featureId: 'id',
  zIndex: 2,
  maxZoom: 9,
  mask: true,
  sourceLayer: 'parcel_pointgeojsonl', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(source)
  .shape('hexagon')
  .size(2)
  .scale('croptype', {
    type: 'quantize',
    domain: [0, 4],
  })
  .color('croptype', [
    '#C1C9CC',
    '#DFB02F',
    '#7F8120',
    '#DCD0A4',
    '#AD5633',
  ])
  .style({
    opacity: 1,
  });

scene.on('loaded', () => {
  scene.addLayer(layer);
  scene.addLayer(layer1);
  scene.addLayer(layer2);
  scene.addLayer(layer3);
});
