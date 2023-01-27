class Demo {
  ID = "Demo";
  TYPE = 1;

  SEARCH_URL = "";
  search(html, jq) {
  }

  SECTION_URL = "https://manhua.dmzj.com/zhegeshijiangshimorc";
  parserSectionList(html, jq) {
      const $ = jq.load(html);
      const domList = $('div.cartoon_online_border').find('a');
      const list = [];
      domList.each((i, el) => {
      list.push({
          name: $(el).text(),
          url:  "https://manhua.dmzj.com" + $(el).attr('href')
          })
      })
      return list;
  }

  parserBookDetail(html, jq) {
      const $ = jq.load(html);
      const domList = $('#page_select').find('option');
      const list = [];
      domList.each((i, el) => {
        list.push($(el).val())
      })
      return list;
  }
}

console.log('Hello Plugin');
if (remApp) {
const p = new Demo();
remApp.register(p);
}