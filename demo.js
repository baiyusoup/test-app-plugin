class Demo {
    ID = "Demo";
    TYPE = 1;

    SEARCH_URL = "";
    search(html, jq) {

    }

    SECTION_URL = "https://manhua.dmzj.com/zhegeshijiangshimorc";
    parserSectionList(html, jq) {
      const prefix = "manhua.dmzj.com";
      const domList = jq.parseHTML(html);
      const list = [];
      jq.each(domList, function (idx, el) {
        if (el.nodeType !== 1) {
          return;
        }
        const target = el.querySelector('.cartoon_online_border');
        if (!target) {
          return;
        }
        const aList = target.getElementsByTagName('a');
        for(let i = 0; i < aList.length; i++) {
          const a = aList.item(i);
          list.push({
            name: a.textContent,
            url:  a.href.replace(a.host, prefix)
          })
        }
      })
      return list;
    }

    parserBookDetail(html, jq) {
      const domList = jq.parseHTML(html);
      const list = [];
      jq.each(domList, (idx, el) => {
        if (el.nodeType !== 1) {
          return;
        }
        const target = el.querySelector('#page_select');
        if (!target) {
          return;
        }
        const options = target.getElementsByTagName('option');
        for(let i = 0; i < options.length; i++) {
          const option = options.item(i);
          list.push(option.value);
        }
      })
      return list;
    }

}

console.log('Hello Plugin');
if (window.registerPlugin) {
  const p = new Demo();
  window.registerPlugin(p);
}

if (remApp) {
  const p = new Demo();
  remApp.register(p);
}