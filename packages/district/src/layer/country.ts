import {
  ILayer,
  LineLayer,
  PointLayer,
  PolygonLayer,
  Scene,
  StyleAttrField,
} from '@antv/l7';
import { DataConfig } from '../config';
import BaseLayer from './baseLayer';
import { IDistrictLayerOption } from './interface';

export default class CountryLayer extends BaseLayer {
  constructor(scene: Scene, option: Partial<IDistrictLayerOption> = {}) {
    super(scene, option);
    const { depth } = this.options;
    this.loadData().then(([fillData, fillLabel]) => {
      this.addFillLayer(fillData);
      if (fillLabel && this.options.label?.enable) {
        this.addLabelLayer(fillLabel);
      }
    });
    const countryConfig = DataConfig.country.CHN[depth];

    this.addProvinceLine(countryConfig.provinceLine);

    if (depth === 2 * 1) {
      this.addCityBorder(countryConfig.cityLine);
    }
    if (depth === 3 * 1) {
      this.addCountryBorder(countryConfig.countryLine);
    }
  }
  // 国界,省界
  protected async addProvinceLine(cfg: any) {
    const lineData = await this.fetchData(cfg);
    const border1 = lineData.features.filter((feature: any) => {
      const type = feature.properties.type;
      return type === '1' || type === '4';
    });
    const borderFc = {
      type: 'FeatureCollection',
      features: border1,
    };
    const nationalBorder = lineData.features.filter((feature: any) => {
      const type = feature.properties.type;
      return type !== '1' && type !== '4';
    });
    const nationalFc = {
      type: 'FeatureCollection',
      features: nationalBorder,
    };
    this.addNationBorder(nationalFc, borderFc);
  }

  // 国界,省界
  protected addFillLine(lineData: any) {
    const border1 = lineData.features.filter((feature: any) => {
      const type = feature.properties.type;
      return type === '1' || type === '4';
    });
    const borderFc = {
      type: 'FeatureCollection',
      features: border1,
    };
    const nationalBorder = lineData.features.filter((feature: any) => {
      const type = feature.properties.type;
      return type !== '1' && type !== '4';
    });
    const nationalFc = {
      type: 'FeatureCollection',
      features: nationalBorder,
    };
    this.addNationBorder(nationalFc, borderFc);
  }

  private async loadData() {
    const { depth } = this.options;
    const countryConfig = DataConfig.country.CHN[depth];
    const fillData = await this.fetchData(countryConfig.fill);
    const fillLabel = countryConfig.label
      ? await this.fetchData(countryConfig.label)
      : null;
    return [fillData, fillLabel];
  }
  // 省级行政区划
  private async addNationBorder(boundaries: any, boundaries2: any) {
    const {
      nationalStroke,
      nationalWidth,
      coastlineStroke,
      coastlineWidth,
      stroke,
      strokeWidth,
      zIndex,
    } = this.options;
    // 添加国界线
    const lineLayer = new LineLayer({
      zIndex: zIndex + 1,
    })
      .source(boundaries)
      .size('type', (v: string) => {
        if (v === '3') {
          return strokeWidth;
        } else if (v === '2') {
          return coastlineWidth;
        } else if (v === '0') {
          return nationalWidth;
        } else {
          return '#fff';
        }
      })
      .shape('line')
      .color('type', (v: string) => {
        if (v === '3') {
          return stroke;
        } else if (v === '2') {
          return coastlineStroke;
        } else if (v === '0') {
          return nationalStroke;
        } else {
          return '#fff';
        }
      });
    // 添加未定国界
    const lineLayer2 = new LineLayer({
      zIndex: zIndex + 1,
    })
      .source(boundaries2)
      .size(nationalWidth)
      .shape('line')
      .color('gray')
      .style({
        lineType: 'dash',
        dashArray: [2, 2],
      });

    this.scene.addLayer(lineLayer);
    this.scene.addLayer(lineLayer2);
    this.layers.push(lineLayer, lineLayer2);
  }
  // 省级边界
  private async addCityBorder(cfg: any) {
    const border1 = await this.fetchData(cfg);
    const { cityStroke, cityStrokeWidth } = this.options;
    const cityline = new LineLayer({
      zIndex: 2,
    })
      .source(border1)
      .color(cityStroke)
      .size(cityStrokeWidth)
      .style({
        opacity: 0.5,
      });
    this.scene.addLayer(cityline);
    this.layers.push(cityline);
  }

  // 县级边界
  private async addCountryBorder(cfg: any) {
    // const bordConfig = DataConfig.country.CHN[3];
    const border1 = await this.fetchData(cfg);
    const { countyStrokeWidth, countyStroke } = this.options;
    const cityline = new LineLayer({
      zIndex: 2,
    })
      .source(border1)
      .color(countyStroke)
      .size(countyStrokeWidth)
      .style({
        opacity: 0.5,
      });
    this.scene.addLayer(cityline);
    this.layers.push(cityline);
  }
}
