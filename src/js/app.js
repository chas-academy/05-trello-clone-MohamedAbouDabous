import $ from "jquery";

require("webpack-jquery-ui");
import 'jquery-ui/themes/base/all.css';
import "../css/styles.css";

/**
 * jtrello
 * @return {Object} [Publikt tillgänliga metoder som vi exponerar]
 */

// Här tillämpar vi mönstret reavealing module pattern:
// Mer information om det mönstret här: https://bit.ly/1nt5vXP
const jtrello = (function($) {
  "use strict"; // https://lucybain.com/blog/2014/js-use-strict/

  // Referens internt i modulen för DOM element
  let DOM = {};

  /* =================== Privata metoder nedan ================= */
  function captureDOMEls() {
    DOM.$board = $(".board");
    DOM.$listDialog = $("#list-creation-dialog");
    DOM.$columns = $(".column");
    DOM.$lists = $(".list");
    DOM.$cards = $(".card");

    DOM.$newListButton = $("button#new-list");
    DOM.$deleteListButton = $(".list-header > button.delete");

    DOM.$newCardForm = $("form.new-card");
    DOM.$deleteCardButton = $(".card > button.delete");
  }

  function createTabs() {
    $('#tabs').tabs();
  }

  function createDialogs() {
    $("#list-creation-dialog").dialog({autoOpen: false});
  }

  /*
   *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
   *  createList, deleteList, createCard och deleteCard etc.
   */
  function bindEvents() {
    DOM.$newListButton.on("click", toggleDialog);
    DOM.$board.on("click", ".list-header > button.delete", deleteList);
    DOM.$listDialog.on("submit", "form.new-list", createList);

    DOM.$board.on("submit", "form.new-card", createCard);
    DOM.$board.on("click", ".card > button.delete", deleteCard);

    // DOM.$createDialogs.on("click", cards);
  }

  function toggleDialog() {
    $("#list-creation-dialog").dialog("open");
    $('#list-creation-dialog input.datepicker').datepicker();
  }

  /* ============== Metoder för att hantera listor nedan ============== */
  function createList() {
    event.preventDefault();
    let listTitleInput = $(this).find("input");
    let listDueDateInput = $(this).find("input.datepicker");
    let newListTitle = listTitleInput.val();
    let newListDueDate = listDueDateInput.val();
    
    $('#list-creation-dialog').dialog("close");
    
    listTitleInput.val("");
    listDueDateInput.val("");

    $('.column:last').before(`
    <div class="column">
      <div class="list">
            <div class="list-header">
                ${newListTitle} | <small>${newListDueDate}</small>
                <button class="button delete">X</button>
            </div>
            <ul class="list-cards">
                <li class="add-new">
                    <form class="new-card" action="index.html">
                        <input type="text" name="title" placeholder="Please name the card">
                        <button class="button add">Add new card</button>
                    </form>
                </li>
            </ul>
        </div>
      </div>
     `)
     dragAndDrop();
  }

  function deleteList() {
    console.log("This should delete the list you clicked on");
    $(this).closest('.column').remove()
  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();

    let cardTitleInput = $(this).find("input");
    let newCardTitle = cardTitleInput.val();

    $(this).parent().before(`
        <li class="card">
            ${newCardTitle}
            <button class="button delete">X</button>
        </li>
      `);

    cardTitleInput.val("");
  }

  function deleteCard() {
    $(this)("input").remove()
  }


  function dragAndDrop() {
    $(".list-cards").sortable({
      connectWith: ".list-cards"
    });

    $(".column").sortable( {
      connectWith: ".column"
    });
  
  }
  // Metod för att rita ut element i DOM:en
  function render() {}

  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    console.log(":::: Initializing JTrello ::::");
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    createDialogs();
    dragAndDrop();
    bindEvents();
  }

  // All kod här
  return {
    init: init
  };
})($);

//usage
$("document").ready(function() {
  jtrello.init();
});

