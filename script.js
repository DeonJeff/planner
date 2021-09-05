var currentDayContent = document.querySelector("#currentDay");
var containerContent  = document.querySelector(".container");

var myDate;
var myDateNow = dayjs().format("MM/DD/YYYY");

var myCurrentClass = "";
var myCurrentHour  = "";

function displayDate() {
    searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has("v1")) {
        myDate = searchParams.get("v1");
        myDate = dayjs(myDate).format("MM/DD/YYYY");
    } else {
        myDate = dayjs().format("MM/DD/YYYY");            
    }

    var h3Element = document.createElement("h3");
    h3Element.textContent = myDate;
    currentDayContent.appendChild(h3Element);

    var myYesterday = dayjs(myDate).subtract(1, 'day').format("MM/DD/YYYY");
    var myTomorrow  = dayjs(myDate).add(1, 'day').format("MM/DD/YYYY");    

    var h3Element = document.createElement("h3");
    h3Element.innerHTML = "<a href='index.html?v1=" + myYesterday + "'><i class='fas fa-arrow-circle-left'></i></a>  <a href='index.html?v1=" + myTomorrow + "'><i class='fas fa-arrow-circle-right'></i></a>  <i class='fas fa-cog'></i>";
    currentDayContent.appendChild(h3Element);
}

function displayCalendar() {
    myHour    = 6;
    myHourNow = dayjs().format("H");

    for (index = 0; index < 18; index++) {
        // To-Do: Get Value from Local Storage        
        var myFormattedHour = ("0" + myHour).slice(-2);        

        myDescription = localStorage.getItem("ws" + dayjs(myDate).format("MM") + dayjs(myDate).format("DD") + dayjs(myDate).format("YYYY") + myFormattedHour);

        myClock = dayjs(myDate).set('hour', myHour);

        // row
        var divContainer = document.createElement("div");
        divContainer.className = "row";
        containerContent.appendChild(divContainer);

        // hour
        divElement = document.createElement("div");
        divElement.className = "hour";
        divElement.textContent = myClock.format("h A");
        divContainer.appendChild(divElement);


        // task text
        // determine class for grey / red / or green column
        if (myDate > myDateNow) {
            myClass = 'future';
        } else if (myDate < myDateNow) {
            myClass = 'past';
        } else {
            if (myHour < myHourNow) {
                myClass = "past";
            } else if (myHour > myHourNow) {
                myClass = "future";
            } else {
                myClass = "present";
            }
        }

        divElement = document.createElement("div");
        divElement.id = "myTask";
        divElement.textContent = myDescription;
        divElement.className = myClass;
        divElement.setAttribute("data-id", myHour);
        divContainer.appendChild(divElement);
        
        // save button
        btnElement = document.createElement("btn");
        btnElement.innerHTML = "<i class='fas fa-save'></i>";
        btnElement.className = "saveBtn";
        divContainer.appendChild(btnElement);        

        myHour++;
    }
}

displayDate();
displayCalendar();

// flip div to textarea
$(".container").on("click", "#myTask", function() {
    var myText = $(this).text().trim();
    var textInput = $("<textarea>")
        .addClass("textarea")
        .val(myText);

    $(this).replaceWith(textInput);
    textInput.trigger("focus");

    myCurrentHour  = $(this).attr("data-id");
    myCurrentClass = $(this).attr('class');
});

// flip textarea to div
$(".container").on("blur", "textarea", function() {    
    var myText = $(this).val().trim();
    var myStatus = $(this).closest(".container");
    var index = $(this).closest(".container").index();
    var taskDiv = $("<div id='myTask' class='" + myCurrentClass + "' data-id='" + myCurrentHour + "'>").text(myText);
    $(this).replaceWith(taskDiv);
});

// Save Button - set to Local Storage when the button is clicked
$(".container").on("click", ".saveBtn", function() {
    var myFormattedHour = ("0" + myCurrentHour).slice(-2);
    var mykeyName  = "ws" + dayjs(myDate).format("MM") + dayjs(myDate).format("DD") + dayjs(myDate).format("YYYY") + myFormattedHour;

    var mykeyValue = document.querySelector("[data-id='" + myCurrentHour + "']").textContent;

    localStorage.setItem(mykeyName, mykeyValue);
});