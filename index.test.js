const Index= require('./index')

const f = async () => {
  const i = new Index('{{YOUR KEY}}')
  console.log(await i.getWaterQuality({
    stDt: "2017-08-31",
    edDt: "2017-08-31",
    stTm: "00",
    edTm: "24",
    sujCode: 333,
    fcltyMngNo: 4824012333,
    liIndDiv: 1,
    numOfRows: 1,
    pageNo: 1
  }))
}
f()

const g = async () => {
  const i = new Index('{{YOUR KEY}}')
  console.log(await i.getFacilityList({ fcltyDivCode: 2 }))
}
g()
