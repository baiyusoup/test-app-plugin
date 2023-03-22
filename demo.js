/**
 * 搜索
 * @param {string} html 
 * @param {import('cheerio')} parser 
 * @returns 
 */
function searchHandler(html, parser) {
  const $ = parser.load(html);
  const hasRemAppId = !!$('#__remAppFetchHtml__').length;
  const boxSelector = hasRemAppId ? "#__remAppFetchHtml__" : "div.tcaricature_block2";
  const domList = $(boxSelector).find('ul');
  const list = [];
  domList.each((i, el) => {
    const img = $(el).find('img');
    const divList = $(el).find('div.adiv2hidden');
    list.push({
      name: img.attr('alt'),
      cover: img.attr('src'),
      author: $(divList.get(0)).text(),
      url: "https:" + img.parent().attr('href')
    })
    return i < 6;
  })
  return list;
}

/**
 * 章节
 * @param {string} html 
 * @param {import('cheerio')} parser 
 * @returns 
 */
function sectionListHandler(html, parser) {
  const $ = parser.load(html);
  const domList = $("div.cartoon_online_border").find('a');
  const list = [];
  domList.each((i, el) => {
    list.push({
      name: $(el).text(),
      url:  "https://manhua.dmzj.com" + $(el).attr('href')
    })
  })

  const bookImg = $('#cover_pic');
  const authorDomList = $('div.anim-main_list').find('tr');
  const authList = $(authorDomList.get(2)).find('td a');
  const authors = [];
  authList.each((i, el) => {
    authors.push($(el).text());
  })

  return { bookName: bookImg.attr('alt'), author: authors.join('/'), cover: bookImg.attr('src'), list };
}

/**
 * 详情
 * @param {string} html 
 * @param {import('cheerio')} parser 
 * @returns 
 */
function sectionDetailHandler(html, parser, options) {
  const { url: currentUrl } = options;
  const prefix = currentUrl.replace(/\/[0-9]+\.shtml/, '/');
  const $ = parser.load(html);
  const domList = $('#page_select').find('option');
  const list = [];
  domList.each((i, el) => {
    list.push($(el).val())
  })

  const prevUrl = $('#prev_chapter').attr('href');
  const nextUrl = $('#next_chapter').attr('href');
  const bookInfo = $('h1.hotrmtexth1');
  const bookName = bookInfo.find('a').text() || "";
  const sectionName = bookInfo.next().text() || "";

  return {
    nextUrl: nextUrl ? prefix + nextUrl : '',
    prevUrl: prevUrl ? prefix + prevUrl : '',
    bookName,
    sectionName,
    data: list
  };
}

if (remApp) {
  remApp.register({
    name: 'Demo',
    type: 1,
    search() {
      return {
        url: "https://manhua.dmzj.com/tags/search.shtml?s=",
        wait_eval: "document.querySelector('div.tcaricature_block2').children.length > 2",
        pick_selectors: ["div.tcaricature_block2"],
        handler: searchHandler
      }
    },
    sectionList() {
      return {
        wait_eval: "document.querySelector('div.cartoon_online_border').children.length > 1",
        pick_selectors: ["div.cartoon_online_border", "div.week_mend"],
        handler: sectionListHandler
      }
    },
    sectionDetail() {
      return {
        wait_eval: "document.getElementById('page_select').children.length > 0",
        pick_selectors: ["#page_select", "#prev_chapter", "#next_chapter", "div.display_middle"],
        handler: sectionDetailHandler
      }
    }
  });
}
