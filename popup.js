const ls = localStorage;

function stGet() {
  return JSON.parse(ls.getItem("dbx") || "{}");
}

function stPush(newItem) {
  ls.setItem("dbx", JSON.stringify({ ...stGet(), ...newItem }));
}

function stDeleteIndex(key) {
  let { [key]: x, ...newSt } = stGet();
  ls.setItem("dbx", JSON.stringify(newSt));
}

function stClear() {
  ls.setItem("dbx", "{}");
}

function updateTable() {
  const db = stGet();

  let newBody = "";
  let total = 0;

  for (const [number, amount] of Object.entries(db)) {
    newBody = `${newBody}<tr>
      <td>${number}</td>
      <td>${amount}</td>
      <td><button class="delete-item" data-id="${number}"> 🗑️ </button></td>
    </tr>`;
    total = total + Number(amount);
  }

  $("tbody").empty().html(newBody);
  $("#total").empty().html(total);
}

function updatePopup() {
  chrome.storage.sync.get(["data"], function ({ data }) {
    stPush(data);
    updateTable();
    chrome.storage.sync.set({ data: {} });
  });
}

document.addEventListener("DOMContentLoaded", updatePopup);

$("#clear").click(function () {
  stClear();
  updateTable();
});

$(document).on("click", ".delete-item", function () {
  const idx = $(this).data("id");
  stDeleteIndex(idx);
  updateTable();
});

// // test
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log(request.data);
//   if (request.msg === "eb_form_submitted") {
//     console.log(request.data);
//     // //  To do something
//     // console.log(request.data.subject);
//     // console.log(request.data.content);

//     stPush(request.data);
//     updateTable();
//   }
// });
