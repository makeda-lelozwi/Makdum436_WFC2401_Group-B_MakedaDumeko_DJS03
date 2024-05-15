import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

let page = 1; //unclear variable naming
let matches = books;

//DISPLAYING THE FIRST 36 BOOKS TO DOM

//use document fragments to periodically push elements/changes to the DOM; unclear name
const starting = document.createDocumentFragment();

/*iterates over the books array, takes out the first 36 items (books) from that array, and adds them them to the doc. frag.
as a collection of clickable previews
(showing the cover, title and author(s) of the book)*/
for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
  const element = document.createElement("button"); //use more descriptive naming
  element.classList = "preview";
  element.setAttribute("data-preview", id); //creates new custom attribute called "data-preview" and sets the value to be the book's id

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

  starting.appendChild(element);
}

//pushes the doc. frag. to the DOM by appending to a pre-existing div in the HTML (with the name "data-list-items")
document.querySelector("[data-list-items]").appendChild(starting);

//CREATING THE LIST OF ALL GENRES IN THE SEARCH MODAL

//doc. frag. for the genres drop-down found in the search modal
const genreHtml = document.createDocumentFragment();

//ensures that the first option in the select is "all genres"
const firstGenreElement = document.createElement("option"); //it would be semantically correct to put this inside a <select></select>
firstGenreElement.value = "any";
firstGenreElement.innerText = "All Genres";
genreHtml.appendChild(firstGenreElement);

//loops through the genres array and creates an <option> for each genre and appends all the genre options to the genreHTML doc. fragment
for (const [id, name] of Object.entries(genres)) {
  const element = document.createElement("option"); //confusion: "element" was already created in line 15
  element.value = id;
  element.innerText = name;
  genreHtml.appendChild(element);
}

//pushes the genreHTML doc. fragment to the DOM via the div named data-search-genres
document.querySelector("[data-search-genres]").appendChild(genreHtml);

//CREATING THE LIST OF ALL AUTHORS IN THE SEARCH MODAL

//doc. frag. for the authors drop-down found in the search modal
const authorsHtml = document.createDocumentFragment();

//ensures that the first option in the select is "all authors"
const firstAuthorElement = document.createElement("option");
firstAuthorElement.value = "any";
firstAuthorElement.innerText = "All Authors";
authorsHtml.appendChild(firstAuthorElement);

//loops through the authors array and creates an <option> for each author and appends all the author options to the authorsHTML doc. fragment
for (const [id, name] of Object.entries(authors)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  authorsHtml.appendChild(element);
}
//pushes the authorsHTML doc. fragment to the DOM via the div named data-search-authors
document.querySelector("[data-search-authors]").appendChild(authorsHtml);

//TOGGLING DAY AND NIGHT THEMES
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches //checks if the user prefers dark mode on their system
) {
  document.querySelector("[data-settings-theme]").value = "night"; //selects the "night" option from the "overlay__input" <select>
  document.documentElement.style.setProperty("--color-dark", "255, 255, 255"); //sets base colors (CSS) to match a dark theme
  document.documentElement.style.setProperty("--color-light", "10, 10, 20");
} else {
  document.querySelector("[data-settings-theme]").value = "day"; //selects the "day" option from the "overlay__input" <select>
  document.documentElement.style.setProperty("--color-dark", "10, 10, 20"); //sets base colors (CSS) to match a light theme
  document.documentElement.style.setProperty("--color-light", "255, 255, 255");
}

//LOGIC FOR ENABLING THE SHOW MORE BUTTON
document.querySelector("[data-list-button]").innerText = `Show more (${
  books.length - BOOKS_PER_PAGE
})`; //as the #books displays /, the number in the brackets should go down

document.querySelector("[data-list-button]").innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })</span>
`; //this is basically repetition

document.querySelector("[data-list-button]").disabled =
  matches.length - page * BOOKS_PER_PAGE > 0; //if there are no more books to be displayed then the button is set to disabled

//EVENT LISTENERS
//"Cancel" to close the search modal
document.querySelector("[data-search-cancel]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = false;
});

//"Cancel" to close the settings modal (where user can choose between light and dark theme)
document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = false;
  });

//Opens the search modal and focuses on the input where users can type-in a search for a title
document.querySelector("[data-header-search]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = true;
  document.querySelector("[data-search-title]").focus();
});

//Opens the settings modal
document
  .querySelector("[data-header-settings]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = true;
  });

//Closes the modal that has more info about a selected book
document.querySelector("[data-list-close]").addEventListener("click", () => {
  document.querySelector("[data-list-active]").open = false;
});

//Changing the theme when the user manually sets it from settings (instead of from system preferences)
document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    if (theme === "night") {
      document.documentElement.style.setProperty(
        "--color-dark",
        "255, 255, 255"
      );
      document.documentElement.style.setProperty("--color-light", "10, 10, 20");
    } else {
      document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
      document.documentElement.style.setProperty(
        "--color-light",
        "255, 255, 255"
      );
    }
    //closes the settings modal after changing the theme and pressing save (not saved to localStorage)
    document.querySelector("[data-settings-overlay]").open = false;
  });

document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData); //converts form data into an object
    const result = []; //empty array to store filtered books

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
        result.push(book);
      }
    }

    page = 1;
    matches = result;

    //Error handling for if there is no book that matches the search/filter, then the message already typed in the HTML will show
    if (result.length < 1) {
      document
        .querySelector("[data-list-message]")
        .classList.add("list__message_show");
    } else {
      document
        .querySelector("[data-list-message]")
        .classList.remove("list__message_show");
    }

    document.querySelector("[data-list-items]").innerHTML = ""; //makes the page that's supposed to show all the book previews empty

    //DISPLAYING THE FILTERED BOOKS TO THE DOM (can reuse the earlier function for displaying objects but tweak it a little)
    const newItems = document.createDocumentFragment();

    for (const { author, id, image, title } of result.slice(
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

      newItems.appendChild(element);
    }

    document.querySelector("[data-list-items]").appendChild(newItems);

    //same logic for the "show more" button
    document.querySelector("[data-list-button]").disabled =
      matches.length - page * BOOKS_PER_PAGE < 1;

    document.querySelector("[data-list-button]").innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
          matches.length - page * BOOKS_PER_PAGE > 0
            ? matches.length - page * BOOKS_PER_PAGE
            : 0
        })</span>
    `;

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector("[data-search-overlay]").open = false;
  });

//EXTENDING THE PAGE AND SHOWING MORE BOOKS AFTER CLICKING "SHOW MORE"
document.querySelector("[data-list-button]").addEventListener("click", () => {
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

  document.querySelector("[data-list-items]").appendChild(fragment);
  page += 1;
});

//EVENT LISTENER FOR DISPLAYING BOOK INFO WHEN CLICKING ON IT
document
  .querySelector("[data-list-items]")
  .addEventListener("click", (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

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
      document.querySelector("[data-list-active]").open = true;
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
