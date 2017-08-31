const rp = require('request-promise')

module.exports = class KoreaLiveWaterworks {
  constructor ({ key }) {
    if (!key) {
      throw new Error('Key isn\'t given')
    }
    this.key = key
    this.apiUri = `http://apis.data.go.kr/B500001/rwis/waterQuality/?serviceKey=${key}`
    this.uri = {
      waterQuality: 'list',
      facilityList: 'fcltylist/codelist',
      supplyLgldCodeList: 'supplyLgldCode/list'
    }
  }

  /**
   * @typedef {Object} Request
   * @property {string} stDt 조회 시작 일자 (required)
   * @property {string | number} stTm 조회 시작 시간 (required)
   * @property {string} edDt 조회 종료 일자 (required)
   * @property {string | number} edTm 조회 종료 시간 (required)
   * @property {string | number} fcltyMngNo 시설 관리 번호 (optional)
   * @property {string | number} sujNo 사업장 코드 (required)
   * @property {string | number} lilndDiv 생활:1, 공업:2 (required)
   * @property {string | number} numOfRows 줄 수 (required)
   * @property {string | number} pageNo 페이지 번호 (required)
   *
   * @typedef {Object} Response
   * @property {string} no 데이터 출력 번호 (ex: 1)
   * @property {string} occrrncDt 수질정보가 측정된 발생일시 (ex: 2015111911)
   * @property {string} fcltyMngNm 실시간수도정보시스템에서 관리 하는 시설관리명 (ex: 연초정수장)
   * @property {string} fcltyMngNo 실시간수도정보시스템에서 관리 하는 시설관리번호 (ex: 4831012331)
   * @property {string} fcltyAddr 시설주소 (ex: 경남 거제시 연초면)
   * @property {string} liIndDivName 생활,공업 용수 구분명 (ex: 공업)
   * @property {string} clVal 잔류염소 (ex: 0.675)
   * @property {string} phVal pH (ex: 7.2742)
   * @property {string} tbVal 탁도 (ex: 0.0387)
   * @property {string} chgDt 변경일시 (ex: 2015111911)
   * @property {string} phUnit pH단위 (ex: PH)
   * @property {string} tbUnit 탁도단위 (ex: NTU)
   * @property {string} clUnit 잔류단위 (ex: MG/L)
   *
   * @param {Request} option
   * @throws {Error} throw error when required key doesn't given
   * @return {Response}
   */
  async getWaterQuality (option) {
    this._verifyOption(['stDt', 'stTm', 'edDt', 'edTm', 'fcltyMngNo', 'sujNo', 'lilndDiv', 'numOfRows', 'pageNo'], option)

    option._type = 'json'
    const result = await rp({
      url: this.apiUri + this.uri.waterQuality,
      qs: option
    })
    return result.body
  }

  /**
   * @typedef {Object} Request
   * @property {number} fcltyDivCode 시설 구분 코드 (1:취수장, 2:정수장, 3:가압장, 4:배수지), (required)
   *
   * @throws {Error} throw error when required key doesn't given
   * @return {Response}
   */
  async getFacilityList (option) {
    this._verifyOption(['fcltyDivCode'], option)

    option._type = 'json'
    const result = await rp({
      url: this.apiUri + this.uri.facilityList,
      qs: option
    })
    return result.body
  }

  /**
   * @typedef {Object} Response
   * @property {string} addrName 법정동명
   * @property {string} fcltyMngNm 시설관리명
   * @property {string} fcltyMngNo 시설관리번호
   * @property {string} lgldCode 법정동코드
   * @property {string} lgldFullAddr 법정동 상세 주소
   * @property {string} sujCode 사업장코드
   * @property {string} upprLgldCode 상위법정동코드
   *
   * @return {Response}
   */
  async supplyLgldCodeList () {
    const result = await rp({
      url: this.apiUri + this.uri.supplyLgldCodeList
    })
    return result.body
  }

  /**
   * @param {Array<string>} keys
   * @param {Object} option
   * @throws {Error} throw error when object hasn't key in keys
   */
  _verifyOption (keys, option) {
    keys.forEach(v => {
      if (!(v in option)) {
        throw new Error(`Required option '${v}' isn't given.`)
      }
    })
  }
}
