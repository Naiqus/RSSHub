const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = `https://www.bild.de/news/inland/news-inland/coronavirus-alle-infos-zur-lungenkrankheit-im-nachrichten-ticker-68674604.bild.html`;

    const response = await got({
        method: 'get',
        url,
    });

    const $ = cheerio.load(response.data);
    const list = $('.stream-body');

    const filter_out_empty_post = function(content_) {
        var title = content_.find('.headline').text();
        return title !== null && title.match(/^ *$/) === null;
    };

    const posts = list
        .filter((index_, content_) => {
            return filter_out_empty_post($(content_));
        })
        .map((index_, content_) => ({
            title: $(content_)
                .find('.headline')
                .text(),
            description: $(content_).text(),
            link: `https://www.bild.de/news/inland/news-inland/coronavirus-alle-infos-zur-lungenkrankheit-im-nachrichten-ticker-68674604.bild.html`,
        }))
        .get();

    ctx.state.data = {
        title: `BILD.de live-ticker: Coronavirus`,
        link: 'url',
        item: posts,
    };
};