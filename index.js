const rp = require('request-promise')

const apiUri = 'http://apis.data.go.kr/B500001/rwis/waterQuality/'
const uri = {
  waterQuality: 'list',
  facilityList: 'fcltylist/codelist',
  supplyLgldCodeList: 'supplyLgldCode/list'
}

module.exports = class KoreaLiveWaterworks {
  constructor ({ key }) {
    this.key = key
  }

  /**
   * @typedef {Object} Option
   * @property {string} stDt 조회 시작 일자 (required)
   * @property {number} stTm 조회 시작 시간 (required)
   * @property {string} edDt 조회 종료 일자 (required)
   * @property {number} edTm 조회 종료 시간 (required)
   * @property {number} fcltyMngNo 시설 관리 번호 (optional)
   * @property {number} sujNo 사업장 코드 (required)
   * @property {number} lilndDiv 생활:1, 공업:2 (required)
   * @property {number} numOfRows 줄 수 (required)
   * @property {number} pageNo 페이지 번호 (required)
   * @param {Option} options
   */
  async getWaterQuality (options) {
    options._type = 'json'
    const result = await rp({
      url: apiUri + uri.waterQuality,
      qs: options
    })
    return result
  }

  async getFacilityList () {

  }
}
