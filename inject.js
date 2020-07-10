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
      width = 750 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

    // var color = d3.scale
    //   .ordinal()
    //   .range(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854"]);

    // var fontSize = d3.scale.pow().exponent(5).domain([0, 1]).range([10, 80]);

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
          return { text: d[0], review: d[1] };
        })
      )
      .spiral("archimedean")
      .rotate(0)
      .padding(10)
      .fontSize(() => 17 + Math.random() * 20)
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
        .style("cursor", "pointer")
        .style("fill", (d, i) => fill(i))
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) {
          return d.text;
        })
        .on("click", (d) => {
          console.log({ d });
          const reviewContainer = document.querySelector("#fullreview");
          console.log({ reviewContainer });
          if (reviewContainer) {
            reviewContainer.style.fontFamily = "Montserrat, sans-serif";
            reviewContainer.innerHTML = `"${d.review}"`;
          }
        });
    }
  };

  const handleEvent = (e) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const modalBody = document.querySelector(".modal-body");
    const modal = document.getElementById("myModal");

    modal.style.display = "block";
    // modalBody.innerHTML += `<div id="loading"><div class="loader"></div></div>`;
    modalBody.innerHTML += `<img src="chrome-extension://magglmnfpahaacfieggnekiajpmlggld/images/revyou_2.png">`;
    modalBody.innerHTML += `<div class="progress"><div class="indeterminate"></div></div>`;
    const loading = document.getElementById("loading");

    window.onclick = (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
        modalBody.innerHTML = "";
        controller.abort();
      }
    };

    fetch("http://localhost:3000/getdata/", {
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
        modalBody.innerHTML = `<div class="count">
        <div class="uppermodalbody"><div class="upperleft"></div><div class="upperright"><div id="fullreview" class="card">
        <img src="chrome-extension://magglmnfpahaacfieggnekiajpmlggld/images/downleft.png">Click on a text snippet below for the full review
        <img src="chrome-extension://magglmnfpahaacfieggnekiajpmlggld/images/downright.png"></div></div></div>
        <div class="lowermodalbody"><div class="lowerleft"><div id="labelspositive"></div><div id="labelsnegative">
        </div></div><div class="lowerright"><div id="cloudcontainer" class="card"></div></div></div>
        </div>`;

        const count = document.querySelector(".count");
        const uppermodal = document.querySelector(".uppermodalbody");
        const lowermodal = document.querySelector(".lowermodalbody");
        const upperleft = document.querySelector(".upperleft");
        const lowerleft = document.querySelector(".lowerleft");
        const upperright = document.querySelector(".upperright");
        const lowerright = document.querySelector(".lowerright");
        const cloudcontainer = document.querySelector("#cloudcontainer");
        const fullreview = document.querySelector("#fullreview");
        const labelspositive = document.querySelector("#labelspositive");
        const labelsnegative = document.querySelector("#labelsnegative");
        const productImage = e.target.getAttribute("image");

        // upperleft.innerHTML += `<img src=${productImage}>`;

        let keys = [];

        const handleCloud = (currentKey) => {
          keys.forEach((key) => {
            document.querySelector(`#cloud${key}`).style.display =
              currentKey === key ? "block" : "none";
          });
        };

        // const objectsortHelper = (obj) => {
        //   let sortable = [];
        //   for (let count in data.finalTally.count) {
        //     sortable.push([count, data.finalTally.count[count]]);
        //   }

        //   sortable.sort(function (a, b) {
        //     return a[1] - b[1];
        //   });

        //   let objSorted = {};
        //   sortable.forEach(function (item) {
        //     objSorted[item[0]] = item[1];

        //     return objSorted;
        //   });
        // };

        Object.entries(data.finalTally.count).forEach(
          ([key, value], _index) => {
            // if (key === "good_feature") {
            //   labelspositive.innerHTML += `<span id="labelbutton${key}" class="lime lighten-4 blue-text text-darken-2 btn">Good Feature (${value})</span>`;
            //   keys.push(key);
            // }
            // if (key === "worked_as_intended") {
            //   labelspositive.innerHTML += `<span id="labelbutton${key}" class="lime lighten-4 blue-text text-darken-2 btn">Worked as Intended (${value})</span>`;
            //   keys.push(key);
            // }
            if (key === "good_features") {
              labelspositive.innerHTML += `<span id="labelbutton${key}" class="positivebutt">Good Features (${value})</span>`;
              keys.push(key);
            }
            if (key === "good_quality_performance") {
              labelspositive.innerHTML += `<span id="labelbutton${key}" class="positivebutt">Good Quality / Performance (${value})</span>`;
              keys.push(key);
            }
            if (key === "good_usability") {
              labelspositive.innerHTML += `<span id="labelbutton${key}" class="positivebutt">Good Usability (${value})</span>`;
              keys.push(key);
            }
          }
        );

        Object.entries(data.finalTally.count).forEach(
          ([key, value], _index) => {
            // if (key === "faulty_device") {
            //   labelsnegative.innerHTML += `<span id="labelbutton${key}" class="red lighten-4 indigo-text text-darken-4 btn">Faulty Device (${value})</span>`;
            //   keys.push(key);
            // }
            if (key === "lack_of_features") {
              labelsnegative.innerHTML += `<span id="labelbutton${key}" class="negativebutt">Lack of Features (${value})</span>`;
              keys.push(key);
            }
            if (key === "low_build_quality_performance") {
              labelsnegative.innerHTML += `<span id="labelbutton${key}" class="negativebutt">Low Quality / Performance (${value})</span>`;
              keys.push(key);
            }
            if (key === "poor_usability") {
              labelsnegative.innerHTML += `<span id="labelbutton${key}" class="negativebutt">Poor Usability (${value})</span>`;
              keys.push(key);
            }
          }
        );

        keys.forEach((key) => {
          const targetButton = document.querySelector(`#labelbutton${key}`);
          targetButton.addEventListener("click", () => handleCloud(key));
        });

        Object.entries(data.snippetCollection.snippetCollection).forEach(
          ([key, value], index, array) => {
            cloudcontainer.innerHTML += `<div id="cloud${key}"></div>`;
            console.log(`#cloud${key}`);
            console.log({ value });
            setTimeout(() => {
              cloudGenerator(`#cloud${key}`, value);
            }, 100);
            document.querySelector(`#cloud${key}`).style.display = "none";

            if (key === "good_features") {
              document.querySelector(`#cloud${key}`).style.display = "block";
            }
          }
        );

        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            modalBody.innerHTML = "";
          }
        };
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  for (let i = 0; i < targetNode.length; i++) {
    let block = document.createElement("span");
    console.log(targetNode[i]);

    // let image =
    //   targetNode[i].parentNode.parentNode.parentNode.parentNode.parentNode
    //     .parentNode.parentNode.firstElementChild.firstElementChild
    //     .firstElementChild.firstElementChild.firstElementChild.firstElementChild
    //     .firstElementChild.src;

    // let title =
    //   targetNode[i].parentNode.parentNode.parentNode.parentNode.parentNode
    //     .parentNode.parentNode.firstElementChild.firstElementChild
    //     .firstElementChild.firstElementChild.firstElementChild.firstElementChild
    //     .firstElementChild.alt;

    // console.log(title);

    block.innerHTML += `
      <!-- Trigger/Open The Modal -->
<button name=${targetNode[i]
      .querySelector("span:nth-child(2) > a")
      .getAttribute("href")} id="myBtn${i}">Revyou</button>
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
