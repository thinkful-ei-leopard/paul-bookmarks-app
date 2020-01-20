import store from './store.js';
import api from './api.js';

'use strict';

// TODO -- CONSIDER SPLITTING THIS FILE

//TODO - EXTENSION GOALS

//TODO - FILTER DROPDOWN FIX

//TODO - When deleting a bookmark, briefly flashes unexpanded bookmark

// * removes header animation after page load
setTimeout(function() {
  store.initialLoad = false;
}, 300);


const generateBookmarkItem = function (item, filterValue) {
  if (item.rating < filterValue ) {
    return '';
  }
  // if url title longer than 23 characters, cut off and affix ellipses to save space
  let title = item.title;
  let length = 23;

  const trimString = function() {
    if (title.length > length) {
      title = title.substring(0, length) + '...';
    } else {
      title = item.title;
    }
  };
  trimString();

  if (item.expanded) {
    return `<li class="bookmark expanded" data-item-id="${item.id}" tabindex="0">
  <div class="title-rating-expanded">
  <span class="bookmark-title-expanded">${title}</span>
  <span class="bookmark-rating-expanded"><span class="rated">Rated</span> ${item.rating}/5</span>
  </div>
  <p>${item.desc}</p>
  <a href = "${item.url}" target = "_blank">${item.url}</a>
  <button class="delete-bookmark">Delete</button>
</li>`;
  } else {
    return `<li class="bookmark" data-item-id="${item.id}" tabindex="0">
      <span class="bookmark-title">${title}</span>
      <span class="bookmark-rating">${item.rating}/5</span>
    </li>`;
  }
};


const generateBookmarkListString = function (bookmarks) {
  const items = bookmarks.map((item) => generateBookmarkItem(item, store.filter));
  return items.join('');
};


const generateError = function (message) {
  return `
  <main class="container">

  <header>
    <h1>My Bookmarks</h1>
  </header>

  <section class="error-view">

    <p class="error-message">There's been an error: ${message}</p>
    <button class="error-return">Return to bookmarks list</button>

  </section>

  </main>`;
};


const generateInitialView = function() {
  const bookmarkListString = generateBookmarkListString(store.bookmarkList);

  let filterMessage = '';

  if (store.filter > 0) {
    filterMessage = `<p class="filter-message">Bookmarks ranked ${store.filter} or higher: </p>`;
  } else {
    filterMessage = '';
  }


  let initialBody = `<section class="initial-view-buttons">
  <button class="add-new-button">Add New Bookmark</button>
  <form id="bookmarks-form"></form>
  <label aria-label="filter by rating" for="filter-dropdown"></label>
  <select name="ratings" id="filter-dropdown">
  <option name="select0" value="0">Filter By Rating</option>
  <option name="select1" value="5">&#9733; &#9733; &#9733; &#9733; &#9733; or more</option>
  <option name="select2" value="4">&#9733; &#9733; &#9733; &#9733; or more</option>
  <option name="select3" value="3">&#9733; &#9733; &#9733; or more</option>
  <option name="select4" value="2">&#9733; &#9733; or more</option>
  <option name="select5" value="1">&#9733; or more</option>
  </select>
</form>



</section>

<section class="bookmarks-list-section">
${filterMessage}
  <ul class="bookmarks-list">
  ${bookmarkListString}
  </ul>
</section>

</main>
`;

  if (store.initialLoad) {
    return `<main class="container">

  <header>
    <h1 class="animated bounceInDown delay-.5s" id="my-bookmarks-header">My Bookmarks</h1>
  </header>

  ${initialBody}`;
  } else {
    return `<main class="container">

  <header>
    <h1 id="my-bookmarks-header">My Bookmarks</h1>
  </header>

  ${initialBody}`;
  }
};

const generateAddBookmarkView = function() {
  return `<main class="container">

<header>
  <h1>My Bookmarks</h1>
</header>

<section class="add-bookmark-view">

  <form id="add-new-bookmark-form" autocomplete="off">

    <label aria-label="new bookmark title" class="new-bookmark-label" for="new-bookmark-title">Add new bookmark title:</label>
    <input class="new-bookmark-input" type="text" name="title" placeholder="New bookmark" id="new-bookmark-title" required>

    <label aria-label="new bookmark url" class="new-bookmark-label" for="new-bookmark-url"> Enter bookmark url: </label>
    <input class="new-bookmark-input" type="text" name="url" placeholder="https://www.newbookmark.com" id="new-bookmark-url" required>

    <label aria-label="new-bookmark-rating" class="new-bookmark-label" for="new-bookmark-rating">Add bookmark rating:</label>
    <span>
    <select class="new-bookmark-rating" name="add-rating" id="new-bookmark-rating" multiple required>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    </select>
  </span>

    <label aria-label="new bookmark description" class="new-bookmark-label" for="new-bookmark-description"> Add description:</label>
    <textarea cols="20" rows="5" class="new-bookmark-input" type="text" name="description" id="new-bookmark-description" required></textarea>

    <input class="add-new-bookmark-button form-button" type="submit">

    <button class="return-button form-button" type="reset">Return to bookmarks list</button>

  </form>

</section>
</main>`;
}; 

//TODO check this against shopping list renderError if it's not working as is. might need to set error-container div in html so that it can be cleared with handleCloseError.
// ? maybe okay now ?  

const endAnimationHeader = function() {
  $('body').on('click', function() {
    store.initialLoad = false;
  });
};

const renderError = function (message) {
  if (store.error) {
    const el = generateError(message);
    $('body').html(el);
  }
};

const handleCloseError = function () {
  $('.container').on('click', '.error-return', () => {
    console.log('I was clicked');
    store.setError(null);
    renderError();
  });
};

// * RENDER FUNCTION

const render = function () {

  renderError();

  if (store.adding === false) {
    let initialView = generateInitialView();
    $('body').html(initialView);
  } else {
    let addBookmarkView = generateAddBookmarkView();
    $('body').html('');
    $('body').html(addBookmarkView);
  }
};

// TODO -- LIST VIEW HANDLERS

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.bookmark')
    .data('item-id');
};

const handleAddNewBookmark = function() {
  $('body').on('click', '.add-new-button', function() {
    store.adding = true;
    render();
  });
};

const handleRatingsSelection = function () {
  $('body').on('change', '#filter-dropdown', function (event) {
    event.preventDefault();
    console.log(event);
    // console.log(this);
    // $('#filter-dropdown').html($('#filter-dropdown').val());
    const filterValue = parseInt($('#filter-dropdown').val());
    store.filter = filterValue;
    console.log(filterValue);
    store.bookmarkList.forEach(item => item.expanded = false);

    // $('#filter-dropdown').selected = true;

    // $('#filter-dropdown').text('#filter-dropdown option:selected').val();
    
    // let dropdown = document.getElementById('filter-dropdown');
    // dropdown.textContent = dropdown.value();

    // $('#filter-dropdown').html($('#filter-dropdown').attr('name'));
    render();
  });  
};

const handleDeleteBookmark = function() {
  $('body').on('click', '.delete-bookmark', function(event) {
    console.log('I was clicked');
    console.log(event.currentTarget);
    const id = getItemIdFromElement(event.currentTarget);
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  });
};

const handleToggleExpandedView = function() {
  $('body').on('click', '.bookmark', function(event) {
    const itemId = getItemIdFromElement(event.target);
    store.bookmarkList.forEach(item => {
      if (item.id === itemId) {
        item.expanded = !item.expanded;
        render();
        console.log(store.initialLoad);
      }
    });
  });
};

//TODO -- ADDING VIEW HANDLERS

const handleUrlInput = function(url) {
  let string = url;

  if (string) {
    if (!~string.indexOf('http') && ~string.indexOf('www')) {
      string = 'https://' + string;
    } else if (!~string.indexOf('http') && !~string.indexOf('www')) {
      string = 'https://www.' + string;
    }
  }
  return string;
};

const handleSubmitNewBookmark = function () {
  $('body').on('submit', '#add-new-bookmark-form', function(event){
    console.log('I was clicked');
    event.preventDefault(); 
    let newBookmarkTitle = $('#new-bookmark-title').val();
    let newBookmarkUrl = $('#new-bookmark-url').val();
    let newBookmarkRating = $('#new-bookmark-rating').val();
    let newBookmarkDescription = $('#new-bookmark-description').val();

    let validatedUrl = handleUrlInput(newBookmarkUrl);

    let newBookmark = {
      title: newBookmarkTitle,
      url: validatedUrl, 
      desc: newBookmarkDescription,
      rating: newBookmarkRating
    };

    $('.new-bookmark-input').val('');

    api.createBookmark(newBookmark)
      .then((newItem) => {
        store.addItem(newItem);
        store.adding = false;
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError(store.error);
      });
  });
};

const handleReturnToList = function () {
  $('body').on('click', '.return-button', function() {
    console.log('I was clicked');
    store.adding = false;
    render();
  });
};

const handleHeaderReturn = function() {
  $('body').on('click', 'h1', function() {
    store.adding = false;
    render();
  });
};

// TODO -- ERROR VIEW HANDLER

const errorReturnToList = function() {
  $('body').on('click', '.error-return', function() {
    store.error = null;
    render();
  } );
};

const bindEventListeners = function() {
  handleCloseError();
  handleSubmitNewBookmark();
  handleAddNewBookmark();
  handleDeleteBookmark();
  handleReturnToList();
  handleToggleExpandedView();
  getItemIdFromElement();
  errorReturnToList();
  handleRatingsSelection();
  endAnimationHeader();
  handleUrlInput();
  handleHeaderReturn();
};

export default {
  render,
  bindEventListeners
};






