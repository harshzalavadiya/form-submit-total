let getFromStorage = () =>
  new Promise((resolve, _reject) =>
    chrome.storage.sync.get(["billdb"], ({ billdb }) => {
      resolve(JSON.parse(billdb));
    })
  );

async function stDeleteIndex(key) {
  const db = await getFromStorage();

  chrome.storage.sync.set(
    {
      billdb: JSON.stringify({ ...db, [key]: undefined }),
    },
    () => {
      updateTable();
    }
  );
}

function stClear() {
  chrome.storage.sync.set({
    billdb: "{}",
  });
}

async function updateTable() {
  const db = await getFromStorage();

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

document.addEventListener("DOMContentLoaded", updateTable);

$("#clear").click(function () {
  stClear();
  updateTable();
});

$(document).on("click", ".delete-item", function () {
  const idx = $(this).data("id");
  stDeleteIndex(idx);
});
