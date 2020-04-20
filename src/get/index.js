const { STAGE } = process.env;
if (!STAGE) throw Error("Missing Environment Variable: STAGE");

module.exports = (event, _, callback) => {
  const html = `
  <html>
    <body>
      <h1>Upload your HTML File</h1>
      <input id="input" type="file" />
      <a id="download-anchor"></a>

      <script>
        const inputElement = document.getElementById("input");
        inputElement.addEventListener("change", function () {
          const reader = new FileReader();
          reader.onload = function (evt) {
            fetch("/${STAGE}/pdf", {
              method: "POST",
              headers: { "Content-Type": "application/text" },
              body: btoa(evt.target.result),
            })
              .then(response => response.json())
              .then(response => {
                const a = document.getElementById("download-anchor");
                a.href = \`data:application/pdf;base64,\${response.data}\`;
                a.download = "test.pdf";
                a.click();
                this.value = "";
              });
          };

          reader.onerror = function (evt) {
            console.error("An error ocurred reading the file",evt);
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
