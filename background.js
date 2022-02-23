chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (
      details.method == "POST" &&
      details.url.includes("agency_payment.php")
    ) {
      custNumber = details.requestBody.formData.cons_no;
      custAmt = details.requestBody.formData.pay_amount;

      const k = custNumber.toString();
      const v = Number(custAmt.toString());

      chrome.storage.sync.get("billdb", function ({ billdb = "{}" }) {
        console.log(JSON.parse(billdb));
        chrome.storage.sync.set({
          billdb: JSON.stringify({ ...JSON.parse(billdb), [k]: v }),
        });
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);
