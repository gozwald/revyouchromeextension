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

  const cloudGenerator = (divName, array) => {
    // set the dimensions and margins of the graph
    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = 650 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var fill = d3.scaleOrdinal(d3.schemeCategory20);

    // append the svg object to the body of the page
    var svg = d3
      .select(divName)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    var layout = d3.layout
      .cloud()
      .size([width, height])
      .words(
        array.map((d) => {
          return { text: d };
        })
      )
      .spiral("archimedean")
      .rotate(0)
      .padding(8)
      .fontSize(() => 10 + Math.random() * 22)
      .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Better not to touch it. To change parameters, play with the 'layout' variable above
    function draw(words) {
      svg
        .append("g")
        .attr(
          "transform",
          "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
        )
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", function (d) {
          return d.size + "px";
        })
        .style("fill", (d, i) => fill(i))
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) {
          return d.text;
        });
    }
  };

  const handleEvent = (e) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const modalBody = document.querySelector(".modal-body");
    const modal = document.getElementById("myModal");

    modal.style.display = "block";
    modalBody.innerHTML += `<div id="loading"><div class="loader"></div></div>`;
    const loading = document.getElementById("loading");

    window.onclick = (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
        modalBody.removeChild(loading);
        controller.abort();
      }
    };

    fetch("http://localhost:3000/getdata", {
      method: "POST",
      signal: signal,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ url: e.target.name }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        modalBody.removeChild(loading);

        modalBody.innerHTML += `<div class="count"><div class="uppermodalbody"></div><div class="lowermodalbody"></div></div>`;
        const count = document.querySelector(".count");
        const uppermodal = document.querySelector(".uppermodalbody");
        const lowermodal = document.querySelector(".lowermodalbody");

        let keys = [];

        const handleCloud = (currentKey) => {
          keys.forEach((key) => {
            document.querySelector(`#cloud${key}`).style.display =
              currentKey === key ? "block" : "none";
          });
        };

        for (const [key, value] of Object.entries(data.finalTally.count)) {
          lowermodal.innerHTML += `<span id="labelbutton${key}" class="waves-effect waves-light btn">${key} (${value})</span>`;
          keys.push(key);
        }

        keys.forEach((key) => {
          const targetButton = document.querySelector(`#labelbutton${key}`);
          targetButton.addEventListener("click", () => handleCloud(key));
        });

        for (const [key, value] of Object.entries(
          data.snippetCollection.snippetCollection
        )) {
          uppermodal.innerHTML += `<div id="cloud${key}"></div>`;
          document.querySelector(`#cloud${key}`).style.display = "none";
          cloudGenerator(`#cloud${key}`, value);
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
