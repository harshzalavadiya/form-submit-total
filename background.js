chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (
      details.method == "POST" &&
      details.url.includes("agency_payment.php")
    ) {
      console.log(details.requestBody.formData);

      custNumber = details.requestBody.formData.cons_no;
      custAmt = details.requestBody.formData.pay_amount;

      const k = custNumber.toString();
      const v = Number(custAmt.toString());

      chrome.storage.sync.set({ data: { [k]: v } });

      // chrome.runtime.sendMessage({
      //   msg: "eb_form_submitted",
      //   data: { [k]: v },
      // });
    }
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);
