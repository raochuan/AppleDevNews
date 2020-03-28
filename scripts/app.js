const api = require("./api");
const compactMode = $app.env === $env.today;

exports.init = async() => {

  $ui.render({
    props: {
      title: "AppleDevNews"
    },
    views: [
      {
        type: "list",
        props: {
          id: "main-view",
          autoRowHeight: true,
          template: [
            {
              type: "label",
              props: {
                id: "date-view",
                font: $font(13),
                textColor: $color("secondaryText")
              },
              layout: make => {
                make.left.inset(12);
                make.bottom.inset(8);
              }
            },
            {
              type: "label",
              props: {
                id: "title-view",
                lines: 0,
                font: $font("bold", compactMode ? 17 : 22)
              },
              layout: make => {
                make.left.right.inset(12);
                make.top.equalTo(8);
                make.bottom.equalTo($("date-view").top).offset(-5);
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath, data) => {
            const link = data.link;
            if (compactMode) {
              $app.openURL(link);
            } else {
              $safari.open({ url: link });
            }
          },
          pulled: async(sender) => {
            await fetch();
            await $wait(0.5);
            sender.endRefreshing();
          }
        }
      }
    ]
  });

  const cache = api.cache();
  if (cache) {
    render(cache);
  }

  fetch();
}

async function fetch() {
  const latest = await api.fetch();
  render(latest);
}

function render(items) {
  const view = $("main-view");
  if (!view) {
    return;
  }

  if (compactMode) {
    items = items.slice(0, 8);
  }

  view.data = items.map(item => {
    console.log(item);
    return {
      "title-view": {
        "text": item.title
      },
      "date-view": {
        "text": item.pubDate
      },
      "link": item.link
    }
  });
}