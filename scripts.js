import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

let page = 1; //unclear variable naming
let matches = books; //maybe change this to booksArray or booksObject

//ALL THE NECESSARY ELEMENTS FROM THE DOM
const booksListDiv = document.querySelector("[data-list-items]");

const genreDropDownMenu = document.querySelector("[data-search-genres]");
const authorDropDownMenu = document.querySelector("[data-search-authors]");

const themeToggleSelect = document.querySelector("[data-settings-theme]");

const showMoreBtn = document.querySelector("[data-list-button]");

const searchBtn = document.querySelector("[data-header-search]");
const searchOverlay = document.querySelector("[data-search-overlay]");
const bookSearchForm = document.querySelector("[data-search-form]");
const titleSearchInput = document.querySelector("[data-search-title]");
const searchCancelBtn = document.querySelector("[data-search-cancel]");
const noResultsMessage = document.querySelector("[data-list-message]");

const settingsBtn = document.querySelector("[data-header-settings]");
const settingsOverlay = document.querySelector("[data-settings-overlay]");
const themeSettingsForm = document.querySelector("[data-settings-form]");
const settingsCancelBtn = document.querySelector("[data-settings-cancel]");

const moreInfoOverlay = document.querySelector("[data-list-active]");
const moreInfoOverlayCloseBtn = document.querySelector("[data-list-close]");

//DISPLAYING THE FIRST 36 BOOKS TO DOM

//use document fragments to periodically push elements/changes to the DOM; unclear name
const initialPageLoadFrag = document.createDocumentFragment();

/*iterates over the books array, takes out the first 36 items (books) from that array, and adds them them to the doc. frag.
as a collection of clickable previews
(showing the cover, title and author(s) of the book)*/
for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
  const bookPreviewBtn = document.createElement("button"); //use more descriptive naming
  bookPreviewBtn.classList = "preview";
  bookPreviewBtn.setAttribute("data-preview", id); //creates new custom attribute called "data-preview" and sets the value to be the book's id

  bookPreviewBtn.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;

  initialPageLoadFrag.appendChild(bookPreviewBtn);
}

//pushes the doc. frag. to the DOM by appending to a pre-existing div in the HTML (with the name "data-list-items")
booksListDiv.appendChild(initialPageLoadFrag);

//CREATING THE LIST OF ALL GENRES IN THE SEARCH MODAL

//doc. frag. for the genres drop-down found in the search modal
const genreSelectFrag = document.createDocumentFragment();

//ensures that the first option in the select is "all genres"
const firstGenreElement = document.createElement("option"); //it would be semantically correct to put this inside a <select></select>
firstGenreElement.value = "any";
firstGenreElement.innerText = "All Genres";
genreSelectFrag.appendChild(firstGenreElement);

//loops through the genres array and creates an <option> for each genre and appends all the genre options to the genreHTML doc. fragment
for (const [id, name] of Object.entries(genres)) {
  const genreOption = document.createElement("option"); //confusion: "element" was already created in line 15
  genreOption.value = id;
  genreOption.innerText = name;
  genreSelectFrag.appendChild(genreOption);
}

//pushes the genreHTML doc. fragment to the DOM via the div named data-search-genres
genreDropDownMenu.appendChild(genreSelectFrag);

//CREATING THE LIST OF ALL AUTHORS IN THE SEARCH MODAL

//doc. frag. for the authors drop-down found in the search modal
const authorSelectFrag = document.createDocumentFragment();

//ensures that the first option in the select is "all authors"
const firstAuthorElement = document.createElement("option");
firstAuthorElement.value = "any";
firstAuthorElement.innerText = "All Authors";
authorSelectFrag.appendChild(firstAuthorElement);

//loops through the authors array and creates an <option> for each author and appends all the author options to the authorSelectFrag doc. fragment
for (const [id, name] of Object.entries(authors)) {
  const authorOption = document.createElement("option");
  authorOption.value = id;
  authorOption.innerText = name;
  authorSelectFrag.appendChild(authorOption);
}
//pushes the authorSelectFrag doc. fragment to the DOM via the div named data-search-authors
authorDropDownMenu.appendChild(authorSelectFrag);

//TOGGLING DAY AND NIGHT THEMES
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches //checks if the user prefers dark mode on their system
) {
  themeToggleSelect.value = "night"; //selects the "night" option from the "overlay__input" <select>
  document.documentElement.style.setProperty("--color-dark", "255, 255, 255"); //sets base colors (CSS) to match a dark theme
  document.documentElement.style.setProperty("--color-light", "10, 10, 20");
} else {
  themeToggleSelect.value = "day"; //selects the "day" option from the "overlay__input" <select>
  document.documentElement.style.setProperty("--color-dark", "10, 10, 20"); //sets base colors (CSS) to match a light theme
  document.documentElement.style.setProperty("--color-light", "255, 255, 255");
}

//LOGIC FOR ENABLING THE SHOW MORE BUTTON
showMoreBtn.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`; //as the #books displays /, the number in the brackets should go down

showMoreBtn.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })</span>
`; //this is basically repetition

showMoreBtn.disabled = matches.length - page * BOOKS_PER_PAGE > 0; //if there are no more books to be displayed then the button is set to disabled

//EVENT LISTENERS
//"Cancel" to close the search modal
searchCancelBtn.addEventListener("click", () => {
  searchOverlay.open = false;
});

//"Cancel" to close the settings modal (where user can choose between light and dark theme)
settingsCancelBtn.addEventListener("click", () => {
  settingsOverlay.open = false;
});

//Opens the search modal and focuses on the input where users can type-in a search for a title
searchBtn.addEventListener("click", () => {
  searchOverlay.open = true;
  titleSearchInput.focus();
});

//Opens the settings modal
settingsBtn.addEventListener("click", () => {
  settingsOverlay.open = true;
});

//Closes the modal that has more info about a selected book
moreInfoOverlayCloseBtn.addEventListener("click", () => {
  moreInfoOverlay.open = false;
});

//Changing the theme when the user manually sets it from settings (instead of from system preferences)
themeSettingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  if (theme === "night") {
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty(
      "--color-light",
      "255, 255, 255"
    );
  }
  //closes the settings modal after changing the theme and pressing save (not saved to localStorage)
  settingsOverlay.open = false;
});

bookSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData); //converts form data into an object
  const filteredBooksArray = []; //empty array to store filtered books

  /*This for loop checks each book in the books array for any book that matches the genre that was selected by the user or for any books whose
    title matches the one typed in by the user. 
    
    */
  for (const book of books) {
    let genreMatch = filters.genre === "any";

    for (const singleGenre of book.genres) {
      if (genreMatch) break;
      if (singleGenre === filters.genre) {
        genreMatch = true;
      }
    }

    if (
      (filters.title.trim() === "" ||
        book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.author === "any" || book.author === filters.author) &&
      genreMatch
    ) {
      filteredBooksArray.push(book);
    }
  }

  page = 1;
  matches = filteredBooksArray;

  //Error handling for if there is no book that matches the search/filter, then the message already typed in the HTML will show
  if (filteredBooksArray.length < 1) {
    noResultsMessage.classList.add("list__message_show");
  } else {
    noResultsMessage.classList.remove("list__message_show");
  }

  booksListDiv.innerHTML = ""; //makes the page that's supposed to show all the book previews empty

  //DISPLAYING THE FILTERED BOOKS TO THE DOM (can reuse the earlier function for displaying objects but tweak it a little)
  const newItemsFrag = document.createDocumentFragment();

  for (const { author, id, image, title } of filteredBooksArray.slice(
    0,
    BOOKS_PER_PAGE
  )) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);

    element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

    newItemsFrag.appendChild(element);
  }

  booksListDiv.appendChild(newItemsFrag);

  //same logic for the "show more" button
  showMoreBtn.disabled = matches.length - page * BOOKS_PER_PAGE < 1;

  showMoreBtn.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
          matches.length - page * BOOKS_PER_PAGE > 0
            ? matches.length - page * BOOKS_PER_PAGE
            : 0
        })</span>
    `;

  window.scrollTo({ top: 0, behavior: "smooth" });
  searchOverlay.open = false;
});

//EXTENDING THE PAGE AND SHOWING MORE BOOKS AFTER CLICKING "SHOW MORE"
showMoreBtn.addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);

    element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

    fragment.appendChild(element);
  }

  booksListDiv.appendChild(fragment);
  page += 1;
});

//EVENT LISTENER FOR DISPLAYING BOOK INFO WHEN CLICKING ON ITS PREVIEW
booksListDiv.addEventListener("click", (event) => {
  const pathArray = Array.from(event.path || event.composedPath()); //retrieves clicked element's path
  let active = null;

  /* Iterates through each element in the path array and checks if each element has the attribute of "dataset.preview".
    If it finds an element with the attribute, it looks for the corresponding book in the "books" array based on the id stored in the dataset.
    Once it finds the corresponding book, it updates the UI to display details of the clicked book:
    - reveals a modal
    - sets the book's cover as the img tag's source
    - updates the titles with the book's title and author (taking the name from the "authors" array)
    also sets the publication date
    - updates the description with the book's description    
    */
  for (const node of pathArray) {
    if (active) break;

    if (node?.dataset?.preview) {
      let result = null;

      for (const singleBook of books) {
        if (result) break;
        if (singleBook.id === node?.dataset?.preview) result = singleBook;
      }

      active = result;
    }
  }

  if (active) {
    moreInfoOverlay.open = true;
    document.querySelector("[data-list-blur]").src = active.image;
    document.querySelector("[data-list-image]").src = active.image;
    document.querySelector("[data-list-title]").innerText = active.title;
    document.querySelector("[data-list-subtitle]").innerText = `${
      authors[active.author]
    } (${new Date(active.published).getFullYear()})`;
    document.querySelector("[data-list-description]").innerText =
      active.description;
  }
});
