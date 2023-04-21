const streamSaver = require("streamsaver");
streamSaver.mitm = "mitm.html";
const token = localStorage.getItem("token");
import { _alert } from "@/plugins/myfun";
export function download(downLoadUrl, form) {
  fetch(downLoadUrl, {
    method: "POST",
    cache: "no-cache",
    headers: {
      Authorization: token,
    },
    body: form,
  })
    .then(async (res) => {
      const fileStream = streamSaver.createWriteStream(
        decodeURI(res.headers.get("Content-Disposition")),
        {
          size: res.headers.get("content-length"),
        }
      );

      const readableStream = res.body;

      // more optimized
      if (window.WritableStream && readableStream.pipeTo) {
        await readableStream.pipeTo(fileStream);
        return console.log("done writing");
      }
      window.writer = fileStream.getWriter();

      const reader = res.body.getReader();
      const pump = () =>
        reader
          .read()
          .then((res) =>
            res.done
              ? window.writer.close()
              : window.writer.write(res.value).then(pump)
          );

      pump();
    })
    .catch((err) => {
      _alert(err);
    });
}
