import data from './brgy.json';

export default class AddressService {
  constructor() {
  }

  static getRegions() {
    var regions = [];

    regions = data.regions.map(function(o) {
                return o.name;
              });

    return regions;
  }

  static getProvincesByRegion(region) {
    var provinces = [];

    data.regions.forEach(function(o) {
      if(o.name == region) {
        provinces = o.provinces.map(function(o) { return o.name });
      }
    });

    return provinces;
  }

  static getCitiesByRegionAndProvince(region, province) {
    var cities  = [];

    data.regions.forEach(function(r) {
      if(r.name == region) {
        r.provinces.forEach(function(p) {
          if(p.name == province) {
            cities = p.cities.map(function(c) { return c.name });
          }
        });
      }
    });

    return cities;
  }

  static getDistrictsByRegionAndProvinceAndCity(region, province, city) {
    var districts = [];

    data.regions.forEach(function(r) {
      if(r.name == region) {
        r.provinces.forEach(function(p) {
          if(p.name == province) {
            p.cities.forEach(function(c) {
              if(c.name == city) {
                districts = c.districts.map(function(d) { return d });
              }
            });
          }
        });
      }
    })

    return districts;
  }
}
