/* eslint-disable no-console */
const axios = require("axios")
const fs = require("fs")
const dateFormat = (date, fmt) => {
  if (!date) return ''
  if (typeof date === 'number') date = new Date(date)
  let attributes = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "S": date.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  for (let attr in attributes)
    if (new RegExp(`(${attr})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (attributes[attr]) : (("00" + attributes[attr]).substr(("" + attributes[attr]).length)))
    }
  return fmt
}

axios.request('https://3g.dxy.cn/newh5/view/pneumonia').then(({ data: html }) => {
  const dataContent = html.match(/window.getAreaStat = (.*?)}catch/)[1]
  const json = JSON.parse(dataContent)
  const oldData = fs.readFileSync('./public/json/area.json')
  let oldJson = {}
  try {
    oldJson = JSON.parse(oldData)
  } catch (e) {
    //
  }
  const today = dateFormat(new Date(), "yyyy/MM/dd")
  oldJson[today] = json
  fs.writeFileSync('./public/json/area.json', JSON.stringify(oldJson))
})

axios.request('https://file1.dxycdn.com/2020/0130/492/3393874921745912795-115.json').then(({ data: {success, message, data} }) => {
  if (!success) {
    console.error(message)
  } else {
    fs.writeFileSync('./public/json/timeline.json', JSON.stringify(data))
  }
})