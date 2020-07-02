(() => {
  var iterator = document.evaluate(
    '//*[(@id = "anonCarousel6")]//*[contains(concat( " ", @class, " " ), concat( " ", "a-row", " " )) and contains(concat( " ", @class, " " ), concat( " ", "a-size-small", " " ))] | //*[(@id = "anonCarousel5")]//*[contains(concat( " ", @class, " " ), concat( " ", "a-size-small", " " ))] | //*[contains(concat( " ", @class, " " ), concat( " ", "sg-col-12-of-28", " " ))]//*[contains(concat( " ", @class, " " ), concat( " ", "a-size-small", " " ))]',
    document,
    null,
    XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
    null
  );

  let targetNode = [];

  try {
    var thisNode = iterator.iterateNext();

    while (thisNode) {
      targetNode.push(thisNode);
      thisNode = iterator.iterateNext();
    }
  } catch (e) {
    alert("Error: Document tree modified during iteration " + e);
  }

  const handleEvent = (e) => {
    const modalBody = document.querySelector(".modal-body");
    const modal = document.getElementById("myModal");
    const span = document.querySelector(
      "#myModal > div > div.modal-header > span"
    );
    modal.style.display = "block";
    modalBody.innerHTML += `<div id="loading"><div class="loader"></div>`;
    const loading = document.getElementById("loading");

    span.onclick = () => {
      modal.style.display = "none";
      modalBody.removeChild(loading);
    };
    window.onclick = (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
        modalBody.removeChild(loading);
      }
    };

    fetch("http://localhost:3000/getdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ url: e.target.name }),
    })
      .then((response) => response.json())
      .then((data) => {
        modalBody.removeChild(loading);

        modalBody.innerHTML += `<div id="count"></div>`;
        const count = document.getElementById("count");

        for (const [key, value] of Object.entries(data.finalTally.count)) {
          count.innerHTML += `<h2>${key}: ${value}</h2>`;
        }

        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            modalBody.removeChild(count);
          }
        };
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  for (let i = 0; i < targetNode.length; i++) {
    let block = document.createElement("span");

    block.innerHTML += `
      <!-- Trigger/Open The Modal -->
<button name=${targetNode[i]
      .querySelector("span:nth-child(2) > a")
      .getAttribute("href")} id="myBtn${i}">Magic</button>
      <!-- The Modal -->
<div id="myModal" class="modal">

  <!-- Modal content -->
  <div class="modal-content">
    <div class="modal-header">
      <span class="close">&times;</span>

    </div>
    <div class="modal-body">
    </div>
    <div class="modal-footer">

    </div>
  </div>

</div>`;

    targetNode[i].appendChild(block);
    const magicButton = document.querySelector(`#myBtn${i}`);
    magicButton.addEventListener("click", handleEvent);
  }
})();
