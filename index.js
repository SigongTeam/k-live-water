const axios = require('axios')

const ENDPOINT_URI = 'http://apis.data.go.kr/B500001/rwis/waterQuality/'
const URI = {
  waterQuality: 'list',
  facilityList: 'fcltylist/codelist',
  supplylgIdCodeList: 'supplyLgldCode/list'
}

module.exports = class KoreaLiveWaterworks {
  constructor (key) {
    if (!key) {
      throw new Error('Key isn\'t given')
    }
    this.key = key
  }

  async get (request, params) {
    params.serviceKey = this.key
    params._type = 'json'

    const { data } = await axios.get(ENDPOINT_URI + request, { params })

    if (!data || !data.response || !data.response.header || !data.response.body) {
      throw new Error('Unexpected response data from geocode')
    }

    if (data.response.header.resultCode !== '00') {
      throw new Error(`Unexpected response code '${data.response.header.resultCode}'`)
    }

    return data.response.body
  }

  /**
   * @typedef {Object} QualityRequest
   * @property {string} stDt 조회 시작 일자 (required)
   * @property {string | number} stTm 조회 시작 시간 (required)
   * @property {string} edDt 조회 종료 일자 (required)
   * @property {string | number} edTm 조회 종료 시간 (required)
   * @property {string | number} fcltyMngNo 시설 관리 번호 (optional)
   * @property {string | number} sujNo 사업장 코드 (required)
   * @property {string | number} liIndDiv 생활:1, 공업:2 (required)
   * @property {string | number} numOfRows 줄 수 (required)
   * @property {string | number} pageNo 페이지 번호 (required)
   *
   * @typedef {Object} QualityResponse
   * @property {string} no 데이터 출력 번호 (ex: 1)
   * @property {string} observed 수질정보가 측정된 발생일시 (ex: 2015111911)
   * @property {string} facilityName 실시간수도정보시스템에서 관리 하는 시설관리명 (ex: 연초정수장)
   * @property {string} facilityId 실시간수도정보시스템에서 관리 하는 시설관리번호 (ex: 4831012331)
   * @property {string} facilityAddr 시설주소 (ex: 경남 거제시 연초면)
   * @property {string} waterType 생활,공업 용수 구분명 (ex: 공업)
   * @property {string} clVal 잔류염소 (ex: 0.675)
   * @property {string} phVal pH (ex: 7.2742)
   * @property {string} tbVal 탁도 (ex: 0.0387)
   * @property {string} updated 변경일시 (ex: 2015111911)
   * @property {string} phUnit pH단위 (ex: PH)
   * @property {string} tbUnit 탁도단위 (ex: NTU)
   * @property {string} clUnit 잔류단위 (ex: MG/L)
   *
   * @param {QualityRequest} option
   * @throws {Error} throw error when required key doesn't given
   * @return {QualityResponse}
   */
  async getWaterQuality (option) {
    this._verifyOption(['stDt', 'stTm', 'edDt', 'edTm', 'fcltyMngNo', 'sujNo', 'liIndDiv', 'numOfRows', 'pageNo'], option)

    const data = await this.get(URI.waterQuality, option)
    const ret = []
    data.items.item.forEach(v => {
      ret.push({
        id: v.no,
        observed: v.occrrncDt,
        facilityName: v.fcltyMngNm,
        facilityId: v.fcltyMngNo,
        facilityAddr: v.fcltyAddr,
        waterType: v.liIndDivName,
        clVal: v.clVal,
        phVal: v.phVal,
        tbVal: v.tbVal,
        updated: v.chgDt,
        phUnit: v.phUnit,
        tbUnit: v.tbUnit,
        clUnit: v.clUnit
      })
    })

    return ret
  }

  /**
   * @typedef {Object} FacilityRequest
   * @property {number} fcltyDivCode 시설 구분 코드 (1:취수장, 2:정수장, 3:가압장, 4:배수지), (required)
   *
   * @typedef {Object} FacilityResponse
   * @property {string} facilityName 시설관리명
   * @property {string} code 사업장코드
   *
   * @param {FacilityRequest} option
   * @throws {Error} throw error when required key doesn't given or response data is invalid
   *
   * @return {FacilityResponse}
   */
  async getFacilityList (option) {
    this._verifyOption(['fcltyDivCode'], option)

    const data = await this.get(URI.facilityList, option)

    const ret = []
    data.items.item.forEach(v => {
      ret.push({
        facilityName: v.fcltyMngNm,
        code: v.sujCode
      })
    })

    return ret
  }

  /**
   * @typedef {Object} lgIdResponse
   * @property {string} addrName 법정동명
   * @property {string} facilityName 시설관리명
   * @property {string} facilityId 시설관리번호
   * @property {string} lgIdCode 법정동코드
   * @property {string} lgIdFullAddr 법정동 상세 주소
   * @property {string} sujCode 사업장코드
   * @property {string} parentLgId 상위법정동코드
   *
   * @return {lgIdResponse}
   */
  async getSupplyLgIdCodeList () {
    const data = await this.get(URI.supplylgIdCodeList, {})

    const ret = []
    data.items.item.forEach(v => {
      ret.push({
        addrName: v.addrName,
        facilityName: v.fcltyMngNm,
        facilityId: v.fcltyMngNo,
        lgIdCode: v.lgldCode,
        lgIdFullAddr: v.lgldFullAddr,
        code: v.sujCode,
        parentLgId: v.upprLgldCode
      })
    })

    return ret
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
