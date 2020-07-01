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

  const buildCloud = (data) => {
    console.log(data.finalTally.count);
  };

  const handleEvent = (e) => {
    const modalBody = document.querySelector(".modal-body");

    modalBody.innerHTML += ` <div id="nested"><h2>Loading...</h2></div>`;

    const modal = document.getElementById("myModal");
    const span = document.querySelector(
      "#myModal > div > div.modal-header > span"
    );
    modal.style.display = "block";
    span.onclick = () => {
      modal.style.display = "none";
      modalBody.removeChild(document.getElementById("nested"));
    };
    window.onclick = (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
        modalBody.removeChild(document.getElementById("nested"));
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
        buildCloud(data);
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
