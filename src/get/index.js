const { styles } = require("./styles");

const { STAGE, IS_OFFLINE } = process.env;
if (!STAGE) throw Error("Missing Environment Variable: STAGE");

const basePath = IS_OFFLINE ? `/${STAGE}` : "";

module.exports = (event, _, callback) => {
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
      <main>
        <h1>Upload your HTML File</h1>
        <input id="input" type="file" />
        <div class="box">
          <input
            type="file"
            name="file-1[]"
            id="input"
            class="inputfile inputfile-1"
            data-multiple-caption="{count} files selected"
            multiple
          />
          <label id="input-label"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="17"
              viewBox="0 0 20 17"
            >
              <path
                d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
              />
            </svg>
            <span>Choose a file&hellip;</span></label
          >
        </div>
        <a id="download-anchor"></a>
        <div id="loader" class="loading">
          <span></span>
        </div>
      </main>

      <style>
        ${styles}
      </style>
      <script>
        let loading = false;
        const inputLabel = document.getElementById("input-label");
        inputLabel.addEventListener(
          "click",
          () => !loading && document.getElementById("input").click()
        );

        const toggleLoader = () => {
          loading = !loading;
          const loader = document.getElementById("loader");

          if (loader.style.display === "block") {
            loader.style.display = "none";
          } else {
            loader.style.display = "block";
          }
        };

        const inputElement = document.getElementById("input");
        inputElement.addEventListener("change", function () {
          toggleLoader();
          const reader = new FileReader();

          reader.onload = function (evt) {
            fetch("${basePath}/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                html: btoa(evt.target.result),
              }),
            })
              .then((response) => response.json())
              .then((response) => {
                toggleLoader();
                const a = document.getElementById("download-anchor");
                a.href = \`data:application/pdf;base64,\${response.data}\`;
                a.download = "test.pdf";
                a.click();
                const inputElement = document.getElementById("input");
                inputElement.value = "";
              });
          };

          reader.onerror = function (evt) {
            console.error("An error ocurred reading the file", evt);
          };

          reader.readAsText(this.files[0], "UTF-8");
        });
      </script>
    </body>
  </html>`;

  callback(null, {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: html,
  });
};
