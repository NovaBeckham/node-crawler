import axios from "axios"
import dayjs from 'dayjs'

async function getData() {
  try {
    const params = {
      appId: "34385",
      params:
        '{"device":"HMA-AL00","isBeta":"false","grayHair":"false","from":"nt_history","brand":"HUAWEI","info":"wifi","index":"4","rainbow":"","schemaType":"auction","elderHome":"false","isEnterSrpSearch":"true","newSearch":"false","network":"wifi","subtype":"","hasPreposeFilter":"false","prepositionVersion":"v2","client_os":"Android","gpsEnabled":"false","searchDoorFrom":"srp","debug_rerankNewOpenCard":"false","homePageVersion":"v7","searchElderHomeOpen":"false","search_action":"initiative","sugg":"_4_1","sversion":"13.6","style":"list","ttid":"600000@taobao_pc_10.7.0","needTabs":"true","areaCode":"CN","vm":"nw","countryNum":"156","m":"pc","page":1,"n":48,"q":"%E5%A4%96%E5%A5%97%E7%94%B7","qSource":"url","pageSource":"a21bo.jianhua/a.201856.d13","tab":"all","pageSize":48,"totalPage":100,"totalResults":4800,"sourceS":"0","sort":"_coefp","bcoffset":"","ntoffset":"","filterTag":"","service":"","prop":"","loc":"","start_price":null,"end_price":null,"startPrice":null,"endPrice":null,"itemIds":null,"p4pIds":null,"p4pS":null,"categoryp":"","myCNA":"C0qNH6Tb6VcCAXkjtauqxktT"}',
    }
    const { data } = await axios({
      url: "https://h5api.m.taobao.com/h5/mtop.relationrecommend.wirelessrecommend.recommend/2.0/",
      headers: {
        cookie:
          "t=48d5df917660a9dd8a6c4e1aad480da9; thw=cn; cna=C0qNH6Tb6VcCAXkjtauqxktT; _tb_token_=705de1e6ebeb; xlly_s=1; cookie2=24e94d321dd25edb2eef0ae9cc4098e2; _samesite_flag_=true; 3PcFlag=1728635672231; sgcookie=E100YVQTvoMzv1ns8DiARl76I1DBJPF4T1ZiV6pf68am%2F3EhBSSkJqWCihEyR1Hwc2AjXEL5kHoRfGCXwsIwDHaG2YBps2ce7Qh8Fuf5jqBcBek%3D; wk_cookie2=1243c74e49f5cc743ee08052c1cb1ac8; wk_unb=UU21boWIHYVy7A%3D%3D; unb=2571864091; uc1=existShop=false&cookie15=VT5L2FSpMGV7TQ%3D%3D&cookie16=Vq8l%2BKCLySLZMFWHxqs8fwqnEw%3D%3D&cookie14=UoYcC%2FLqjix62A%3D%3D&pas=0&cookie21=UtASsssmeW6lpyd%2BB%2B3t; uc3=id2=UU21boWIHYVy7A%3D%3D&lg2=W5iHLLyFOGW7aA%3D%3D&nk2=lWlWGBSqE0o%3D&vt3=F8dD37njru2twf1eXnQ%3D; csg=00109c06; lgc=%5Cu946B%5Cu661F%5Cu5DF4%5Cu514B; cancelledSubSites=empty; cookie17=UU21boWIHYVy7A%3D%3D; dnk=%5Cu946B%5Cu661F%5Cu5DF4%5Cu514B; skt=0fc1d42d38f91213; existShop=MTcyODYzNTY4NA%3D%3D; uc4=id4=0%40U2%2FySy1YCsTT%2BCfzCzOEOLCf0%2Be9&nk4=0%40l5uDmdU4SEQYUHyD4%2BUznVyaMw%3D%3D; tracknick=%5Cu946B%5Cu661F%5Cu5DF4%5Cu514B; _cc_=VT5L2FSpdA%3D%3D; _l_g_=Ug%3D%3D; sg=%E5%85%8B19; _nk_=%5Cu946B%5Cu661F%5Cu5DF4%5Cu514B; cookie1=BxZjfI8Ss3L2f3jxJwXd%2BfldD8ay2Hfwip5ImVbnl5Q%3D; mtop_partitioned_detect=1; _m_h5_tk=631c46d79275d6e24f98d9234b0cefa1_1728652211379; _m_h5_tk_enc=2d6e6f242187adeeb7d0e707c4026d2b; tfstk=g1ZnMcMbByuBNdLsNOoCrJtk4-_TdpiSR7K-w0hP7fl6v4lRR70uw5gzvDeLsbPYZYEL2u46q-w7v9iRdDwIV05AMiEudJi5o9WQy1eNUYiPx1Q96JwIVd1AMiIYdQmBpKerUbWibYDk40uEadoZ1YDya7lE7Ckmh0lza7kaQvMvTborTAkZ1Yora7lrBvdI9-wab6N-UlR75mqiK2c4IZtyqZM6MjyehnKYjP0iggcM43riKRhNRx-cyjzj9qhb_GKnqRkusqUhiHVuU-arSuAFpSyzOlmImaBIoPzTk24GT3cTvY0q4Vvy4Rmz84ro0iRiCPyLzkNHE3kQvo3oGVXyV4naDqz4tL6bQDkzNqZRGHGUU-ZbkmjHGv4ancjyoF82GJKSQTEwPUgECAcAvlif1U5qNEBGIEPq8AMFrOXMPUgECAcAIOYV32ksLaf..; isg=BN_f6fcdxJ7HM8CCg3WgTPpKbjNpRDPmel2DlnEseQ7UAP-CeRQFNxTWwpB-mAte",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      },
      params: {
        jsv: "2.7.2",
        appKey: "12574478",
        t: "1728641787435",
        sign: `631c46d79275d6e24f98d9234b0cefa1&${dayjs().valueOf()}&12574478`,
        api: "mtop.relationrecommend.wirelessrecommend.recommend",
        v: 2.0,
        type: "jsonp",
        dataType: "jsonp",
        callback: "mtopjsonp9",
        data: params,
      },
    })
    console.log("data", data)
  } catch (error) {
    console.log("error", error)
  }
}

getData()
