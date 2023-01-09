import type { IShortCode } from "@/interfaces/workshop";
import sanitizeHtml from "sanitize-html";


const shortCodes = [
  {
    reg: "{{<.youtube.(.*).>}}",
    replace: `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe src="https://www.youtube.com/%%variable%%" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen title="YouTube Video"></iframe>
      </div>`
  },
  {
    reg: "{{<.vimeo.(.*).>}}",
    replace: `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe src="https://player.vimeo.com/video/%%variable%%" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen title="Vimeo Video"></iframe>
      </div>`
  },
  {
    reg: "{{% notice warning %}}(([^{}]|\n)*){{% /notice %}}",
    replace: `<blockquote class="bq bq-warn">
      <p>%%variable%%</p>
      </blockquote>`
  },
  {
    reg: "{{% notice info %}}(([^{}]|\n)*){{% /notice %}}",
    replace: `<blockquote class="bq bq-info">
              <p>%%variable%%</p>
            </blockquote>`
  },
  {
    reg: "{{% notice note %}}(([^{}]|\n)*){{% /notice %}}",
    replace: `<blockquote class="bq bq-note">
      <p>%%variable%%</p>
      </blockquote>`
  },
  {
    reg: "{{% notice tip %}}(([^{}]|\n)*){{% /notice %}}",
    replace: `<blockquote class="bq bq-tip">
      <p>%%variable%%</p>
      </blockquote>`
  }
] as IShortCode[]


function regReplace(match: string, newVal: string) {
  return match.replace('%%variable%%', newVal)
}

export function processPath(path: string) {
  let res = path.substr(0, path.lastIndexOf("."));
  res = res.substr(2);
  res = res.replaceAll(" ", "-");
  res = res.replaceAll("_index", "");
  res = res.replaceAll("_", "-");
  res = res.replaceAll(".", "-");
  res = './' + res
  return res
}

export function processPage(text: string) {

  let res = text
  shortCodes.forEach(code => {
    let re = new RegExp(code.reg, "g")
    res = res.replaceAll(re, (a, b) => { return regReplace(code.replace, b); })
  })

  res = sanitizeHtml(res, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "iframe", "blockquote"]),
    allowedAttributes: {
      a: ['href', 'name', 'target'],
      div: ['style', 'class'],
      iframe: ['style', 'src'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      blockquote: ['class', 'style']
    },
    allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
  });

  return res
}

/*
 [Additional info here]({{< relref "/030-Knowledge/" >}} "Knowledge") 
 {{< operataIntercom >}}" -->  shortcodes that are used throughout out content and are found in themes/hugo-theme-learn/layouts/shortcodes
 ------------------
{{/* comments here * /}}
*/


